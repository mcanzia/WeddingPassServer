export class Role {
    
    role: string;

    constructor (role: string){
        this.role = role;
    }

    toObject?() {
        return {
            role: this.role,
        };
    }
}