import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Survey } from '../models/Survey';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

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

    async getSurveyById(weddingId: string, surveyId: string): Promise<Survey> {
        try {
            const snapshot = await this.surveysCollection
                .where('__name__', '==', surveyId)
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such survey found with the given id and weddingId');
            }

            const surveyDoc = snapshot.docs[0];

            const surveyData = surveyDoc.data() as Survey;
            surveyData.id = surveyDoc.id;

            return surveyData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve survey from database: " + error);
        }
    }

    async createSurvey(weddingId: string, survey: Survey): Promise<void> {
        try {
            const newSurveyRef = this.surveysCollection.doc();
            survey.id = newSurveyRef.id;
            survey.weddingId = weddingId;
            await newSurveyRef.set(survey);
        } catch (error) {
            throw new DatabaseError("Could not add survey to database: " + error);
        }
    }

    async updateSurvey(weddingId: string, surveyId: string, updatedSurvey: Survey): Promise<void> {
        try {
            const surveyRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyRef.get();

            if (!surveyDoc.exists) {
                throw new Error('Survey to update does not exist.');
            }

            const surveyData = surveyDoc.data();
            if (!surveyData) {
                throw new Error('Survey data is undefined.');
            }

            if (surveyData.weddingId !== weddingId) {
                throw new Error('Survey does not belong to the specified wedding.');
            }

            const { id, ...data } = updatedSurvey;

            await surveyRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update survey details: " + error);
        }
    }

    async deleteSurvey(weddingId: string, surveyId: string): Promise<void> {
        try {
            const surveyRef = this.surveysCollection.doc(surveyId);
            const surveyDoc = await surveyRef.get();

            if (!surveyDoc.exists) {
                throw new Error('Survey to delete does not exist.');
            }

            const surveyData = surveyDoc.data();
            if (!surveyData) {
                throw new Error('Survey data is undefined.');
            }

            if (surveyData.weddingId !== weddingId) {
                throw new Error('Survey does not belong to the specified wedding.');
            }

            await surveyRef.delete();
        } catch (error) {
            throw new DatabaseError('Could not delete survey from database: ' + error);
        }
    }


}
