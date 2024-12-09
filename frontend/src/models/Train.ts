import { Transportation } from "@/models/Transportation";

export class Train extends Transportation {

    trainNumber: string;
    trainTime: string;
    trainStation: string;

    constructor(type: string, trainNumber: string, trainTime: string, trainStation: string) {
        super(type);
        this.trainNumber = trainNumber;
        this.trainTime = trainTime;
        this.trainStation = trainStation;
    }

}