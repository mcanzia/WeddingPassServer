export class WeddingEvent {

    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    toObject?() {
        return {
            id: this.id,
            name: this.name,
        };
    }

}