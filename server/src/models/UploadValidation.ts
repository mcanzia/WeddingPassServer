import { Guest } from "./Guest";
import { UploadGuestLists } from "./UploadGuestLists";

export class UploadValidation {

    uploadIssues: Map<string, string>;
    uploadGuestLists: UploadGuestLists;

    constructor(uploadIssues: Map<string, string>, uploadGuestLists: UploadGuestLists) {
        this.uploadIssues = uploadIssues;
        this.uploadGuestLists = uploadGuestLists;
    }

}