import { Guest } from "./Guest";

export class UploadValidation {

    uploadIssues: Map<string, string>;
    validatedGuests: Array<Guest>;

    constructor(uploadIssues: Map<string, string>, validatedGuests: Array<Guest>) {
        this.uploadIssues = uploadIssues;
        this.validatedGuests = validatedGuests;
    }

}