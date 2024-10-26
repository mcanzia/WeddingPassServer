export class Wedding {
    
    id?: string;
    name: string;
    date: Date;
    location: string;
    ownerId: string;

    constructor (id: string, name: string, date: Date, location: string, ownerId: string){
        this.id = id;
        this.name = name;
        this.date = date;
        this.location = location;
        this.ownerId = ownerId;
    }
}