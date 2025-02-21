export class PendingGuest {

    id: string;
    userId: string;
    eventId: string;
    guestName: string;
    email: string;
    phone: string;
    status: string;

    constructor(id: string, userId: string, eventId: string, guestName: string, email: string, phone: string, status: string) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.guestName = guestName;
        this.email = email;
        this.phone = phone;
        this.status = status;
    }
}