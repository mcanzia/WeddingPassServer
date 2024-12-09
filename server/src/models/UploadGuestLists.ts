import { Guest } from "./Guest";

export class UploadGuestLists {

    createGuests: Guest[];
    updateGuests: Guest[];

    constructor(createGuests: Guest[], updateGuests: Guest[]) {
        this.createGuests = createGuests;
        this.updateGuests = updateGuests;
    }
}