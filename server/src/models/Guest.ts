export class Guest {

    id: string;
    serialNumber: string;
    name: string;
    email: string;
    phone: string;
    events: Array<string>

    constructor(id: string, serialNumber: string, link: string, name: string, email: string, phone: string, events: Array<string>) {
        this.id = id;
        this.name = name;
        this.serialNumber = serialNumber;
        this.email = email;
        this.phone = phone;
        this.events = events;
    }

    toObject?() {
        return {
            id: this.id,
            name: this.name,
            serialNumber: this.serialNumber,
            email: this.email,
            phone: this.phone,
            events: this.events
        };
    }

}