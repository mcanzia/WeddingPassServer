import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Accommodation } from '../models/Accommodation';

@injectable()
export class AccommodationDao {

    private accommodationsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.accommodationsCollection = db.collection('accommodations');
    }

    async getAllAccommodations(eventId: string): Promise<Array<Accommodation>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.accommodationsCollection
                .where('eventId', '==', eventId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const accommodations: Array<Accommodation> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const accommodationData = doc.data() as Accommodation;
                accommodationData.id = doc.id;
                accommodations.push(accommodationData);
            });

            return accommodations;
        } catch (error) {
            throw new DatabaseError("Could not retrieve accommodations from database: " + error);
        }
    }

    async getAccommodationById(eventId: string, accommodationId: string): Promise<Accommodation> {
        try {
            const snapshot = await this.accommodationsCollection
                .where('__name__', '==', accommodationId)
                .where('eventId', '==', eventId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such accommodation found with the given id and eventId');
            }

            const accommodationDoc = snapshot.docs[0];

            const accommodationData = accommodationDoc.data() as Accommodation;
            accommodationData.id = accommodationDoc.id;

            return accommodationData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve accommodation from database: " + error);
        }
    }

    async saveAccommodation(eventId: string, accommodation: Accommodation): Promise<Accommodation> {
        try {
            const accommodationId = accommodation.id || this.accommodationsCollection.doc().id;
            const accommodationRef = this.accommodationsCollection.doc(accommodationId);

            accommodation.id = accommodationId;
            accommodation.eventId = eventId;

            await accommodationRef.set(accommodation, { merge: true });
            return accommodation;
        } catch (error) {
            throw new DatabaseError("Could not save accommodation: " + error);
        }
    }

    async batchCreateAccommodations(eventId: string, accommodations: Accommodation[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < accommodations.length; i += batchSize) {
                const batch = db.batch();
                const batchAccommodations = accommodations.slice(i, i + batchSize);

                batchAccommodations.forEach(accommodation => {
                    const newAccommodationRef = this.accommodationsCollection.doc();
                    accommodation.id = newAccommodationRef.id;
                    accommodation.eventId = eventId;
                    batch.set(newAccommodationRef, accommodation);
                });

                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add accommodations to database: " + error);
        }
    }

    async deleteAccommodation(eventId: string, accommodationId: string): Promise<void> {
        try {
            const accommodationRef = this.accommodationsCollection.doc(accommodationId);
            const accommodationDoc = await accommodationRef.get();

            if (!accommodationDoc.exists) {
                throw new Error('Accommodation to delete does not exist.');
            }

            const accommodationData = accommodationDoc.data();
            if (!accommodationData) {
                throw new Error('Accommodation data is undefined.');
            }

            if (accommodationData.eventId !== eventId) {
                throw new Error('Accommodation does not belong to the specified event.');
            }

            await accommodationRef.delete();
        } catch (error) {
            throw new DatabaseError('Could not delete accommodation from database: ' + error);
        }
    }


    async batchDeleteAccommodations(eventId: string, accommodations: Accommodation[]): Promise<void> {
        try {
            const batchSize = 500;
            const getAllLimit = 100;

            for (let i = 0; i < accommodations.length; i += batchSize) {
                const batch = db.batch();
                const batchAccommodations = accommodations.slice(i, i + batchSize);

                const accommodationRefs = batchAccommodations.map((accommodation, index) => {
                    if (!accommodation.id) {
                        throw new Error(`Accommodation at index ${i + index} does not have an id.`);
                    }
                    return this.accommodationsCollection.doc(accommodation.id);
                });

                for (let j = 0; j < accommodationRefs.length; j += getAllLimit) {
                    const accommodationRefsChunk = accommodationRefs.slice(j, j + getAllLimit);

                    const docs = await db.getAll(...accommodationRefsChunk);

                    docs.forEach(docSnapshot => {
                        if (!docSnapshot.exists) {
                            return;
                        }

                        const accommodationData = docSnapshot.data();
                        if (accommodationData && accommodationData.eventId === eventId) {
                            batch.delete(docSnapshot.ref);
                        }
                    });
                }

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError('Could not batch delete accommodations: ' + error);
        }
    }


}
