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
import { isFlight, isBus, isTrain } from "@/models/TransportationTypeGuard";

export function useColumnDefinition() {
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
                    const circles = events.map(event =>
                        h(EventCircle, { event, key: event.id })
                    );
                    return h('div', { class: 'flex gap-1 whitespace-nowrap text-center' }, circles);
                },
            },
            {
                accessorKey: 'arrivalType',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Type');
                },
                cell: ({ row }) => {
                    const arrival = row.original.arrival;
                    let arrivalType = '';
                    if (!arrival) {
                        return h('div', '');
                    }
                    switch (arrival.type) {
                        case TransportationType.FLIGHT:
                            arrivalType = TransportationType.FLIGHT.toUpperCase();
                            break;
                        case TransportationType.TRAIN:
                            arrivalType = TransportationType.TRAIN.toUpperCase();
                            break;
                        case TransportationType.BUS: {
                            arrivalType = TransportationType.BUS.toUpperCase();
                            break;
                        }
                        default: {
                            arrivalType = '';
                        }
                    }
                    return h('div', arrivalType);
                },
            },
            {
                accessorKey: 'arrivalFlightNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Flight Number');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'flightNumber');
                },
            },

            {
                accessorKey: 'arrivalFlightTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Flight Time');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'flightTime');
                },
            },

            {
                accessorKey: 'arrivalTrainNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Train Number');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'trainNumber');
                },
            },
            {
                accessorKey: 'arrivalTrainTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Train Time');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'trainTime');
                },
            },
            {
                accessorKey: 'arrivalTrainStation',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Train Station');
                }, cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'trainStation');
                },
            },
            {
                accessorKey: 'arrivalBusTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Bus Time');
                }, cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'busTime');
                },
            },
            {
                accessorKey: 'arrivalBusPickupPoint',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Arrival Bus Pickup Point');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.arrival, 'busPickupPoint');
                },
            },
            {
                accessorKey: 'departureType',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Type');
                },
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
                        case TransportationType.BUS: {
                            departureType = TransportationType.BUS.toUpperCase();
                            break;
                        }
                        default: {
                            departureType = '';
                        }
                    }
                    return h('div', departureType);
                },
            },
            {
                accessorKey: 'departureFlightNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Flight Number');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'flightNumber');
                },
            },

            {
                accessorKey: 'departureFlightTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Flight Time');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'flightTime');
                },
            },

            {
                accessorKey: 'departureTrainNumber',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Train Number');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'trainNumber');
                },
            },
            {
                accessorKey: 'departureTrainTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Train Time');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'trainTime');
                },
            },
            {
                accessorKey: 'departureTrainStation',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Train Station');
                }, cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'trainStation');
                },
            },
            {
                accessorKey: 'departureBusTime',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Bus Time');
                }, cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'busTime');
                },
            },
            {
                accessorKey: 'departureBusPickupPoint',
                header: ({ column }) => {
                    return setHeaderDetails(column, 'Departure Bus Pickup Point');
                },
                cell: ({ row }) => {
                    return getTransportationField(row.original.departure, 'busPickupPoint');
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
                return h('div', value || '');
            }
        } else if (isTrain(details)) {
            if (fieldName in details) {
                const value = (details as Train)[fieldName as keyof Train];
                return h('div', value || '');
            }
        } else if (isBus(details)) {
            if (fieldName in details) {
                const value = (details as Bus)[fieldName as keyof Bus];
                return h('div', value || '');
            }
        }

        return h('div', '');
    }



    return {
        columnDefs
    }
}