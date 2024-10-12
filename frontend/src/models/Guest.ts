export class Guest {
    
    id?: string;
    serialNumber?: string;
    name: string;
    email: string;
    phone: string;
    events: string[]

    constructor (id: string, serialNumber: string, name: string, email: string, phone: string, events: string[]){
        this.id = id;
        this.serialNumber = serialNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.events = events;
    }
}