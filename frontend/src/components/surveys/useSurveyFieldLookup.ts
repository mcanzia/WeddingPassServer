import { Guest } from "@/models/Guest";
import { startCase } from "lodash";
import { computed } from "vue";

export function useSurveyFieldLookup() {

    const formattedGuestDetailKeys = computed(() =>
        Guest.detailKeys.map(key =>
            key.includes(':')
                ? key.split(':').map(part => startCase(part.trim())).join(': ')
                : startCase(key)
        )
    );

    function lookupGuestField(guest: Guest, fieldKey: string): any {
        const fields = fieldKey.split(':');
        let value: any = guest;

        for (let field of fields) {
            if (value && field in value) {
                value = value[field];
            } else {
                return undefined;
            }
        }

        return value;
    }

    return {
        formattedGuestDetailKeys,
        lookupGuestField
    }
}