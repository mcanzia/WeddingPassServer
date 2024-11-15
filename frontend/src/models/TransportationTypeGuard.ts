
import { Transportation } from '@/models/Transportation';
import { Flight } from '@/models/Flight';
import { Train } from '@/models/Train';
import { Bus } from '@/models/Bus';
import { TransportationType } from '@/models/TransportationType';

export function isFlight(details: Transportation): details is Flight {
    return details.type === TransportationType.FLIGHT;
}

export function isTrain(details: Transportation): details is Train {
    return details.type === TransportationType.TRAIN;
}

export function isBus(details: Transportation): details is Bus {
    return details.type === TransportationType.BUS;
}
