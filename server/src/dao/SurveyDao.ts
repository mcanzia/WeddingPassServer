import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Survey } from '../models/Survey';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { SurveyResponse } from '../models/SurveyResponse';

@injectable()
export class SurveyDao {

    private surveysCollection: CollectionReference<DocumentData>;

    constructor() {
        this.surveysCollection = db.collection('surveys');
    }

    async getAllSurveys(weddingId: string): Promise<Array<Survey>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.surveysCollection
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const surveys: Array<Survey> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const surveyData = doc.data() as Survey;
                surveyData.id = doc.id;
                surveys.push(surveyData);
            });

            return surveys;
        } catch (error) {
            throw error;
        }
    }

    async getPublishedSurveys(weddingId: string): Promise<Array<Survey>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.surveysCollection
                .where('weddingId', '==', weddingId)
                .where('published', '==', true)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const surveys: Array<Survey> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const surveyData = doc.data() as Survey;
                surveyData.id = doc.id;
                surveys.push(surveyData);
            });

            return surveys;
        } catch (error) {
            throw error;
        }
    }

    async getSurveyById(weddingId: string, surveyId: string): Promise<Survey> {
        try {
            const surveyRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyRef.get();

            if (!surveyDoc.exists) {
                throw new NoDataError('No survey found with the given ID.');
            }

            const surveyData = surveyDoc.data() as Survey;

            if (surveyData.weddingId !== weddingId) {
                throw new Error('Survey does not belong to the specified wedding.');
            }

            surveyData.id = surveyDoc.id;

            return surveyData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve survey from database: " + error);
        }
    }

    async saveSurvey(weddingId: string, survey: Survey): Promise<Survey> {
        try {
            const surveyId = survey.id || this.surveysCollection.doc().id;
            const surveyRef = this.surveysCollection.doc(surveyId);

            survey.id = surveyId;
            survey.weddingId = weddingId;

            await surveyRef.set(survey, { merge: true });
            return survey;
        } catch (error) {
            throw new DatabaseError("Could not save survey: " + error);
        }
    }

    async deleteSurvey(weddingId: string, surveyId: string): Promise<void> {
        try {
            const surveyRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyRef.get();

            if (!surveyDoc.exists) {
                throw new NoDataError('Survey to delete does not exist.');
            }

            const surveyData = surveyDoc.data() as Survey;

            if (surveyData.weddingId !== weddingId) {
                throw new Error('Survey does not belong to the specified wedding.');
            }

            await surveyRef.delete();
        } catch (error) {
            throw new DatabaseError('Could not delete survey from database: ' + error);
        }
    }

    //TODO - move to its own DAO
    // Survey Responses
    async getAllSurveyResponses(weddingId: string, surveyId: string): Promise<Array<SurveyResponse>> {
        try {
            const surveyDocRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyDocRef.get();

            if (!surveyDoc.exists) {
                throw new Error('Survey not found.');
            }

            const surveyData = surveyDoc.data() as Survey;

            if (surveyData.weddingId !== weddingId) {
                throw new Error('Survey does not belong to the specified wedding.');
            }

            const surveyResponsesCollection: CollectionReference<DocumentData> = surveyDocRef.collection('surveyResponses');

            const snapshot: QuerySnapshot<DocumentData> = await surveyResponsesCollection.get();

            if (snapshot.empty) {
                return [];
            }

            const surveyResponses: Array<SurveyResponse> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const responseData = doc.data();
                const surveyResponse = new SurveyResponse(
                    doc.id,
                    responseData.surveyId,
                    responseData.weddingId,
                    responseData.guestId,
                    responseData.responses,
                    responseData.updatedAt.toDate(),
                    responseData.submitted,
                    responseData.title,
                    responseData.showPartyMemberSurveys
                );
                surveyResponses.push(surveyResponse);
            });

            return surveyResponses;
        } catch (error) {
            throw new DatabaseError(`Error retrieving survey responses: ${error}`);
        }
    }

    async getAllSurveyResponsesForGuest(weddingId: string, guestId: string): Promise<Array<SurveyResponse>> {
        try {
            const querySnapshot = await db
                .collectionGroup('surveyResponses')
                .where('guestId', '==', guestId)
                .where('weddingId', '==', weddingId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const surveyResponses: Array<SurveyResponse> = [];

            querySnapshot.forEach((doc) => {
                const responseData = doc.data();
                const surveyId = doc.ref.parent.parent?.id;
                const surveyResponse = new SurveyResponse(
                    doc.id,
                    surveyId!,
                    responseData.weddingId,
                    responseData.guestId,
                    responseData.responses,
                    (responseData.updatedAt as Timestamp).toDate(),
                    responseData.submitted,
                    responseData.title,
                    responseData.showPartyMemberSurveys
                );
                surveyResponses.push(surveyResponse);
            });

            return surveyResponses;
        } catch (error: any) {
            console.error('ERROR', error);
            throw new DatabaseError(`Could not retrieve survey responses for guest: ${error.message}`);
        }
    }

    async getSurveyResponseById(
        weddingId: string,
        surveyId: string,
        surveyResponseId: string
    ): Promise<SurveyResponse> {
        try {
            const surveyDocRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyDocRef.get();
            if (!surveyDoc.exists) {
                throw new DatabaseError('Survey not found.');
            }

            const surveyData = surveyDoc.data() as Survey;

            if (surveyData.weddingId !== weddingId) {
                throw new DatabaseError('Survey does not belong to the specified wedding.');
            }

            const surveyResponseDocRef = surveyDocRef.collection('surveyResponses').doc(surveyResponseId);

            const surveyResponseDoc = await surveyResponseDocRef.get();
            if (!surveyResponseDoc.exists) {
                throw new DatabaseError('Survey response not found.');
            }

            const responseData = surveyResponseDoc.data();

            if (!responseData) {
                throw new DatabaseError('Survey response not found.');
            }

            const surveyResponse = new SurveyResponse(
                surveyResponseDoc.id,
                responseData.surveyId,
                responseData.weddingId,
                responseData.guestId,
                responseData.responses,
                (responseData.updatedAt as Timestamp).toDate(),
                responseData.submitted,
                responseData.title,
                responseData.showPartyMemberSurveys
            );

            return surveyResponse;
        } catch (error: any) {
            throw new DatabaseError(`Could not retrieve survey response: ${error.message}`);
        }
    }

    async getSurveyResponseByGuest(
        weddingId: string,
        surveyId: string,
        guestId: string
    ): Promise<SurveyResponse> {
        try {
            const surveyDocRef = this.surveysCollection.doc(surveyId);

            const surveyDoc = await surveyDocRef.get();
            if (!surveyDoc.exists) {
                throw new DatabaseError('Survey not found.');
            }

            const surveyData = surveyDoc.data() as Survey;

            if (surveyData.weddingId !== weddingId) {
                throw new DatabaseError('Survey does not belong to the specified wedding.');
            }

            const surveyResponsesCollection = surveyDocRef.collection('surveyResponses');

            const querySnapshot = await surveyResponsesCollection
                .where('guestId', '==', guestId)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new DatabaseError('No survey response found for the specified guest.');
            }

            const surveyResponseDoc = querySnapshot.docs[0];
            const responseData = surveyResponseDoc.data();

            const surveyResponse = new SurveyResponse(
                surveyResponseDoc.id,
                responseData.surveyId,
                responseData.weddingId,
                responseData.guestId,
                responseData.responses,
                (responseData.updatedAt as Timestamp).toDate(),
                responseData.submitted,
                responseData.title,
                responseData.showPartyMemberSurveys
            );

            return surveyResponse;
        } catch (error: any) {
            throw new DatabaseError(`Could not retrieve survey response: ${error.message}`);
        }
    }

    async saveSurveyResponse(
        weddingId: string,
        surveyId: string,
        surveyResponse: SurveyResponse
    ): Promise<SurveyResponse> {
        try {
            const surveyDocRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyDocRef.get();
            if (!surveyDoc.exists) {
                throw new DatabaseError('Survey not found.');
            }

            const surveyData = surveyDoc.data() as Survey;
            if (surveyData.weddingId !== weddingId) {
                throw new DatabaseError('Survey does not belong to the specified wedding.');
            }

            const surveyResponsesCollection = surveyDocRef.collection('surveyResponses');

            const existingResponseQuery = await surveyResponsesCollection
                .where('guestId', '==', surveyResponse.guestId)
                .limit(1)
                .get();

            let surveyResponseDocRef;

            if (!existingResponseQuery.empty) {
                surveyResponseDocRef = existingResponseQuery.docs[0].ref;
                surveyResponse.responseId = surveyResponseDocRef.id;
            } else {
                surveyResponseDocRef = surveyResponsesCollection.doc();
                surveyResponse.responseId = surveyResponseDocRef.id;
            }

            surveyResponse.updatedAt = new Date();

            const responseData = {
                responseId: surveyResponse.responseId,
                surveyId: surveyResponse.surveyId,
                weddingId: surveyResponse.weddingId,
                title: surveyResponse.title,
                submitted: surveyResponse.submitted,
                guestId: surveyResponse.guestId,
                responses: surveyResponse.responses,
                updatedAt: surveyResponse.updatedAt,
            };

            await surveyResponseDocRef.set(responseData, { merge: true });

            return surveyResponse;
        } catch (error: any) {
            throw new DatabaseError(`Could not save survey response: ${error.message}`);
        }
    }

    async deleteSurveyResponse(
        weddingId: string,
        surveyId: string,
        surveyResponseId: string
    ): Promise<void> {
        try {
            const surveyDocRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyDocRef.get();
            if (!surveyDoc.exists) {
                throw new DatabaseError('Survey not found.');
            }

            const surveyData = surveyDoc.data() as Survey;
            if (surveyData.weddingId !== weddingId) {
                throw new DatabaseError('Survey does not belong to the specified wedding.');
            }

            const surveyResponseDocRef = surveyDocRef.collection('surveyResponses').doc(surveyResponseId);

            const surveyResponseDoc = await surveyResponseDocRef.get();
            if (!surveyResponseDoc.exists) {
                throw new DatabaseError('Survey response not found.');
            }

            await surveyResponseDocRef.delete();
        } catch (error: any) {
            throw new DatabaseError(`Could not delete survey response: ${error.message}`);
        }
    }


}
