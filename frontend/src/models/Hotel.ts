export class Hotel {

    id: string;
    weddingId: string;
    name: string;
    location: string;

    constructor(id: string, weddingId: string, name: string, location: string) {
        this.id = id;
        this.weddingId = weddingId;
        this.name = name;
        this.location = location;
    }
}