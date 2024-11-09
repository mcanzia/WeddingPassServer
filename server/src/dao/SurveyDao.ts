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


}
