// src/dao/GuestDao.ts

import { db } from '../configs/firebase';
import { CustomError, DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Guest } from '../models/Guest';
import { WeddingEvent } from '../models/WeddingEvent';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import validator from 'validator';
import { PendingGuest } from '../models/PendingGuest';

@injectable()
export class PendingGuestDao {

    private pendingGuestsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.pendingGuestsCollection = db.collection('pending-guests');
    }

    async getAllPendingGuests(weddingId: string): Promise<Array<PendingGuest>> {
        try {

            const snapshot: QuerySnapshot<DocumentData> = await this.pendingGuestsCollection
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const pendingGuests: Array<PendingGuest> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const pendingGuestData = doc.data();
                pendingGuestData.id = doc.id;
                pendingGuests.push(pendingGuestData as PendingGuest);
            });

            return pendingGuests;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getPendingGuestById(weddingId: string, pendingGuestId: string): Promise<PendingGuest> {
        try {
            const snapshot = await this.pendingGuestsCollection
                .where('__name__', '==', pendingGuestId)
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such pending guest found with the given id and weddingId');
            }

            const pendingGuestDoc = snapshot.docs[0];

            const pendingGuestData = pendingGuestDoc.data();
            if (pendingGuestData) {
                pendingGuestData.id = pendingGuestDoc.id;
            }

            return pendingGuestData as PendingGuest;
        } catch (error) {
            throw new DatabaseError("Could not retrieve pending guest from database: " + error);
        }
    }

    async savePendingGuest(weddingId: string, pendingGuest: PendingGuest): Promise<PendingGuest> {
        try {
            const pendingGuestId = pendingGuest.id || this.pendingGuestsCollection.doc().id;
            const pendingGuestRef = this.pendingGuestsCollection.doc(pendingGuestId);

            pendingGuest.id = pendingGuestId;
            pendingGuest.weddingId = weddingId;

            await pendingGuestRef.set(pendingGuest, { merge: true });
            return pendingGuest;
        } catch (error) {
            throw new DatabaseError("Could not save pending guest: " + error);
        }
    }


    async deletePendingGuest(weddingId: string, pendingGuestId: string): Promise<void> {
        try {
            const pendingGuestRef = this.pendingGuestsCollection.doc(pendingGuestId);
            const pendingGuestDoc = await pendingGuestRef.get();

            if (!pendingGuestDoc.exists) {
                throw new Error('Pending guest to delete does not exist.');
            }

            const pendingGuestData = pendingGuestDoc.data();
            if (!pendingGuestData) {
                throw new Error('Pending guest data is undefined.');
            }
            if (pendingGuestData.weddingId !== weddingId) {
                throw new Error('Pending guest does not belong to the specified wedding.');
            }

            await pendingGuestRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete pending guest from database: " + error);
        }
    }

}
