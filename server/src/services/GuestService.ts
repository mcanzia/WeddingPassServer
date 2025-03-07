import { Guest } from "../models/Guest";
import Logger from "../util/logs/logger";
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import { inject, injectable } from "inversify";
import { SubEventDao } from "../dao/SubEventDao";
import { TYPES } from "../configs/types";
import { SubEvent } from "../models/SubEvent";
import { GuestDao } from "../dao/GuestDao";
import { UploadValidation } from "../models/UploadValidation";
import { DUPLICATE_GUEST, EMAIL_BAD_FORMAT, EMAIL_MISSING, EMAIL_TOO_LONG, MISSING_EVENT, NAME_MISSING, NAME_TOO_LONG, PARTY_NUMBER_MISSING, PHONE_TOO_LONG } from "../util/upload/ValidationErrors";
import validator from 'validator';
import { TransportationType } from "../models/TransportationType";
import { Transportation } from "../models/Transportation";
import { Accommodation } from '../models/Accommodation';
import { Drinks } from "../models/Drinks";
import { Parser } from 'json2csv';
import { CustomError } from "../util/error/CustomError";
import { UploadGuestLists } from "../models/UploadGuestLists";
import { AccommodationDao } from "../dao/AccommodationDao";

@injectable()
export class GuestService {

    constructor(
        @inject(TYPES.SubEventDao) private subEventDao: SubEventDao,
        @inject(TYPES.GuestDao) private guestDao: GuestDao,
        @inject(TYPES.AccommodationDao) private accommodationDao: AccommodationDao
    ) { }

    async parseCSV(buffer: Buffer, eventId: string): Promise<UploadGuestLists> {
        const createGuests: Guest[] = [];
        const updateGuests: Guest[] = [];
        const stream = Readable.from(buffer.toString());

        const subEvents: SubEvent[] = await this.subEventDao.getAllSubEvents(eventId);
        const accommodations: Accommodation[] = await this.accommodationDao.getAllAccommodations(eventId);

        return new Promise((resolve, reject) => {
            stream.pipe(csvParser())
                .on('data', (data) => {
                    if (data['Id']) {
                        const guest = this.updateGuestFromData(data, accommodations);
                        updateGuests.push(guest);
                    } else {
                        const guest = this.createGuestFromData(data, eventId, subEvents, accommodations);
                        createGuests.push(guest);
                    }
                })
                .on('end', () => {
                    resolve({ createGuests, updateGuests } as UploadGuestLists);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    async parseExcel(buffer: Buffer, eventId: string): Promise<UploadGuestLists> {
        const createGuests: Guest[] = [];
        const updateGuests: Guest[] = [];
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const headers = worksheet.getRow(1).values as string[];

        const subEvents: SubEvent[] = await this.subEventDao.getAllSubEvents(eventId);
        const accommodations: Accommodation[] = await this.accommodationDao.getAllAccommodations(eventId);

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const data: { [key: string]: any } = {};
            const rowValues = row.values as (string | number | undefined)[];

            headers.forEach((header, index) => {
                const value = rowValues[index];
                data[header] = value;
            });

            if (data['Id']) {
                const guest = this.updateGuestFromData(data, accommodations);
                updateGuests.push(guest);
            } else {
                const guest = this.createGuestFromData(data, eventId, subEvents, accommodations);
                createGuests.push(guest);
            }

        });

        return { createGuests, updateGuests } as UploadGuestLists;
    }

    private createGuestFromData(data: any, eventId: string, subEvents: SubEvent[], accommodations: Accommodation[]): Guest {
        const guest: Partial<Guest> = {};

        guest.id = '';
        guest.eventId = eventId;
        guest.name = (data['Name'] || '').trim();
        guest.email = (data['Email'] || '').trim();
        guest.phone = this.cleanPhoneField(data['Phone']);
        guest.serialNumber = (data['Serial Number'] || '').trim();
        guest.groupNumber = Number(data['Party Number'] || -1);
        guest.dietaryRestrictions = (data['Dietary Restrictions'] || '').trim();

        // SubEvents
        guest.subEvents = this.parseGuestEvents(data, subEvents);

        // Arrival Transportation
        guest.arrival = this.parseTransportation(data, 'Arrival Type', true);

        // Departure Transportation
        guest.departure = this.parseTransportation(data, 'Departure Type', false);

        // Accommodation
        guest.accommodation = this.parseAccommodation(data, accommodations);

        return guest as Guest;
    }

    private updateGuestFromData(data: any, accommodations: Accommodation[]): Guest {
        const guest: Partial<Guest> = {};

        guest.id = data['Id'].trim();
        guest.eventId = data['Event Id'];
        guest.name = (data['Name'] || '').trim();
        guest.email = (data['Email'] || '').trim();
        guest.serialNumber = (data['Serial Number'] || '').trim();
        guest.groupNumber = Number(data['Party Number'] || -1);
        guest.dietaryRestrictions = (data['Dietary Restrictions'] || '').trim();

        // Arrival Transportation
        guest.arrival = this.parseTransportation(data, 'Arrival Type', true);

        // Departure Transportation
        guest.departure = this.parseTransportation(data, 'Departure Type', false);

        // Accommodation
        guest.accommodation = this.parseAccommodation(data, accommodations);

        return guest as Guest;
    }

    private parseGuestEvents(data: any, subEvents: SubEvent[]): SubEvent[] {
        const events: SubEvent[] = [];

        for (let weddingEvent of subEvents) {
            const invitedStatus = data[weddingEvent.name];
            if (invitedStatus && ['yes', 'done', 'y', 'true'].includes(String(invitedStatus).trim().toLowerCase())) {
                events.push(weddingEvent);
            }
        }

        return events;
    }

    private parseTransportation(data: any, typeField: string, isArrival: boolean): Transportation | undefined {
        const transportationTypeValue = data[typeField];
        if (!transportationTypeValue) return undefined;

        const prefix = isArrival ? "Arr" : "Dep";

        let transportation = {
            isArrival: isArrival,
            type: transportationTypeValue,
            number: String(data[`${prefix}.Num`]).trim()
        } as Transportation;

        transportation.time = this.combineDateTime(data[`${prefix}.Date`], data[`${prefix}.Time`]);

        return transportation;
    }

    private combineDateTime(dateStr: string, timeStr: string): string {
        const date = new Date(`${dateStr} ${timeStr}`);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;

    }

    private cleanPhoneField(phone: string): string {
        if (!phone) {
            return '';
        }
        let cleaned = phone.trim().replace(/[^\d+]/g, '');
        if (cleaned.indexOf('+') > 0) {
            cleaned = cleaned.replace(/\+/g, '');
        }
        return cleaned;
    }

    private parseAccommodation(data: any, accommodations: Accommodation[]): Accommodation {

        const accommodationName = data['Accommodation'];
        const roomNumber = data['Room Number'];

        const assignedAccommodation = accommodations.find(acc => acc.name === accommodationName);

        let accommodation = {} as Accommodation;

        if (assignedAccommodation) {
            accommodation = assignedAccommodation;
            accommodation.roomNumber = roomNumber;
        }

        return accommodation;
    }


    async validateGuests(eventId: string, guestLists: UploadGuestLists): Promise<UploadValidation> {
        const currentGuestNames = (await this.guestDao.getAllGuests(eventId)).map(guest => guest.name.toLowerCase());

        const uploadIssues: Map<string, string> = new Map<string, string>();
        const validatedCreateGuests: Guest[] = [];
        const validatedUpdateGuests: Guest[] = [];

        guestLists.createGuests.forEach((guest, index) => {
            const validationError = this.validateGuest(guest, currentGuestNames);
            if (validationError) {
                uploadIssues.set(guest.name || `Unknown ${index}`, validationError);
            } else {
                validatedCreateGuests.push(guest);
            }
        });

        guestLists.updateGuests.forEach((guest, index) => {
            const validationError = this.validateGuest(guest, currentGuestNames, true);
            if (validationError) {
                uploadIssues.set(guest.name || `Unknown ${index}`, validationError);
            } else {
                validatedUpdateGuests.push(guest);
            }
        });

        const uploadGuestLists = new UploadGuestLists(validatedCreateGuests, validatedUpdateGuests);

        return new UploadValidation(uploadIssues, uploadGuestLists);
    }

    private validateGuest(guest: Guest, currentGuestNames: string[], isUpdate = false): string | null {
        if (validator.isEmpty(guest.name)) {
            return NAME_MISSING;
        }

        if (guest.groupNumber === -1) {
            return PARTY_NUMBER_MISSING;
        }

        if (!isUpdate && currentGuestNames.includes(guest.name.toLowerCase())) {
            return DUPLICATE_GUEST;
        }

        if (guest.name.length > 100) {
            return NAME_TOO_LONG;
        }

        if (guest.email && guest.email.length > 50) {
            return EMAIL_TOO_LONG;
        }

        if (guest.phone && guest.phone.length > 50) {
            return PHONE_TOO_LONG;
        }

        return null;
    }

    private csvFields = [
        { label: 'Id', value: 'id' },
        { label: 'Wedding Id', value: 'eventId' },
        { label: 'Name', value: 'name' },
        { label: 'Party Number', value: 'groupNumber' },
        { label: 'Serial Number', value: 'serialNumber' },
        { label: 'SubEvents', value: 'subevents' },
        { label: 'Email', value: 'email' },
        { label: 'Accommodation', value: 'accommodation.name' },
        { label: 'Room Number', value: 'accommodation.roomNumber' },
        { label: 'Dietary Restrictions', value: 'dietaryRestrictions' },
        { label: 'Type of Drink', value: 'drinks.preferences' },
        { label: 'Arrival Type', value: 'arrival.type' },
        { label: 'Arr.Date', value: 'arrival.date' },
        { label: 'Arr.Time', value: 'arrival.time' },
        { label: 'Arr.Num', value: 'arrival.number' },
        { label: 'Departure Type', value: 'departure.type' },
        { label: 'Dep.Date', value: 'departure.date' },
        { label: 'Dep.Time', value: 'departure.time' },
        { label: 'Dep.Num', value: 'departure.number' },
    ];

    generateCSVContent(guests: Guest[]): string {
        try {
            const processedGuests = guests.map(guest => {
                const processedGuest = { ...guest } as any;

                // Format Arrival
                const guestArrival = guest.arrival as any;
                if (guestArrival) {
                    const [arrDate, arrTime] = guestArrival.time ? guestArrival.time.split('T') : ['', ''];
                    processedGuest.arrival = {
                        ...guestArrival,
                        date: arrDate ? this.formatDateString(arrDate) : '',
                        time: arrTime || '',
                    };
                }

                // Format Departure
                const guestDeparture = guest.departure as any;
                if (guestDeparture) {
                    const [depDate, depTime] = guestDeparture.time ? guestDeparture.time.split('T') : ['', ''];
                    processedGuest.departure = {
                        ...guestDeparture,
                        date: depDate ? this.formatDateString(depDate) : '',
                        time: depTime || '',
                    };
                }

                if (guest.drinks && Array.isArray(guest.drinks.preferences)) {
                    processedGuest.drinks = {
                        ...guest.drinks,
                        preferences: guest.drinks.preferences.join(', '),
                    };
                }

                if (guest.subEvents && Array.isArray(guest.subEvents)) {
                    processedGuest.subEvents = guest.subEvents.map(subEvent => subEvent.name).join(', ');
                }
                return processedGuest;
            });

            const opts = {
                fields: this.csvFields,
                header: true,
                quote: '"'
            };

            const parser = new Parser(opts);
            const csv = parser.parse(processedGuests);

            return csv;
        } catch (error: any) {
            throw new CustomError(error.message, 500);
        }
    }

    private formatDateString(dateStr: string): string {
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    }


}
