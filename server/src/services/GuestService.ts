import { Guest } from "../models/Guest";
import Logger from "../util/logs/logger";
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import { injectable } from "inversify";

@injectable()
export class GuestService {

    parseCSV(buffer: Buffer): Promise<Guest[]> {
        return new Promise((resolve, reject) => {
            const guests: Guest[] = [];
            const stream = Readable.from(buffer.toString());

            stream.pipe(csvParser())
                .on('data', (data) => {
                    guests.push({
                        id: '',
                        name: data['Name'] || '',
                        email: data['Email'] || '',
                        serialNumber: data['Serial Number'] || '',
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

    async parseExcel(buffer: Buffer): Promise<Guest[]> {
        const guests: Guest[] = [];
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const headers = worksheet.getRow(1).values as string[];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const rowValues = row.values as (string | number | undefined)[];

            const guest: Partial<Guest> = {};

            headers.forEach((header, index) => {
                const value = rowValues[index + 1];
                switch (header.toLowerCase()) {
                    case 'name':
                        guest.name = String(value).trim();
                        break;
                    case 'email':
                        guest.email = String(value).trim();
                        break;
                    case 'serial number':
                        guest.serialNumber = String(value).trim();
                        break;
                    default:
                        break;
                }
            });

            guests.push({
                id: '',
                name: guest.name || '',
                email: guest.email || '',
                serialNumber: guest.serialNumber || '',
            } as Guest);
        });

        return guests;
    }

    validateGuests(guests: Guest[]): Guest[] {
        return guests.filter(guest => {
            if (!guest.name || !guest.email || !guest.serialNumber) {
                Logger.warn(`Invalid guest data: ${JSON.stringify(guest)}`);
                return false;
            }
            return true;
        });
    }
}