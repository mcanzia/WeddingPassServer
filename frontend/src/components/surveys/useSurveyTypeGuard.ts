import { Survey } from "@/models/Survey";
import { SurveyResponse } from "@/models/SurveyResponse";

export function useSurveyTypeGuard() {
    function isSurvey(survey: Survey | SurveyResponse): survey is Survey {
        return 'published' in survey;
    }

    function isSurveyResponse(survey: Survey | SurveyResponse): survey is SurveyResponse {
        return 'submitted' in survey;
    }

    return {
        isSurvey,
        isSurveyResponse
    }
}