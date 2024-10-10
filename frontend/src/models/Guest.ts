export class Guest {
    
    id: string;
    serialNumber: string;
    name: string;
    email: string;

    constructor (id: string, serialNumber: string, name: string, email: string){
        this.id = id;
        this.serialNumber = serialNumber;
        this.name = name;
        this.email = email;
    }
}