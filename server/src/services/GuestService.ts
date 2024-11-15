import { Guest } from "../models/Guest";
import Logger from "../util/logs/logger";
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import { inject, injectable } from "inversify";
import { EventDao } from "../dao/EventDao";
import { TYPES } from "../configs/types";
import { WeddingEvent } from "../models/WeddingEvent";
import { isValueObject } from "../util/typescript/RichTextType";
import { GuestDao } from "../dao/GuestDao";
import { UploadValidation } from "../models/UploadValidation";
import { DUPLICATE_GUEST, EMAIL_BAD_FORMAT, EMAIL_MISSING, EMAIL_TOO_LONG, MISSING_EVENT, NAME_MISSING, NAME_TOO_LONG, PHONE_TOO_LONG } from "../util/upload/ValidationErrors";
import validator from 'validator';
import { Flight } from "../models/Flight";
import { TransportationType } from "../models/TransportationType";
import { Train } from "../models/Train";
import { Bus } from "../models/Bus";
import { Transportation } from "../models/Transportation";

@injectable()
export class GuestService {

    constructor(
        @inject(TYPES.EventDao) private eventDao: EventDao,
        @inject(TYPES.GuestDao) private guestDao: GuestDao
    ) { }

    async parseCSV(buffer: Buffer, weddingId: string): Promise<Guest[]> {
        const guests: Guest[] = [];
        const stream = Readable.from(buffer.toString());

        const weddingEvents: WeddingEvent[] = await this.eventDao.getAllEvents(weddingId);

        return new Promise((resolve, reject) => {
            stream.pipe(csvParser())
                .on('data', (data) => {
                    const guest = this.createGuestFromData(data, weddingId, weddingEvents);
                    guests.push(guest);
                })
                .on('end', () => {
                    resolve(guests);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    async parseExcel(buffer: Buffer, weddingId: string): Promise<Guest[]> {
        const guests: Guest[] = [];
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const headers = worksheet.getRow(1).values as string[];

        const weddingEvents: WeddingEvent[] = await this.eventDao.getAllEvents(weddingId);

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const data: { [key: string]: any } = {};
            const rowValues = row.values as (string | number | undefined)[];

            headers.forEach((header, index) => {
                const value = rowValues[index];
                data[header] = value;
            });

            const guest = this.createGuestFromData(data, weddingId, weddingEvents);
            guests.push(guest);
        });

        return guests;
    }

    private createGuestFromData(data: any, weddingId: string, weddingEvents: WeddingEvent[]): Guest {
        const guest: Partial<Guest> = {};

        guest.id = '';
        guest.weddingId = weddingId;
        guest.name = (data['Name'] || '').trim();
        guest.email = (data['Email'] || '').trim();
        guest.phone = (data['Phone'] || '').trim();

        // Events
        guest.events = this.parseGuestEvents(data, weddingEvents);

        // Arrival Transportation
        guest.arrival = this.parseTransportation(data, 'Arrival Type', 'Arr');

        // Departure Transportation
        guest.departure = this.parseTransportation(data, 'Departure Type', 'Dep');

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

        const transportationType = String(transportationTypeValue).trim().toLowerCase();
        let transportation: Transportation | undefined;

        switch (transportationType) {
            case TransportationType.FLIGHT: {
                transportation = new Flight(TransportationType.FLIGHT);
                break;
            }
            case TransportationType.TRAIN: {
                transportation = new Train(TransportationType.TRAIN);
                break;
            }
            case TransportationType.BUS: {
                transportation = new Bus(TransportationType.BUS);
                break;
            }
            default: {
                return undefined;
            }
        }

        const fieldsMapping: { [key: string]: string } = this.getTransportationFieldsMapping(transportation, prefix);

        for (const [dataField, propName] of Object.entries(fieldsMapping)) {
            const value = data[`${prefix}.${dataField}`];
            if (value) {
                (transportation as any)[propName] = String(value).trim();
            }
        }

        return transportation;
    }

    private getTransportationFieldsMapping(transportation: Transportation, prefix: string): { [key: string]: string } {
        if (transportation.type === TransportationType.FLIGHT) {
            return {
                'Flight.Num': 'flightNumber',
                'Flight.Time': 'flightTime',
            };
        } else if (transportation.type === TransportationType.TRAIN) {
            return {
                'Train.Num': 'trainNumber',
                'Train.Time': 'trainTime',
                'Train.Station': 'trainStation',
            };
        } else if (transportation.type === TransportationType.BUS) {
            return {
                'Bus.Time': 'busTime',
                'Bus.PickupPoint': 'busPickupPoint',
            };
        }
        return {};
    }

    async validateGuests(weddingId: string, guests: Guest[]): Promise<UploadValidation> {
        const currentGuestNames = (await this.guestDao.getAllGuests(weddingId)).map(guest => guest.name.toLowerCase());

        const uploadIssues: Map<string, string> = new Map<string, string>();
        const validatedGuests: Guest[] = [];

        guests.forEach((guest, index) => {
            const validationError = this.validateGuest(guest, currentGuestNames);
            if (validationError) {
                uploadIssues.set(guest.name || `Unknown ${index}`, validationError);
            } else {
                validatedGuests.push(guest);
            }
        });

        return new UploadValidation(uploadIssues, validatedGuests);
    }

    private validateGuest(guest: Guest, currentGuestNames: string[]): string | null {
        if (validator.isEmpty(guest.name)) {
            return NAME_MISSING;
        }

        if (!guest.events || guest.events.length === 0) {
            return MISSING_EVENT;
        }

        if (currentGuestNames.includes(guest.name.toLowerCase())) {
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

    // private isValidEmail(email: string) {
    //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //     return emailRegex.test(email);
    // }
}
