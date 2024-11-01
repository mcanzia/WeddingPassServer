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

@injectable()
export class GuestService {

    constructor(@inject(TYPES.EventDao) private eventDao: EventDao, @inject(TYPES.GuestDao) private guestDao: GuestDao) {}

    parseCSV(buffer: Buffer, weddingId: string): Promise<Guest[]> {
        return new Promise(async (resolve, reject) => {
            const guests: Guest[] = [];
            const stream = Readable.from(buffer.toString());

            const weddingEvents : WeddingEvent[] = await this.eventDao.getAllEvents(weddingId);

            stream.pipe(csvParser())
                .on('data', (data) => {
                    let events : WeddingEvent[] = [];
                    for (let weddingEvent of weddingEvents) {
                        const invitedStatus = data[`${weddingEvent.name}`];
                        if (invitedStatus && ['yes', 'done', 'y', 'true'].includes(invitedStatus.trim().toLowerCase())) {
                            events.push(weddingEvent);
                        }
                    }
                    guests.push({
                        id: '',
                        weddingId: weddingId,
                        name: data['Name'] || '',
                        email: data['Email'] || '',
                        phone: data['Phone'] || '',
                        events: events,
                    });
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

        const weddingEvents : WeddingEvent[] = await this.eventDao.getAllEvents(weddingId);

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const rowValues = row.values as (string | number | undefined)[];

            const guest: Partial<Guest> = {};

            let events : WeddingEvent[] = [];

            headers.forEach((header, index) => {
                const value = rowValues[index];
                switch (header.toLowerCase()) {
                    case 'name':
                        guest.name = value ? String(value).trim() : '';
                        break;
                    case 'email':
                        if (isValueObject(value)) {
                            guest.email = value.text.richText[0].text.trim();
                        } else {
                            guest.email = value ? String(value).trim() : '';
                        }
                        break;
                    case 'phone':
                        guest.phone = value ? String(value).trim() : '';
                        break;
                    default:
                        break;
                }
                for (let weddingEvent of weddingEvents) {
                    if (header.toLowerCase() === weddingEvent.name.toLowerCase() && ['yes', 'done', 'y', 'true'].includes(String(value).trim().toLowerCase())) {
                        events.push(weddingEvent);
                    }
                }                
            });

            guests.push({
                id: '',
                weddingId: weddingId,
                name: guest.name || '',
                email: guest.email || '',
                phone: guest.phone || '',
                events: events
            } as Guest);
        });

        return guests;
    }

    async validateGuests(weddingId: string, guests: Guest[]): Promise<UploadValidation> {
        const currentGuestNames = (await this.guestDao.getAllGuests(weddingId)).map(guest => guest.name.toLowerCase());

        let uploadIssues : Map<string, string> = new Map<string, string>();
        let validatedGuests : Array<Guest> = [];
        
        validatedGuests = guests.filter((guest,index) => {
            if (validator.isEmpty(guest.name)) {
                uploadIssues.set(guest.name || `Unknown ${index}`, NAME_MISSING);
                return false;
            }

            // if (validator.isEmpty(guest.email)) {
            //     uploadIssues.set(guest.name, EMAIL_MISSING);
            //     return false;
            // }

            // if (!this.isValidEmail(guest.email)) {
            //     uploadIssues.set(guest.name, EMAIL_BAD_FORMAT);
            //     return false;
            // }

            if (!guest.events || guest.events.length === 0) {
                uploadIssues.set(guest.name, MISSING_EVENT);
                return false;
            }

            if (currentGuestNames.includes(guest.name.toLowerCase())) {
                uploadIssues.set(guest.name, DUPLICATE_GUEST);
                return false;
            }

            if (guest.name.length > 100) {
                uploadIssues.set(guest.name, NAME_TOO_LONG);
                return false;
            }

            if (guest.email.length > 50) {
                uploadIssues.set(guest.name, EMAIL_TOO_LONG);
                return false;
            }

            if (guest.phone.length > 50) {
                uploadIssues.set(guest.name, PHONE_TOO_LONG);
                return false;
            }

            return true;
        });

        return new UploadValidation(uploadIssues, validatedGuests);
    }

    // private isValidEmail(email : string) {
    //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //     return emailRegex.test(email);
    // }
}