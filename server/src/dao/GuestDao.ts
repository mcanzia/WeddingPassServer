import { db } from '../configs/firebase';
import { DatabaseError } from '../util/error/CustomError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../configs/types';
import { Guest } from '../models/Guest';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

@injectable()
export class GuestDao {

    private guestsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.guestsCollection = db.collection('guests');
    }

    async getAllGuests(): Promise<Array<Guest>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.guestsCollection.get();

            if (snapshot.empty) {
                throw new Error('No guests found.');
            }

            const guests: Array<Guest> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data() as Guest;
                guestData.id = doc.id;
                guests.push(guestData);
            });

            return guests;
        } catch (error) {
            throw new DatabaseError("Could not retrieve guests from database: " + error);
        }
    }

    async getGuestById(guestId: string): Promise<Guest> {
        try {
            const guestDoc = await this.guestsCollection.doc(guestId).get();

            if (!guestDoc.exists) {
                throw new Error('No such guest found with the given id');
            }

            const guestData = guestDoc.data() as Guest;
            guestData.id = guestDoc.id;

            return guestData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async getGuestByName(guestName: string): Promise<Guest> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('name', '==', guestName)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such guest found with the given name');
            }

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data() as Guest;
                guestData.id = doc.id;
                guests.push(guestData);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async getGuestBySerialNumber(serialNumber: string): Promise<Guest> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('serialNumber', '==', serialNumber)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such guest found with the given serialNumber');
            }

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data() as Guest;
                guestData.id = doc.id;
                guests.push(guestData);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async createGuest(guest: Guest): Promise<void> {
        try {
            const newGuestRef = this.guestsCollection.doc();
            guest.id = newGuestRef.id;
            await newGuestRef.set(guest);
        } catch (error) {
            throw new DatabaseError("Could not add guest to database: " + error);
        }
    }

    async batchCreateGuests(guests: Guest[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < guests.length; i += batchSize) {
                const batch = db.batch();
                const batchGuests = guests.slice(i, i + batchSize);
    
                batchGuests.forEach(guest => {
                    const newGuestRef = this.guestsCollection.doc();
                    guest.id = newGuestRef.id;
                    batch.set(newGuestRef, guest);
                });
    
                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add guests to database: " + error);
        }
    }
    

    async updateGuest(guestId: string, updatedGuest: Guest): Promise<void> {
        try {
            const guestRef = this.guestsCollection.doc(guestId);
            const guestDoc = await guestRef.get();

            if (!guestDoc.exists) {
                throw new Error('Guest to update does not exist.');
            }

            const { id, ...data } = updatedGuest;

            await guestRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update guest details: " + error);
        }
    }

    async deleteGuest(guestId: string): Promise<void> {
        try {
            const guestRef = this.guestsCollection.doc(guestId);
            const guestDoc = await guestRef.get();

            if (!guestDoc.exists) {
                throw new Error('Guest to delete does not exist.');
            }

            await guestRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete guest from database: " + error);
        }
    }
}
