export class WeddingEvent {

    id: string;
    name: string;
    weddingId: string;

    constructor(id: string, name: string, weddingId: string) {
        this.id = id;
        this.name = name;
        this.weddingId = weddingId;
    }

    toObject?() {
        return {
            id: this.id,
            name: this.name,
            weddingId: this.weddingId
        };
    }

}