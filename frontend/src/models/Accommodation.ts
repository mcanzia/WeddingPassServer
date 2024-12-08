import { Hotel } from "@/models/Hotel";

export class Accommodation {

    hotel: Hotel
    roomNumber: string;

    constructor(hotel: Hotel, roomNumber: string) {
        this.hotel = hotel;
        this.roomNumber = roomNumber;
    }
}