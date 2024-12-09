import { Guest } from "../models/Guest";
import Logger from "../util/logs/logger";
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import { inject, injectable } from "inversify";
import { EventDao } from "../dao/EventDao";
import { TYPES } from "../configs/types";
import { WeddingEvent } from "../models/WeddingEvent";
import { GuestDao } from "../dao/GuestDao";
import { UploadValidation } from "../models/UploadValidation";
import { DUPLICATE_GUEST, EMAIL_BAD_FORMAT, EMAIL_MISSING, EMAIL_TOO_LONG, MISSING_EVENT, NAME_MISSING, NAME_TOO_LONG, PARTY_NUMBER_MISSING, PHONE_TOO_LONG } from "../util/upload/ValidationErrors";
import validator from 'validator';
import { Flight } from "../models/Flight";
import { TransportationType } from "../models/TransportationType";
import { Train } from "../models/Train";
import { Bus } from "../models/Bus";
import { Transportation } from "../models/Transportation";
import { Accommodation } from "../models/Accommodation";
import { HotelDao } from "../dao/HotelDao";
import { Hotel } from "../models/Hotel";
import { Drinks } from "../models/Drinks";
import { Parser } from 'json2csv';
import { CustomError } from "../util/error/CustomError";
import { UploadGuestLists } from "../models/UploadGuestLists";

@injectable()
export class GuestService {

    constructor(
        @inject(TYPES.EventDao) private eventDao: EventDao,
        @inject(TYPES.GuestDao) private guestDao: GuestDao,
        @inject(TYPES.HotelDao) private hotelDao: HotelDao
    ) { }

    async parseCSV(buffer: Buffer, weddingId: string): Promise<UploadGuestLists> {
        const createGuests: Guest[] = [];
        const updateGuests: Guest[] = [];
        const stream = Readable.from(buffer.toString());

        const weddingEvents: WeddingEvent[] = await this.eventDao.getAllEvents(weddingId);
        const hotels: Hotel[] = await this.hotelDao.getAllHotels(weddingId);

        return new Promise((resolve, reject) => {
            stream.pipe(csvParser())
                .on('data', (data) => {
                    if (data['Id']) {
                        const guest = this.updateGuestFromData(data, hotels);
                        updateGuests.push(guest);
                    } else {
                        const guest = this.createGuestFromData(data, weddingId, weddingEvents, hotels);
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

    async parseExcel(buffer: Buffer, weddingId: string): Promise<UploadGuestLists> {
        const createGuests: Guest[] = [];
        const updateGuests: Guest[] = [];
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const headers = worksheet.getRow(1).values as string[];

        const weddingEvents: WeddingEvent[] = await this.eventDao.getAllEvents(weddingId);
        const hotels: Hotel[] = await this.hotelDao.getAllHotels(weddingId);

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const data: { [key: string]: any } = {};
            const rowValues = row.values as (string | number | undefined)[];

            headers.forEach((header, index) => {
                const value = rowValues[index];
                data[header] = value;
            });

            if (data['Id']) {
                const guest = this.updateGuestFromData(data, hotels);
                updateGuests.push(guest);
            } else {
                const guest = this.createGuestFromData(data, weddingId, weddingEvents, hotels);
                createGuests.push(guest);
            }

        });

        return { createGuests, updateGuests } as UploadGuestLists;
    }

    private createGuestFromData(data: any, weddingId: string, weddingEvents: WeddingEvent[], hotels: Hotel[]): Guest {
        const guest: Partial<Guest> = {};

        guest.id = '';
        guest.weddingId = weddingId;
        guest.name = (data['Name'] || '').trim();
        guest.email = (data['Email'] || '').trim();
        guest.phone = this.cleanPhoneField(data['Phone']);
        guest.serialNumber = (data['Serial Number'] || '').trim();
        guest.groupNumber = Number(data['Party Number'] || -1);
        guest.dietaryRestrictions = (data['Dietary Restrictions'] || '').trim();

        // Events
        guest.events = this.parseGuestEvents(data, weddingEvents);

        // Arrival Transportation
        guest.arrival = this.parseTransportation(data, 'Arrival Type', 'Arr');

        // Departure Transportation
        guest.departure = this.parseTransportation(data, 'Departure Type', 'Dep');

        // Accommodation
        guest.accommodation = this.parseAccommodation(data, hotels);

        return guest as Guest;
    }

    private updateGuestFromData(data: any, hotels: Hotel[]): Guest {
        const guest: Partial<Guest> = {};

        guest.id = data['Id'].trim();
        guest.weddingId = data['Wedding Id'];
        guest.name = (data['Name'] || '').trim();
        guest.email = (data['Email'] || '').trim();
        guest.phone = this.cleanPhoneField(data['Phone']);
        guest.serialNumber = (data['Serial Number'] || '').trim();
        guest.groupNumber = Number(data['Party Number'] || -1);
        guest.dietaryRestrictions = (data['Dietary Restrictions'] || '').trim();

        // Arrival Transportation
        guest.arrival = this.parseTransportation(data, 'Arrival Type', 'Arr');

        // Departure Transportation
        guest.departure = this.parseTransportation(data, 'Departure Type', 'Dep');

        // Accommodation
        guest.accommodation = this.parseAccommodation(data, hotels);

        return guest as Guest;
    }

    private parseGuestEvents(data: any, weddingEvents: WeddingEvent[]): WeddingEvent[] {
        const events: WeddingEvent[] = [];

        for (let weddingEvent of weddingEvents) {
            const invitedStatus = data[weddingEvent.name];
            if (invitedStatus && ['yes', 'done', 'y', 'true'].includes(String(invitedStatus).trim().toLowerCase())) {
                events.push(weddingEvent);
            }
        }

        return events;
    }

    private parseTransportation(data: any, typeField: string, prefix: string): Transportation | undefined {
        const transportationTypeValue = data[typeField];
        if (!transportationTypeValue) return undefined;

        let transportation: Transportation | undefined;

        switch (transportationTypeValue) {
            case TransportationType.FLIGHT: {
                transportation = new Flight(TransportationType.FLIGHT);
                break;
            }
            case TransportationType.TRAIN: {
                transportation = new Train(TransportationType.TRAIN);
                break;
            }
            default: {
                return undefined;
            }
        }

        const fieldsMapping: { [key: string]: string } = this.getTransportationFieldsMapping(transportation);

        if (transportation.type === TransportationType.FLIGHT && data[`${prefix}.Date`] && data[`${prefix}.Time`]) {
            (transportation as any)['flightTime'] = this.combineDateTime(data[`${prefix}.Date`], data[`${prefix}.Time`]);
        }

        if (transportation.type === TransportationType.TRAIN && data[`${prefix}.Date`] && data[`${prefix}.Time`]) {
            (transportation as any)['trainTime'] = this.combineDateTime(data[`${prefix}.Date`], data[`${prefix}.Time`]);
        }

        for (const [dataField, propName] of Object.entries(fieldsMapping)) {
            const value = data[`${prefix}.${dataField}`];
            if (value) {
                (transportation as any)[propName] = String(value).trim();
            }
        }
        return transportation;
    }

    private getTransportationFieldsMapping(transportation: Transportation): { [key: string]: string } {
        if (transportation.type === TransportationType.FLIGHT) {
            return {
                'Flight.Num': 'flightNumber',
            };
        } else if (transportation.type === TransportationType.TRAIN) {
            return {
                'Train.Num': 'trainNumber',
                'Train.Station': 'trainStation',
            };
        }
        return {};
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

    private parseAccommodation(data: any, hotels: Hotel[]): Accommodation {
        const hotelName = data['Hotel'];
        const roomNumber = data['Room Number'];

        const assignedHotel = hotels.find(hotel => hotel.name === hotelName);

        const accommodation = {
            hotel: assignedHotel ?? undefined,
            roomNumber: roomNumber ?? undefined
        } as Accommodation;

        return accommodation;
    }


    async validateGuests(weddingId: string, guestLists: UploadGuestLists): Promise<UploadValidation> {
        const currentGuestNames = (await this.guestDao.getAllGuests(weddingId)).map(guest => guest.name.toLowerCase());

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

    // generateCSVContent(guests: Guest[]): string {

    //     const csvHeaders = [
    //         { label: 'Id', key: 'id' },
    //         { label: 'Wedding Id', key: 'weddingId' },
    //         { label: 'Name', key: 'name' },
    //         { label: 'Party Number', key: 'groupNumber' },
    //         { label: 'Email', key: 'email' },
    //         { label: 'Phone', key: 'phone' },
    //         { label: 'Hotel', key: 'accommodation.hotel.name' },
    //         { label: 'Room Number', key: 'accommodation.roomNumber' },
    //         { label: 'Dietary Restrictions', key: 'dietaryRestrictions' },
    //         { label: 'Type of Drink', key: 'drinks.preferences' },
    //         { label: 'Arrival Type', key: 'arrival.type' },
    //         { label: 'Arr.Date', key: 'arrival.date' },
    //         { label: 'Arr.Time', key: 'arrival.time' },
    //         { label: 'Arr.Flight.Num', key: 'arrival.flightNumber' },
    //         { label: 'Arr.Train.Num', key: 'arrival.trainNumber' },
    //         { label: 'Departure Type', key: 'departure.type' },
    //         { label: 'Dep.Date', key: 'departure.date' },
    //         { label: 'Dep.Time', key: 'departure.time' },
    //         { label: 'Dep.Flight.Num', key: 'departure.flightNumber' },
    //         { label: 'Dep.Train.Num', key: 'departure.trainNumber' },
    //     ];

    //     const headerRow = csvHeaders.map(header => header.label).join(',') + '\n';

    //     const dataRows = guests.map(guest => {
    //         return csvHeaders.map(header => {
    //             let value = '';
    //             const delimiter = '.';
    //             if (header.key.includes(delimiter)) {
    //                 const splitIndex = header.key.indexOf(delimiter);
    //                 const parentKey = header.key.slice(0, splitIndex);
    //                 const childKey = header.key.slice(splitIndex + delimiter.length);
    //                 if (parentKey === 'accommodation') {
    //                     value = this.setAccommodation(guest, childKey);
    //                 } else if (parentKey === 'drinks') {
    //                     value = this.setDrinks(guest, childKey);
    //                 } else if (parentKey === 'arrival') {
    //                     value = this.setTransportation(guest, childKey, 'arrival');
    //                 } else if (parentKey === 'departure') {
    //                     value = this.setTransportation(guest, childKey, 'departure');
    //                 }
    //             } else {
    //                 value = (guest as any)[header.key] ?? '';
    //             }
    //             return `"${String(value).replace(/"/g, '""')}"`;
    //         }).join(',');
    //     }).join('\n');

    //     return headerRow + dataRows;
    // }

    private csvFields = [
        { label: 'Id', value: 'id' },
        { label: 'Wedding Id', value: 'weddingId' },
        { label: 'Name', value: 'name' },
        { label: 'Party Number', value: 'groupNumber' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Hotel', value: 'accommodation.hotel.name' },
        { label: 'Room Number', value: 'accommodation.roomNumber' },
        { label: 'Dietary Restrictions', value: 'dietaryRestrictions' },
        { label: 'Type of Drink', value: 'drinks.preferences' },
        { label: 'Arrival Type', value: 'arrival.type' },
        { label: 'Arr.Date', value: 'arrival.date' },
        { label: 'Arr.Time', value: 'arrival.time' },
        { label: 'Arr.Flight.Num', value: 'arrival.flightNumber' },
        { label: 'Arr.Train.Num', value: 'arrival.trainNumber' },
        { label: 'Departure Type', value: 'departure.type' },
        { label: 'Dep.Date', value: 'departure.date' },
        { label: 'Dep.Time', value: 'departure.time' },
        { label: 'Dep.Flight.Num', value: 'departure.flightNumber' },
        { label: 'Dep.Train.Num', value: 'departure.trainNumber' },
    ];

    generateCSVContent(guests: Guest[]): string {
        try {
            const processedGuests = guests.map(guest => {
                const processedGuest = { ...guest } as any;

                // Format Arrival
                const guestArrival = guest.arrival as any;
                if (guestArrival) {
                    const [arrDate, arrTime] = guestArrival.flightTime
                        ? guestArrival.flightTime.split('T')
                        : guestArrival.trainTime
                            ? guestArrival.trainTime.split('T')
                            : ['', ''];
                    processedGuest.arrival = {
                        ...guestArrival,
                        date: arrDate ? this.formatDateString(arrDate) : '',
                        time: arrTime || '',
                    };
                }

                // Format Departure
                const guestDeparture = guest.departure as any;
                if (guestDeparture) {
                    const [depDate, depTime] = guestDeparture.flightTime
                        ? guestDeparture.flightTime.split('T')
                        : guestDeparture.trainTime
                            ? guestDeparture.trainTime.split('T')
                            : ['', ''];
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

    // setAccommodation(guest: Guest, key: string) {
    //     if (guest.accommodation) {
    //         if (key === 'hotel.name' && guest.accommodation.hotel) {
    //             return guest.accommodation.hotel.name;
    //         } else {
    //             return (guest.accommodation as any)[key] ?? '';
    //         }
    //     }
    //     return '';
    // }

    // setDrinks(guest: Guest, key: string) {
    //     if (guest.drinks) {
    //         return (guest.drinks as any)[key] ?? '';
    //     }
    //     return '';
    // }

    // setTransportation(guest: Guest, key: string, transportType: string) {
    //     const transportation = transportType === 'arrival' ? guest.arrival : guest.departure;
    //     if (!transportation) return '';

    //     switch (transportation.type) {
    //         case TransportationType.FLIGHT:
    //         case TransportationType.TRAIN:
    //             return this.handleTransportDateTime(transportation, key);
    //         default:
    //             return '';
    //     }
    // }

    private handleTransportDateTime(transportation: Transportation, key: string) {
        const timeField = transportation.type === TransportationType.FLIGHT ? 'flightTime' : 'trainTime';

        if (key === 'date' || key === 'time') {
            const timeValue = (transportation as any)[timeField] ?? '';
            if (!timeValue) return '';

            const [datePart, timePart] = timeValue.split('T');
            return key === 'date' ? this.formatDateString(datePart) : timePart;
        }

        return (transportation as any)[key] ?? '';
    }

    private formatDateString(dateStr: string): string {
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    }


}
