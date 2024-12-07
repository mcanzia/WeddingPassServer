import { Transportation } from "./Transportation";

export class Train extends Transportation {

    trainNumber?: string;
    trainTime?: Date;
    trainStation?: string;

    constructor(type?: string, trainNumber?: string, trainTime?: Date, trainStation?: string) {
        super(type);
        this.trainNumber = trainNumber;
        this.trainTime = trainTime;
        this.trainStation = trainStation;
    }

    toObject?() {
        return {
            type: this.type,
            trainNumber: this.trainNumber,
            trainTime: this.trainTime,
            trainStation: this.trainStation
        };
    }
}