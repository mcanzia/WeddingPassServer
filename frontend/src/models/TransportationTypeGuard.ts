
import { Transportation } from '@/models/Transportation';
import { Flight } from '@/models/Flight';
import { Train } from '@/models/Train';
import { Bus } from '@/models/Bus';
import { TransportationType } from '@/models/TransportationType';
import { OtherTransport } from './OtherTransport';

export function isFlight(details: Transportation): details is Flight {
    return details.type === TransportationType.FLIGHT;
}

export function isTrain(details: Transportation): details is Train {
    return details.type === TransportationType.TRAIN;
}

export function isOther(details: Transportation): details is OtherTransport {
    return details.type === TransportationType.OTHER;
}
