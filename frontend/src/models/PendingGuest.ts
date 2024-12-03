export class PendingGuest {

    id: string;
    userId: string;
    weddingId: string;
    guestName: string;
    email: string;
    phone: string;
    status: string;

    constructor(id: string, userId: string, weddingId: string, guestName: string, email: string, phone: string, status: string) {
        this.id = id;
        this.userId = userId;
        this.weddingId = weddingId;
        this.guestName = guestName;
        this.email = email;
        this.phone = phone;
        this.status = status;
    }
}