export class WeddingEvent {

    id: string;
    name: string;
    weddingId: string;
    order: number;

    constructor(id: string, name: string, weddingId: string, order: number) {
        this.id = id;
        this.name = name;
        this.weddingId = weddingId;
        this.order = order;
    }
}