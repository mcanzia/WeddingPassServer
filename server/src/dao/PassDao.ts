import { db } from '../configs/firebase';
import { DatabaseError } from '../util/error/CustomError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../configs/types';
import { Pass } from '../models/Pass';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

@injectable()
export class PassDao {

    private passesCollection: CollectionReference<DocumentData>;

    constructor() {
        this.passesCollection = db.collection('passes');
    }

    async getAllPasses(): Promise<Array<Pass>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.passesCollection.get();

            if (snapshot.empty) {
                throw new Error('No passes found.');
            }

            const passes: Array<Pass> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const passData = doc.data() as Pass;
                passData.id = doc.id;
                passes.push(passData);
            });

            return passes;
        } catch (error) {
            throw new DatabaseError("Could not retrieve passes from database: " + error);
        }
    }

    async getPassById(passId: string): Promise<Pass> {
        try {
            const passDoc = await this.passesCollection.doc(passId).get();

            if (!passDoc.exists) {
                throw new Error('No such pass found with the given id');
            }

            const passData = passDoc.data() as Pass;
            passData.id = passDoc.id;

            return passData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve pass from database: " + error);
        }
    }

    async getPassByName(passName: string): Promise<Pass> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.passesCollection
                .where('name', '==', passName)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such pass found with the given name');
            }

            const passes: Array<Pass> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const passData = doc.data() as Pass;
                passData.id = doc.id;
                passes.push(passData);
            });

            return passes[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve pass from database: " + error);
        }
    }

    async createPass(pass: Pass): Promise<void> {
        try {
            const newPassRef = this.passesCollection.doc(); // Auto-generated ID
            pass.id = newPassRef.id;
            await newPassRef.set(pass);
        } catch (error) {
            throw new DatabaseError("Could not add pass to database: " + error);
        }
    }

    async updatePass(passId: string, updatedPass: Pass): Promise<void> {
        try {
            const passRef = this.passesCollection.doc(passId);
            const passDoc = await passRef.get();

            if (!passDoc.exists) {
                throw new Error('Pass to update does not exist.');
            }

            const { id, ...data } = updatedPass;

            await passRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update pass details: " + error);
        }
    }

    async deletePass(passId: string): Promise<void> {
        try {
            const passRef = this.passesCollection.doc(passId);
            const passDoc = await passRef.get();

            if (!passDoc.exists) {
                throw new Error('Pass to delete does not exist.');
            }

            await passRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete pass from database: " + error);
        }
    }
}
