import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Survey } from '../models/Survey';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { SurveyResponse } from '../models/SurveyResponse';
import { Guest } from '../models/Guest';

@injectable()
export class SurveyDao {

    private surveysCollection: CollectionReference<DocumentData>;
    private guestsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.surveysCollection = db.collection('surveys');
        this.guestsCollection = db.collection('guests');
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

            const surveyResponsesCollection = surveyDocRef.collection('surveyResponses');
            const snapshot = await surveyResponsesCollection.get();

            if (snapshot.empty) {
                return [];
            }

            const surveyResponses: Array<SurveyResponse> = [];

            for (const doc of snapshot.docs) {
                const responseData = doc.data();
                const guestId = responseData.guest;

                const guestDoc = await this.guestsCollection.doc(guestId).get();
                if (!guestDoc.exists) {
                    throw new DatabaseError(`Guest not found for guestId: ${guestId}`);
                }
                const guestData = guestDoc.data();
                this.setDateFields(guestData!);
                const guest = {
                    ...guestData,
                    id: guestDoc.id
                } as Guest;

                const surveyResponse = new SurveyResponse(
                    doc.id,
                    guest,
                    responseData.survey,
                    responseData.updatedAt.toDate(),
                    responseData.submitted
                );

                surveyResponses.push(surveyResponse);
            }

            return surveyResponses;
        } catch (error) {
            throw new DatabaseError(`Error retrieving survey responses: ${error}`);
        }
    }


    async getAllSurveyResponsesForGuest(weddingId: string, guestId: string): Promise<Array<SurveyResponse>> {
        try {
            const querySnapshot = await db
                .collectionGroup('surveyResponses')
                .where('guest', '==', guestId)
                .where('survey.weddingId', '==', weddingId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const surveyResponses: Array<SurveyResponse> = [];

            for (const doc of querySnapshot.docs) {
                const responseData = doc.data();

                const guestDoc = await this.guestsCollection.doc(guestId).get();
                if (!guestDoc.exists) {
                    throw new DatabaseError(`Guest not found for guestId: ${guestId}`);
                }

                const guestData = guestDoc.data();
                this.setDateFields(guestData!);
                const guest = {
                    ...guestData,
                    id: guestDoc.id
                } as Guest;

                const surveyResponse = new SurveyResponse(
                    doc.id,
                    guest,
                    responseData.survey,
                    responseData.updatedAt.toDate(),
                    responseData.submitted
                );

                surveyResponses.push(surveyResponse);
            }

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

            const surveyResponseDocRef = surveyDocRef.collection('surveyResponses').doc(surveyResponseId);

            const surveyResponseDoc = await surveyResponseDocRef.get();
            if (!surveyResponseDoc.exists) {
                throw new DatabaseError('Survey response not found.');
            }

            const responseData = surveyResponseDoc.data();

            if (!responseData) {
                throw new DatabaseError('Survey response not found.');
            }

            const guestId = responseData.guest;
            const guestDoc = await this.guestsCollection.doc(guestId).get();
            if (!guestDoc.exists) {
                throw new DatabaseError(`Guest not found for guestId: ${guestId}`);
            }

            const guestData = guestDoc.data();
            this.setDateFields(guestData!);
            const guest = {
                ...guestData,
                id: guestDoc.id
            } as Guest;

            const surveyResponse = new SurveyResponse(
                surveyResponseDoc.id,
                guest,
                responseData.survey,
                (responseData.updatedAt as Timestamp).toDate(),
                responseData.submitted
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

            const survey = {
                ...surveyData,
                id: surveyId
            } as Survey;

            const surveyResponsesCollection = surveyDocRef.collection('surveyResponses');

            const querySnapshot = await surveyResponsesCollection
                .where('guest', '==', guestId)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new DatabaseError('No survey response found for the specified guest.');
            }

            const surveyResponseDoc = querySnapshot.docs[0];
            const responseData = surveyResponseDoc.data();

            const guestDoc = await this.guestsCollection.doc(guestId).get();
            if (!guestDoc.exists) {
                throw new DatabaseError(`Guest not found for guestId: ${guestId}`);
            }

            const guestData = guestDoc.data();
            this.setDateFields(guestData!);
            const guest = {
                ...guestData,
                id: guestDoc.id
            } as Guest;

            const surveyResponse = new SurveyResponse(
                surveyResponseDoc.id,
                guest,
                survey,
                (responseData.updatedAt as Timestamp).toDate(),
                responseData.submitted
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

            const guestId = surveyResponse.guest.id;

            const existingResponseQuery = await surveyResponsesCollection
                .where('guest', '==', guestId)
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

            const surveyObject = surveyResponse.survey.toObject ? surveyResponse.survey.toObject() : surveyResponse.survey;

            const responseData = {
                responseId: surveyResponse.responseId,
                survey: surveyObject,
                guest: surveyResponse.guest.id,
                submitted: surveyResponse.submitted,
                updatedAt: surveyResponse.updatedAt,
            };

            await surveyResponseDocRef.set(responseData, { merge: true });

            return surveyResponse;
        } catch (error: any) {
            throw new DatabaseError(`Could not save survey response: ${error.message}`);
        }
    }

    async batchAddSurveyResponses(weddingId: string, surveyResponses: SurveyResponse[]): Promise<SurveyResponse[]> {
        try {
            if (!surveyResponses.length) {
                return [];
            }

            const surveyId = surveyResponses[0].survey.id;

            const surveyDocRef = this.surveysCollection.doc(surveyId);

            const surveyResponsesCollection = surveyDocRef.collection('surveyResponses');
            const result: SurveyResponse[] = [];

            for (const sr of surveyResponses) {
                const guestId = sr.guest.id;

                const existingResponseQuery = await surveyResponsesCollection
                    .where('guest', '==', guestId)
                    .limit(1)
                    .get();

                if (!existingResponseQuery.empty) {
                    const existingDoc = existingResponseQuery.docs[0];
                    const existingData = existingDoc.data();

                    const storedSurveyData = { ...existingData.survey } as Survey;

                    const existingSurveyResponse = new SurveyResponse(
                        existingDoc.id,
                        sr.guest,
                        storedSurveyData,
                        existingData.updatedAt.toDate(),
                        existingData.submitted
                    );

                    result.push(existingSurveyResponse);
                } else {
                    const newDocRef = surveyResponsesCollection.doc();
                    sr.responseId = newDocRef.id;
                    sr.updatedAt = new Date();

                    const surveyObj = sr.survey.toObject ? sr.survey.toObject() : sr.survey;

                    const responseData = {
                        responseId: sr.responseId,
                        survey: surveyObj,
                        guest: sr.guest.id,
                        submitted: sr.submitted,
                        updatedAt: sr.updatedAt
                    };

                    await newDocRef.set(responseData);

                    result.push(sr);
                }
            }

            return result;
        } catch (error: any) {
            throw new DatabaseError(`Could not batch add survey responses: ${error.message}`);
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

    async fetchPartySurveyResponses(
        weddingId: string,
        surveyId: string,
        guestId: string
    ): Promise<Array<SurveyResponse>> {
        try {
            const guestDoc = await this.guestsCollection.doc(guestId).get();
            if (!guestDoc.exists) {
                throw new DatabaseError(`Guest not found for guestId: ${guestId}`);
            }

            const guestData = guestDoc.data() as Guest;
            const groupNumber = guestData.groupNumber;

            const guestsSnapshot = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('groupNumber', '==', groupNumber)
                .get();

            if (guestsSnapshot.empty) {
                return [];
            }

            const guestIds: string[] = [];
            guestsSnapshot.forEach((doc) => {
                guestIds.push(doc.id);
            });

            const CHUNK_SIZE = 10;
            const chunks = [];

            for (let i = 0; i < guestIds.length; i += CHUNK_SIZE) {
                chunks.push(guestIds.slice(i, i + CHUNK_SIZE));
            }

            const surveyResponses: SurveyResponse[] = [];

            for (const chunk of chunks) {
                const querySnapshot = await db
                    .collectionGroup('surveyResponses')
                    .where('survey.weddingId', '==', weddingId)
                    .where('survey.id', '==', surveyId)
                    .where('guest', 'in', chunk)
                    .get();
                if (querySnapshot.empty) {
                    continue;
                }

                for (const doc of querySnapshot.docs) {
                    const responseData = doc.data();
                    const guestId = responseData.guest;
                    const guestDoc = await this.guestsCollection.doc(guestId).get();
                    if (!guestDoc.exists) {
                        throw new DatabaseError(`Guest not found for guestId: ${guestId}`);
                    }

                    const guestData = guestDoc.data();
                    this.setDateFields(guestData!);
                    const guest = {
                        ...guestData,
                        id: guestDoc.id
                    } as Guest;

                    const surveyResponse = new SurveyResponse(
                        doc.id,
                        guest,
                        responseData.survey,
                        (responseData.updatedAt as Timestamp).toDate(),
                        responseData.submitted
                    );

                    surveyResponses.push(surveyResponse);
                }
            }

            return surveyResponses;
        } catch (error: any) {
            throw new DatabaseError(`Could not retrieve survey responses for party: ${error.message}`);
        }
    }

    setDateFields(guestData: DocumentData) {
        if (guestData.arrival) {
            if (guestData.arrival.flightTime) {
                guestData.arrival.flightTime = guestData.arrival.flightTime.toDate();
            }
            if (guestData.arrival.trainTime) {
                guestData.arrival.trainTime = guestData.arrival.trainTime.toDate();
            }
            if (guestData.arrival.busTime) {
                guestData.arrival.busTime = guestData.arrival.busTime.toDate();
            }
        }
        if (guestData.departure) {
            if (guestData.departure.flightTime) {
                guestData.departure.flightTime = guestData.departure.flightTime.toDate();
            }
            if (guestData.departure.trainTime) {
                guestData.departure.trainTime = guestData.departure.trainTime.toDate();
            }
            if (guestData.departure.busTime) {
                guestData.departure.busTime = guestData.departure.busTime.toDate();
            }
        }
    }



}
