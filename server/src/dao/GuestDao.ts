// src/dao/GuestDao.ts

import { db } from '../configs/firebase';
import { CustomError, DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Guest } from '../models/Guest';
import { SubEvent } from '../models/SubEvent';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot, Timestamp, DocumentSnapshot } from 'firebase-admin/firestore';
import validator from 'validator';
import Logger from '../util/logs/logger';

@injectable()
export class GuestDao {

    private guestsCollection: CollectionReference<DocumentData>;
    private subEventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.guestsCollection = db.collection('guests');
        this.subEventsCollection = db.collection('subevents');
    }

    private async fetchSubEventsByNames(eventId: string, subEventNames: string[]): Promise<Map<string, SubEvent>> {
        const fetchedEventsMap: Map<string, SubEvent> = new Map();
        const batchSize = 10;

        for (let i = 0; i < subEventNames.length; i += batchSize) {
            const batch = subEventNames.slice(i, i + batchSize);
            const snapshot = await this.subEventsCollection
                .where('eventId', '==', eventId)
                .where('name', 'in', batch)
                .get();

            snapshot.forEach(doc => {
                const subEventData = doc.data() as SubEvent;
                fetchedEventsMap.set(subEventData.name, new SubEvent(doc.id, subEventData.name, subEventData.eventId, subEventData.order));
            });
        }

        return fetchedEventsMap;
    }

    private async fetchAllSubEvents(eventId: string): Promise<Map<string, SubEvent>> {
        const fetchedEventsMap: Map<string, SubEvent> = new Map();

        const snapshot: QuerySnapshot<DocumentData> = await this.subEventsCollection.where('eventId', '==', eventId).get();

        if (snapshot.empty) {
            return fetchedEventsMap;
        }

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const subEventData = doc.data() as SubEvent;
            subEventData.id = doc.id;
            fetchedEventsMap.set(subEventData.id, subEventData);
        });

        return fetchedEventsMap;
    }

    async getAllGuests(eventId: string): Promise<Array<Guest>> {
        try {

            const snapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEvent: string) => subEvents.get(subEvent));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEvent: string) => subEvents.get(subEvent));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getGuestsForSubEvent(eventId: string, subEventId: string): Promise<Array<Guest>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('subEvents', 'array-contains', subEventId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEvent: string) => subEvents.get(subEvent));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEvent: string) => subEvents.get(subEvent));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getGuestById(eventId: string, guestId: string): Promise<Guest> {
        try {
            const snapshot = await this.guestsCollection
                .where('__name__', '==', guestId)
                .where('eventId', '==', eventId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such guest found with the given id and eventId');
            }

            const guestDoc = snapshot.docs[0];

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            const guestData = guestDoc.data();
            if (guestData) {
                guestData.subEvents = guestData.subEvents.map((subEvent: string) => subEvents.get(subEvent));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEvent: string) => subEvents.get(subEvent));
                guestData.id = guestDoc.id;
            }

            return guestData as Guest;
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async getGuestByName(eventId: string, guestName: string): Promise<Guest> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('name', '==', guestName)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such guest found with the given name');
            }

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEvent: string) => subEvents.get(subEvent));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEvent: string) => subEvents.get(subEvent));
                guests.push(guestData as Guest);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async fetchPartyMembers(eventId: string, guestId: string): Promise<Array<Guest>> {
        try {
            const guestDoc = await this.guestsCollection.doc(guestId).get();
            if (!guestDoc.exists) {
                return [];
            }
            const guestData = guestDoc.data();

            if (!guestData) {
                return [];
            }

            const groupNumber = guestData.groupNumber;

            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('groupNumber', '==', groupNumber)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];
            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEventId: string) => subEvents.get(subEventId));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEventId: string) => subEvents.get(subEventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve party members from database: " + error.message);
        }
    }

    async getGuestsByEmail(eventId: string, email: string): Promise<Array<Guest>> {
        try {
            const sanitizedEmail = validator.escape(email.trim()).toLowerCase();
            if (!validator.isEmail(sanitizedEmail)) {
                throw new CustomError('Invalid email address format.', 400);
            }

            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('email', '==', sanitizedEmail)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEventId: string) => subEvents.get(subEventId));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEventId: string) => subEvents.get(subEventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve guests by email from database: " + error.message);
        }
    }

    async getGuestsByPhone(eventId: string, phone: string): Promise<Array<Guest>> {
        try {
            const sanitizedPhone = validator.escape(phone.trim());
            if (!validator.isMobilePhone(sanitizedPhone, 'any', { strictMode: false })) {
                throw new CustomError('Invalid phone number format.', 400);
            }

            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('phone', '==', sanitizedPhone)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEventId: string) => subEvents.get(subEventId));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEventId: string) => subEvents.get(subEventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve guests by phone from database: " + error.message);
        }
    }



    async getGuestBySerialNumber(eventId: string, serialNumber: string): Promise<Guest> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('serialNumber', '==', serialNumber)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such guest found with the given serialNumber');
            }

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEvent: string) => subEvents.get(subEvent));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEvent: string) => subEvents.get(subEvent));
                guests.push(guestData as Guest);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async getGuestsByAccommodation(eventId: string, accommodationId: string): Promise<Array<Guest>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('eventId', '==', eventId)
                .where('accommodation.id', '==', accommodationId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const subEvents: Map<string, SubEvent> = await this.fetchAllSubEvents(eventId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.subEvents = guestData.subEvents.map((subEventId: string) => subEvents.get(subEventId));
                guestData.attendingSubEvents = guestData.attendingSubEvents.map((subEventId: string) => subEvents.get(subEventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve guests by accommodation from database: " + error.message);
        }
    }

    async saveGuest(eventId: string, guest: Guest): Promise<void> {
        try {

            const guestId = guest.id || this.guestsCollection.doc().id;
            const guestRef = this.guestsCollection.doc(guestId);

            guest.id = guestRef.id;
            guest.eventId = eventId;
            guest.name = validator.escape(guest.name.trim());
            guest.email = validator.escape(guest.email.trim());
            guest.phone = validator.escape(guest.phone.trim());

            const subEvents = await this.getValidatedSubEvents(guest, eventId, guest.subEvents);
            const attendingSubEvents = await this.getValidatedSubEvents(guest, eventId, guest.attendingSubEvents!);

            const updatedGuest = guest.toObject ?
                { ...guest.toObject(), subEvents: subEvents, attendingSubEvents: attendingSubEvents } :
                { ...guest, subEvents: subEvents, attendingSubEvents: attendingSubEvents };

            await guestRef.set(updatedGuest, { merge: true });
        } catch (error) {
            throw new DatabaseError("Could not save guest: " + error);
        }
    }

    async batchCreateGuests(eventId: string, guests: Guest[]): Promise<void> {
        try {
            if (guests.length === 0) {
                throw new DatabaseError("No guests provided for batch creation.");
            }

            const allSubEventNames = Array.from(
                new Set(
                    guests.flatMap(guest => guest.subEvents.map(subEvent => subEvent.name))
                )
            );

            const fetchedSubEventsMap = await this.fetchSubEventsByNames(eventId, allSubEventNames);

            for (const name of allSubEventNames) {
                if (!fetchedSubEventsMap.has(name)) {
                    throw new DatabaseError(`SubEvent with name "${name}" does not exist.`);
                }
            }

            const validatedGuests = guests.map(guest => {

                const validatedSubEvents: Array<string> = guest.subEvents.map(subEvent => {
                    const fetchedSubEvent = fetchedSubEventsMap.get(subEvent.name);
                    if (fetchedSubEvent) {
                        return fetchedSubEvent.id;
                    } else {
                        throw new DatabaseError(`Event with name "${subEvent.name}" was not found.`);
                    }
                });

                return {
                    ...guest,
                    subEvents: validatedSubEvents,
                };
            });

            const batchSize = 500;
            for (let i = 0; i < validatedGuests.length; i += batchSize) {
                const batch = db.batch();
                const batchGuests = validatedGuests.slice(i, i + batchSize);

                batchGuests.forEach(guest => {
                    const newGuestRef = this.guestsCollection.doc();
                    guest.id = newGuestRef.id;
                    guest.eventId = eventId;
                    guest.name = validator.escape(guest.name.trim());
                    guest.email = validator.escape(guest.email.trim());
                    guest.phone = validator.escape(guest.phone.trim());
                    guest.attendingSubEvents = [];
                    batch.set(newGuestRef, guest);
                });

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError("Could not batch add guests to database: " + error.message);
        }
    }


    async deleteGuest(eventId: string, guestId: string): Promise<void> {
        try {
            const guestRef = this.guestsCollection.doc(guestId);
            const guestDoc = await guestRef.get();

            if (!guestDoc.exists) {
                throw new Error('Guest to delete does not exist.');
            }

            const guestData = guestDoc.data();
            if (!guestData) {
                throw new Error('Guest data is undefined.');
            }
            if (guestData.eventId !== eventId) {
                throw new Error('Guest does not belong to the specified event.');
            }

            await guestRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete guest from database: " + error);
        }
    }

    async batchDeleteGuests(eventId: string, guests: Guest[]): Promise<void> {
        try {
            const batchSize = 500;
            const getAllLimit = 100;

            for (let i = 0; i < guests.length; i += batchSize) {
                const batch = db.batch();
                const batchGuests = guests.slice(i, i + batchSize);

                const docRefs = batchGuests.map((guest, index) => {
                    if (!guest.id) {
                        throw new Error(`Guest at index ${i + index} does not have an id.`);
                    }
                    return this.guestsCollection.doc(guest.id);
                });

                for (let j = 0; j < docRefs.length; j += getAllLimit) {
                    const docRefsChunk = docRefs.slice(j, j + getAllLimit);

                    const docs = await db.getAll(...docRefsChunk);

                    docs.forEach(docSnapshot => {
                        if (!docSnapshot.exists) {
                            return;
                        }

                        const guestData = docSnapshot.data();
                        if (guestData && guestData.eventId === eventId) {
                            batch.delete(docSnapshot.ref);
                        }
                    });
                }

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError('Could not batch delete guests: ' + error);
        }
    }

    async batchUpdateGuests(eventId: string, guests: Partial<Guest>[]): Promise<void> {
        try {

            const batchSize = 500;
            for (let i = 0; i < guests.length; i += batchSize) {
                const batch = db.batch();
                const batchGuests = guests.slice(i, i + batchSize);

                const docRefs = batchGuests
                    .filter(guest => guest.id)
                    .map(guest => this.guestsCollection.doc(guest.id!));

                const docSnapshots: DocumentSnapshot<DocumentData>[] = await db.getAll(...docRefs);

                for (let j = 0; j < docSnapshots.length; j++) {
                    const docSnapshot = docSnapshots[j];
                    const guest = batchGuests[j];

                    if (!docSnapshot.exists) {
                        Logger.warn(`Skipping update for non-existent guest with id: ${guest.id}`);
                        continue;
                    }

                    if (guest.eventId && guest.eventId !== eventId) {
                        throw new CustomError(`Guest eventId mismatch for guest id ${guest.id}`, 400);
                    }

                    const docRef = this.guestsCollection.doc(guest.id!);

                    const updateData: { [key: string]: any } = {};
                    this.flattenObject(guest, updateData);

                    if (Object.keys(updateData).length > 0) {
                        batch.update(docRef, updateData);
                    } else {
                        Logger.info(`No fields provided to update for guest id: ${guest.id}`);
                    }
                }

                if (batch) {
                    await batch.commit();
                    Logger.info(`Committed batch updates for guests ${i + 1} to ${i + batchGuests.length}`);
                } else {
                    Logger.info(`No updates to commit for batch ${i + 1} to ${i + batchGuests.length}`);
                }
            }
        } catch (error: any) {
            throw new CustomError("Could not batch update guests: " + error.message, error.statusCode || 500);
        }
    }

    private flattenObject(obj: any, result: { [key: string]: any }, parentKey: string = ''): void {
        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined || value === null) {
                continue;
            }

            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof value === 'object' && !(value instanceof Timestamp) && !(value instanceof Array)) {
                this.flattenObject(value, result, fullKey);
            } else {
                result[fullKey] = value;
            }
        }
    }

    async getValidatedSubEvents(guest: Guest, eventId: string, subEvents: SubEvent[]) {
        const subEventNames = Array.from(new Set(subEvents.map(subEvent => subEvent.name)));

        const fetchedSubEventsMap = await this.fetchSubEventsByNames(eventId, subEventNames);

        for (const name of subEventNames) {
            if (!fetchedSubEventsMap.has(name)) {
                throw new DatabaseError(`Event with name "${name}" does not exist.`);
            }
        }

        const validatedSubEvents: Array<string> = subEvents.map(subEvent => {
            const fetchedSubEvent = fetchedSubEventsMap.get(subEvent.name);
            if (fetchedSubEvent) {
                return fetchedSubEvent.id;
            } else {
                throw new DatabaseError(`SubEvent with name "${subEvent.name}" was not found.`);
            }
        });

        return validatedSubEvents;
    }

}
