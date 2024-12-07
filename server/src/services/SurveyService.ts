import { inject, injectable } from "inversify";
import { Guest } from "../models/Guest";
import { Survey } from "../models/Survey";
import { SurveyComponent } from "../models/SurveyComponent";
import { TYPES } from "../configs/types";
import { SurveyDao } from "../dao/SurveyDao";
import { GuestDao } from "../dao/GuestDao";
import { CustomError } from "../util/error/CustomError";
import { SurveyResponse } from "../models/SurveyResponse";
import _ from 'lodash';

@injectable()
export class SurveyService {

    constructor(@inject(TYPES.SurveyDao) private surveyDao: SurveyDao, @inject(TYPES.GuestDao) private guestDao: GuestDao) { }

    async initializeSurveysForParty(weddingId: string, guestId: string, survey: Survey) {
        try {
            const partyMembers: Guest[] = await this.guestDao.fetchPartyMembers(weddingId, guestId);
            if (!partyMembers.length) {
                return [];
            }
            const surveyResponses: SurveyResponse[] = [];
            for (let member of partyMembers) {
                const clonedSurvey = _.cloneDeep(survey);
                let surveyResponse = {
                    survey: clonedSurvey,
                    guest: member,
                    updatedAt: new Date(),
                    submitted: false
                } as SurveyResponse;
                surveyResponse.survey.surveyComponents = this.initializeGuestValues(surveyResponse.survey.surveyComponents, member);
                surveyResponses.push(surveyResponse);
            }
            return await this.surveyDao.batchAddSurveyResponses(weddingId, surveyResponses);
        } catch (error: any) {
            throw new CustomError(error.message);
        }
    }

    initializeGuestValues(components: SurveyComponent[], guest: Guest) {

        if (guest) {
            this.processSurveyComponents(components, guest);
        }
        return components;
    }

    processSurveyComponents(components: SurveyComponent[], guest: Guest): void {
        for (const component of components) {
            if (component.infoLookupField) {
                const fields = component.infoLookupField.split(':');
                if (!component.componentValue) {
                    const value = this.getGuestFieldValue(guest, fields);
                    if (value) {
                        component.componentValue = value;
                    }
                }
            }
            if (component.surveyTriggers && component.surveyTriggers.length > 0) {
                for (const trigger of component.surveyTriggers) {
                    if (trigger.child) {
                        this.processSurveyComponents([trigger.child], guest);
                    }
                }
            }
        }
    }

    getGuestFieldValue(guest: Guest, fields: string[]) {
        let value: any = guest;

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            if (value && value[field]) {
                value = value[field];
            }
        }
        if (value && typeof (value) !== 'object') {
            return value;
        }
        return undefined;
    }

}