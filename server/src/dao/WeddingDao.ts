import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Wedding } from '../models/Wedding';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

@injectable()
export class WeddingDao {

    private weddingsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.weddingsCollection = db.collection('weddings');
    }

    async getAllWeddings(): Promise<Array<Wedding>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.weddingsCollection.get();

            if (snapshot.empty) {
                throw new NoDataError('No weddings found.');
            }

            const weddings: Array<Wedding> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const weddingData = doc.data() as Wedding;
                weddingData.id = doc.id;
                weddings.push(weddingData);
            });

            return weddings;
        } catch (error) {
            throw error;
        }
    }

    async getWeddingsByOwner(ownerId: string): Promise<Array<Wedding>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.weddingsCollection
                .where('ownerId', '==', ownerId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const weddings: Array<Wedding> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const weddingData = doc.data() as Wedding;
                weddingData.id = doc.id;
                weddings.push(weddingData);
            });

            return weddings;
        } catch (error) {
            throw new DatabaseError(`Could not retrieve weddings for owner ${ownerId}: ${error}`);
        }
    }

    async getWeddingById(weddingId: string): Promise<Wedding> {
        try {
            const weddingDoc = await this.weddingsCollection.doc(weddingId).get();

            if (!weddingDoc.exists) {
                throw new Error('No such wedding found with the given id');
            }

            const weddingData = weddingDoc.data() as Wedding;
            weddingData.id = weddingDoc.id;

            return weddingData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve wedding from database: " + error);
        }
    }

    async getWeddingByName(weddingName: string): Promise<Wedding> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.weddingsCollection
                .where('name', '==', weddingName)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such wedding found with the given name');
            }

            const weddings: Array<Wedding> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const weddingData = doc.data() as Wedding;
                weddingData.id = doc.id;
                weddings.push(weddingData);
            });

            return weddings[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve wedding from database: " + error);
        }
    }

    async createWedding(wedding: Wedding): Promise<Wedding> {
        try {
            const newWeddingRef = this.weddingsCollection.doc();
            wedding.id = newWeddingRef.id;
            await newWeddingRef.set(wedding);

            return wedding;

        } catch (error) {
            throw new DatabaseError("Could not add wedding to database: " + error);
        }
    }

    async batchCreateWeddings(weddings: Wedding[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < weddings.length; i += batchSize) {
                const batch = db.batch();
                const batchWeddings = weddings.slice(i, i + batchSize);

                batchWeddings.forEach(wedding => {
                    const newWeddingRef = this.weddingsCollection.doc();
                    wedding.id = newWeddingRef.id;
                    batch.set(newWeddingRef, wedding);
                });

                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add weddings to database: " + error);
        }
    }


    async updateWedding(weddingId: string, updatedWedding: Wedding): Promise<void> {
        try {
            const weddingRef = this.weddingsCollection.doc(weddingId);
            const weddingDoc = await weddingRef.get();

            if (!weddingDoc.exists) {
                throw new Error('Wedding to update does not exist.');
            }

            const { id, ...data } = updatedWedding;

            await weddingRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update wedding details: " + error);
        }
    }

    async deleteWedding(weddingId: string): Promise<void> {
        try {
            const weddingRef = this.weddingsCollection.doc(weddingId);
            const weddingDoc = await weddingRef.get();

            if (!weddingDoc.exists) {
                throw new Error('Wedding to delete does not exist.');
            }

            await weddingRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete wedding from database: " + error);
        }
    }

    async batchDeleteWeddings(weddings: Wedding[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < weddings.length; i += batchSize) {
                const batch = db.batch();
                const batchWeddings = weddings.slice(i, i + batchSize);

                batchWeddings.forEach(wedding => {
                    if (!wedding.id) {
                        throw new Error(`Wedding at index ${i} does not have an id.`);
                    }
                    const weddingRef = this.weddingsCollection.doc(wedding.id);
                    batch.delete(weddingRef);
                });

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError(error.toString());
        }
    }

}
