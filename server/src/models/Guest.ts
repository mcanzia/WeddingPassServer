export class Guest {

    id: string;
    serialNumber: string;
    name: string;
    email: string;

    constructor(id: string, serialNumber: string, link: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.serialNumber = serialNumber;
        this.email = email;
    }

    toObject?() {
        return {
            id: this.id,
            name: this.name,
            serialNumber: this.serialNumber,
            email: this.email
        };
    }

}