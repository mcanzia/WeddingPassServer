import { computed, h } from "vue";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-vue-next";
import { Flight } from "@/models/Flight";
import { Bus } from "@/models/Bus";
import { Train } from "@/models/Train";
import { WeddingEvent } from "@/models/WeddingEvent";
import { Checkbox } from "@/components/ui/checkbox";
import EventCircle from '@/components/data-table/EventCircle.vue';
import { Guest } from "@/models/Guest";
import { ColumnDef } from "@tanstack/vue-table";
import { TransportationType } from "@/models/TransportationType";
import { Transportation } from "@/models/Transportation";
import { isFlight, isOther, isTrain } from "@/models/TransportationTypeGuard";
import { useDateUtils } from "@/components/common/useDateUtils";
import { Drinks } from "@/models/Drinks";
import { Accommodation } from "@/models/Accommodation";
import { Hotel } from "@/models/Hotel";
import { OtherTransport } from "@/models/OtherTransport";

export function useColumnDefinition() {

    const { dateToString } = useDateUtils();

    const columnDefs = computed(() => {
        return [
            {
                id: 'select',
                header: ({ table }) => h(Checkbox, {
                    'checked': table.getIsAllRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
                    'onUpdate:checked': (value: any) => table.toggleAllRowsSelected(!!value),
                    'ariaLabel': 'Select all',
                }),
                cell: ({ row }) => h(Checkbox, {
                    'checked': row.getIsSelected(),
                    'onUpdate:checked': (value: any) => row.toggleSelected(!!value),
                    'ariaLabel': 'Select row',
                }),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Name');
                },
                cell: ({ row }: any) => h('div', { class: 'capitalize whitespace-nowrap text-center' }, row.getValue('name')),
            },
            {
                accessorKey: 'groupNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Party Number');
                },
                cell: ({ row }: any) => h('div', { class: 'whitespace-nowrap text-center' }, row.getValue('groupNumber')),
            },
            {
                accessorKey: 'email',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Email');
                },
                cell: ({ row }) => h('div', { class: 'lowercase whitespace-nowrap text-center' }, row.getValue('email')),
            },
            {
                accessorKey: 'phone',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Phone Number');
                },
                cell: ({ row }) => h('div', { class: 'lowercase whitespace-nowrap text-center' }, row.getValue('phone')),
            },
            {
                accessorKey: 'events',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Events');
                },
                cell: ({ row }) => {
                    const events: WeddingEvent[] = row.getValue('events') || [];
                    const circles = events.sort((a, b) => a.order - b.order).map(event =>
                        h(EventCircle, { event, key: event.id })
                    );
                    return h('div', { class: 'flex gap-1 whitespace-nowrap text-center' }, circles);
                },
            },
            {
                id: 'arrivalType',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Type');
                },
                accessorFn: (row: Guest) => row.arrival?.type || 'N/A',
                cell: ({ row }) => {
                    const arrival = row.original.arrival;
                    let arrivalType = '';
                    if (!arrival) {
                        return h('div', '');
                    }
                    switch (arrival.type) {
                        case TransportationType.FLIGHT:
                            arrivalType = TransportationType.FLIGHT;
                            break;
                        case TransportationType.TRAIN:
                            arrivalType = TransportationType.TRAIN;
                            break;
                        case TransportationType.OTHER:
                            arrivalType = TransportationType.OTHER;
                            break;
                        default: {
                            arrivalType = 'N/A';
                        }
                    }
                    return h('div', arrivalType);
                },
            },

            {
                id: 'arrivalFlightTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Flight Time');
                },
                accessorFn: (row: Guest) => {
                    const arrival = row.arrival as Flight;
                    return arrival && arrival.flightTime ? new Date(arrival.flightTime).getTime() : 0;
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'flightTime');
                },
            },
            {
                id: 'arrivalFlightNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Flight Number');
                },
                accessorFn: (row: Guest) => {
                    const arrival = row.arrival as Flight;
                    return arrival?.flightNumber ?? '';
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'flightNumber');
                },
            },
            {
                id: 'arrivalTrainTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Train Time');
                },
                accessorFn: (row: Guest) => {
                    const arrival = row.arrival as Train;
                    return arrival && arrival.trainTime ? new Date(arrival.trainTime).getTime() : 0;
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'trainTime');
                },
            },
            {
                id: 'arrivalTrainNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Train Number');
                },
                accessorFn: (row: Guest) => {
                    const arrival = row.arrival as Train;
                    return arrival?.trainNumber ?? '';
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'trainNumber');
                },
            },
            {
                id: 'arrivalTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Time');
                },
                accessorFn: (row: Guest) => {
                    const arrival = row.arrival as OtherTransport;
                    return arrival && arrival.time ? new Date(arrival.time).getTime() : 0;
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'time');
                },
            },
            {
                id: 'departureType',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Type');
                },
                accessorFn: (row: Guest) => row.departure?.type || 'N/A',
                cell: ({ row }) => {
                    const departure = row.original.departure;
                    let departureType = '';
                    if (!departure) {
                        return h('div', '');
                    }
                    switch (departure.type) {
                        case TransportationType.FLIGHT:
                            departureType = TransportationType.FLIGHT.toUpperCase();
                            break;
                        case TransportationType.TRAIN:
                            departureType = TransportationType.TRAIN.toUpperCase();
                            break;
                        case TransportationType.OTHER:
                            departureType = TransportationType.OTHER.toUpperCase();
                            break;
                        default: {
                            departureType = 'N/A';
                        }
                    }
                    return h('div', departureType);
                },
            },

            {
                id: 'departureFlightTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Flight Time');
                },
                accessorFn: (row: Guest) => {
                    const departure = row.departure as Flight;
                    return departure && departure.flightTime ? new Date(departure.flightTime).getTime() : 0;
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'flightTime');
                },
            },
            {
                id: 'departureFlightNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Flight Number');
                },
                accessorFn: (row: Guest) => {
                    const departure = row.departure as Flight;
                    return departure?.flightNumber ?? '';
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'flightNumber');
                },
            },
            {
                id: 'departureTrainTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Train Time');
                },
                accessorFn: (row: Guest) => {
                    const departure = row.departure as Train;
                    return departure && departure.trainTime ? new Date(departure.trainTime).getTime() : 0;
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'trainTime');
                },
            },
            {
                id: 'departureTrainNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Train Number');
                },
                accessorFn: (row: Guest) => {
                    const departure = row.departure as Train;
                    return departure?.trainNumber ?? '';
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'trainNumber');
                },
            },
            {
                id: 'departureTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Time');
                },
                accessorFn: (row: Guest) => {
                    const departure = row.departure as OtherTransport;
                    return departure && departure.time ? new Date(departure.time).getTime() : 0;
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'time');
                },
            },
            {
                accessorKey: 'dietaryRestrictions',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Dietary Restrictions');
                },
                cell: ({ row }) => h('div', { class: 'lowercase whitespace-nowrap text-center' }, row.getValue('dietaryRestrictions')),
            },
            {
                id: 'drinkPreferences',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Drink Preferences');
                },
                accessorFn: (row: Guest) => {
                    return row.drinks?.preferences ?? '';
                },
                cell: ({ row }) => {
                    return getDrinksField(row.original.drinks, 'preferences');
                },
            },
            {
                id: 'numberOfDrinks',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Number of Drinks');
                },
                accessorFn: (row: Guest) => {
                    return row.drinks?.numberOfDrinks ?? 0;
                },
                cell: ({ row }) => {
                    return getDrinksField(row.original.drinks, 'numberOfDrinks');
                },
            },
            {
                id: 'hotelName',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Hotel Name');
                },
                accessorFn: (row: Guest) => {
                    return row.accommodation?.hotel.name ?? '';
                },
                cell: ({ row }) => {
                    return getAccommodationField(row.original.accommodation, 'name');
                },
            },
            {
                id: 'roomNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Room Number');
                },
                accessorFn: (row: Guest) => {
                    return row.accommodation?.roomNumber ?? '';
                },
                cell: ({ row }) => {
                    return getAccommodationField(row.original.accommodation, 'roomNumber');
                },
            },

        ] as ColumnDef<Guest>[]
    });

    function setHeaderDetails(column: any, columnName: string) {
        return h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => [columnName, h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
    }

    function getTransportationField(details: Transportation | undefined, fieldName: string) {
        if (!details || !fieldName) {
            return h('div', '');
        }

        if (isFlight(details)) {
            if (fieldName in details) {
                const value = (details as Flight)[fieldName as keyof Flight];
                if (fieldName === 'flightTime') {
                    const dateCheck = value ? new Date(value) : undefined;
                    if (dateCheck && !isNaN(dateCheck.getTime())) {
                        return h('div', dateToString(dateCheck) || '');
                    }
                }
                return h('div', String(value || ''));
            }
        } else if (isTrain(details)) {
            if (fieldName in details) {
                const value = (details as Train)[fieldName as keyof Train];
                if (fieldName === 'trainTime') {
                    const dateCheck = value ? new Date(value) : undefined;
                    if (dateCheck && !isNaN(dateCheck.getTime())) {
                        return h('div', dateToString(dateCheck) || '');
                    }
                }
                return h('div', String(value || ''));
            }
        } else if (isOther(details)) {
            if (fieldName in details) {
                const value = (details as OtherTransport)[fieldName as keyof OtherTransport];
                if (fieldName === 'time') {
                    const dateCheck = value ? new Date(value) : undefined;
                    if (dateCheck && !isNaN(dateCheck.getTime())) {
                        return h('div', dateToString(dateCheck) || '');
                    }
                }
                return h('div', String(value || ''));
            }
        } else {
            if (fieldName in details) {
                const value = (details as Transportation)[fieldName as keyof Transportation];
                const dateCheck = value ? new Date(value) : undefined;
                if (dateCheck && !isNaN(dateCheck.getTime())) {
                    return h('div', dateToString(dateCheck) || '');
                }
                return h('div', String(value || ''));
            }
        }

        return h('div', '');
    }

    function getDrinksField(details: Drinks | undefined, fieldName: string) {
        if (!details || !fieldName) {
            return h('div', '');
        }

        if (fieldName in details) {
            const value = (details as Drinks)[fieldName as keyof Drinks];
            let displayValue: string;

            if (Array.isArray(value)) {
                displayValue = value.join(', ');
            } else {
                displayValue = String(value ?? '');
            }

            return h('div', displayValue);
        }
        return h('div', '');
    }

    function getAccommodationField(details: Accommodation | undefined, fieldName: string, defaultVal?: string) {
        if (!details || !fieldName) {
            return h('div', defaultVal ?? '');
        }

        if (fieldName === 'name') {
            return h('div', details.hotel?.name ?? defaultVal ?? '');
        }

        const value = details[fieldName as keyof Accommodation];
        return h('div', String(value) ?? defaultVal ?? '');
    }

    function getEventsDisplay(events: WeddingEvent[]) {
        if (events.length) {
            return events.sort((a, b) => a.order - b.order).map(event => event.name).join(', ');
        }
        return 'Not Attending Events'
    }

    const partyColumnDefs = computed(() => {
        return [
            {
                accessorKey: 'name',
                header: ({ column }: any) => {
                    return setHeaderDetails(column, 'Name');
                },
                cell: ({ row }: any) => h('div', { class: 'capitalize whitespace-nowrap text-center' }, row.getValue('name')),
            },
            {
                accessorKey: 'hotelName',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Hotel Name');
                },
                cell: ({ row }) => {
                    return getAccommodationField(row.original.accommodation, 'name');
                },
            },
            {
                accessorKey: 'roomNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Room Number');
                },
                cell: ({ row }: any) => {
                    return getAccommodationField(row.original.accommodation, 'roomNumber', 'To Be Assigned');
                },
            },
            {
                accessorKey: 'events',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Events');
                },
                cell: ({ row }) => {
                    const events: WeddingEvent[] = row.getValue('events') || [];
                    return h('div', { class: 'flex gap-1 whitespace-nowrap text-center' }, getEventsDisplay(events));
                },
            },
        ]
    });


    return {
        columnDefs,
        partyColumnDefs
    }
}