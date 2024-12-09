import { Hotel } from "./Hotel";

export class Accommodation {

    hotel?: Hotel
    roomNumber: string;

    constructor(roomNumber: string, hotel?: Hotel) {
        this.hotel = hotel;
        this.roomNumber = roomNumber;
    }

    toObject?() {
        return {
            hotel: this.hotel?.toObject ? this.hotel.toObject() : this.hotel,
            roomNumber: this.roomNumber,
        }
    }
}