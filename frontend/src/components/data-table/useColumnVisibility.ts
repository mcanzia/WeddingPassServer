import { ViewModes } from "@/components/data-table/ViewModes";

export function useColumnVisibility() {
    const allFields = [
        'name',
        'groupNumber',
        'email',
        'phone',
        'subEvents',
        'arrivalType',
        'arrivalFlightTime',
        'arrivalFlightNumber',
        'arrivalTrainTime',
        'arrivalTrainNumber',
        'departureType',
        'departureFlightTime',
        'departureFlightNumber',
        'departureTrainTime',
        'departureTrainNumber',
        'dietaryRestrictions',
        'drinkPreferences',
        'numberOfDrinks',
        'hotelName',
        'roomNumber'
    ];

    const baseFieldMap = allFields.reduce((acc, field) => {
        acc[field] = false;
        return acc;
    }, {} as Record<string, boolean>);

    function createVisibilityConfig(...fieldsToEnable: string[]) {
        const config = { ...baseFieldMap };
        for (const field of fieldsToEnable) {
            config[field] = true;
        }
        return config;
    }

    const viewModeColumnVisibility: Record<ViewModes, Record<string, boolean>> = {
        [ViewModes.ALL_FIELDS]: createVisibilityConfig(...allFields),
        [ViewModes.CORE_DETAILS]: createVisibilityConfig('name', 'groupNumber', 'email', 'phone', 'subEvents'),
        [ViewModes.TRANSPORTATION]: createVisibilityConfig('name', 'groupNumber', 'arrivalType', 'arrivalFlightTime', 'arrivalFlightNumber', 'arrivalTrainTime', 'arrivalTrainNumber', 'departureType', 'departureFlightTime', 'departureFlightNumber', 'departureTrainTime', 'departureTrainNumber'),
        [ViewModes.DINING]: createVisibilityConfig('name', 'groupNumber', 'dietaryRestrictions', 'drinkPreferences', 'numberOfDrinks'),
        [ViewModes.ACCOMMODATION]: createVisibilityConfig('name', 'groupNumber', 'hotelName', 'roomNumber'),
    };

    return {
        viewModeColumnVisibility
    }
}
