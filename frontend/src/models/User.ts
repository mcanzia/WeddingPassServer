export class User {

    id: string;
    email: string;
    role: string;

    constructor(id: string, email: string, role: string) {
        this.id = id;
        this.email = email;
        this.role = role;
    }
}