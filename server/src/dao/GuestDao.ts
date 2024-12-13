// src/dao/GuestDao.ts

import { db } from '../configs/firebase';
import { CustomError, DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Guest } from '../models/Guest';
import { WeddingEvent } from '../models/WeddingEvent';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot, Timestamp, DocumentSnapshot } from 'firebase-admin/firestore';
import validator from 'validator';
import Logger from '../util/logs/logger';

@injectable()
export class GuestDao {

    private guestsCollection: CollectionReference<DocumentData>;
    private eventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.guestsCollection = db.collection('guests');
        this.eventsCollection = db.collection('events');
    }

    private async fetchEventsByNames(weddingId: string, eventNames: string[]): Promise<Map<string, WeddingEvent>> {
        const fetchedEventsMap: Map<string, WeddingEvent> = new Map();
        const batchSize = 10;

        for (let i = 0; i < eventNames.length; i += batchSize) {
            const batch = eventNames.slice(i, i + batchSize);
            const snapshot = await this.eventsCollection
                .where('weddingId', '==', weddingId)
                .where('name', 'in', batch)
                .get();

            snapshot.forEach(doc => {
                const eventData = doc.data() as WeddingEvent;
                fetchedEventsMap.set(eventData.name, new WeddingEvent(doc.id, eventData.name, eventData.weddingId, eventData.order));
            });
        }

        return fetchedEventsMap;
    }

    private async fetchAllEvents(weddingId: string): Promise<Map<string, WeddingEvent>> {
        const fetchedEventsMap: Map<string, WeddingEvent> = new Map();

        const snapshot: QuerySnapshot<DocumentData> = await this.eventsCollection.where('weddingId', '==', weddingId).get();

        if (snapshot.empty) {
            return fetchedEventsMap;
        }

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const eventData = doc.data() as WeddingEvent;
            eventData.id = doc.id;
            fetchedEventsMap.set(eventData.id, eventData);
        });

        return fetchedEventsMap;
    }

    async getAllGuests(weddingId: string): Promise<Array<Guest>> {
        try {

            const snapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.attendingEvents = guestData.attendingEvents.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getGuestsForEvent(weddingId: string, eventId: string): Promise<Array<Guest>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('events', 'array-contains', eventId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.attendingEvents = guestData.attendingEvents.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getGuestById(weddingId: string, guestId: string): Promise<Guest> {
        try {
            const snapshot = await this.guestsCollection
                .where('__name__', '==', guestId)
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such guest found with the given id and weddingId');
            }

            const guestDoc = snapshot.docs[0];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            const guestData = guestDoc.data();
            if (guestData) {
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.attendingEvents = guestData.attendingEvents.map((event: string) => events.get(event));
                guestData.id = guestDoc.id;
            }

            return guestData as Guest;
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async getGuestByName(weddingId: string, guestName: string): Promise<Guest> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('name', '==', guestName)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such guest found with the given name');
            }

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.attendingEvents = guestData.attendingEvents.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async fetchPartyMembers(weddingId: string, guestId: string): Promise<Array<Guest>> {
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
                .where('weddingId', '==', weddingId)
                .where('groupNumber', '==', groupNumber)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];
            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((eventId: string) => events.get(eventId));
                guestData.attendingEvents = guestData.attendingEvents.map((eventId: string) => events.get(eventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve party members from database: " + error.message);
        }
    }

    async getGuestsByEmail(weddingId: string, email: string): Promise<Array<Guest>> {
        try {
            const sanitizedEmail = validator.escape(email.trim()).toLowerCase();
            if (!validator.isEmail(sanitizedEmail)) {
                throw new CustomError('Invalid email address format.', 400);
            }

            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('email', '==', sanitizedEmail)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((eventId: string) => events.get(eventId));
                guestData.attendingEvents = guestData.attendingEvents.map((eventId: string) => events.get(eventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve guests by email from database: " + error.message);
        }
    }

    async getGuestsByPhone(weddingId: string, phone: string): Promise<Array<Guest>> {
        try {
            const sanitizedPhone = validator.escape(phone.trim());
            if (!validator.isMobilePhone(sanitizedPhone, 'any', { strictMode: false })) {
                throw new CustomError('Invalid phone number format.', 400);
            }

            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('phone', '==', sanitizedPhone)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((eventId: string) => events.get(eventId));
                guestData.attendingEvents = guestData.attendingEvents.map((eventId: string) => events.get(eventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve guests by phone from database: " + error.message);
        }
    }



    async getGuestBySerialNumber(weddingId: string, serialNumber: string): Promise<Guest> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('serialNumber', '==', serialNumber)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such guest found with the given serialNumber');
            }

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.attendingEvents = guestData.attendingEvents.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async getGuestsByHotel(weddingId: string, hotelId: string): Promise<Array<Guest>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('weddingId', '==', weddingId)
                .where('accommodation.hotel.id', '==', hotelId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents(weddingId);

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((eventId: string) => events.get(eventId));
                guestData.attendingEvents = guestData.attendingEvents.map((eventId: string) => events.get(eventId));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new DatabaseError("Could not retrieve guests by hotel from database: " + error.message);
        }
    }

    async saveGuest(weddingId: string, guest: Guest): Promise<void> {
        try {

            const guestId = guest.id || this.guestsCollection.doc().id;
            const guestRef = this.guestsCollection.doc(guestId);

            guest.id = guestRef.id;
            guest.weddingId = weddingId;
            guest.name = validator.escape(guest.name.trim());
            guest.email = validator.escape(guest.email.trim());
            guest.phone = validator.escape(guest.phone.trim());

            const events = await this.getValidatedEvents(guest, weddingId, guest.events);
            const attendingEvents = await this.getValidatedEvents(guest, weddingId, guest.attendingEvents!);

            const updatedGuest = guest.toObject ?
                { ...guest.toObject(), events: events, attendingEvents: attendingEvents } :
                { ...guest, events: events, attendingEvents: attendingEvents };

            await guestRef.set(updatedGuest, { merge: true });
        } catch (error) {
            throw new DatabaseError("Could not save guest: " + error);
        }
    }

    async batchCreateGuests(weddingId: string, guests: Guest[]): Promise<void> {
        try {
            if (guests.length === 0) {
                throw new DatabaseError("No guests provided for batch creation.");
            }

            const allEventNames = Array.from(
                new Set(
                    guests.flatMap(guest => guest.events.map(event => event.name))
                )
            );

            const fetchedEventsMap = await this.fetchEventsByNames(weddingId, allEventNames);

            for (const name of allEventNames) {
                if (!fetchedEventsMap.has(name)) {
                    throw new DatabaseError(`Event with name "${name}" does not exist.`);
                }
            }

            const validatedGuests = guests.map(guest => {

                const validatedEvents: Array<string> = guest.events.map(event => {
                    const fetchedEvent = fetchedEventsMap.get(event.name);
                    if (fetchedEvent) {
                        return fetchedEvent.id;
                    } else {
                        throw new DatabaseError(`Event with name "${event.name}" was not found.`);
                    }
                });

                return {
                    ...guest,
                    events: validatedEvents,
                };
            });

            const batchSize = 500;
            for (let i = 0; i < validatedGuests.length; i += batchSize) {
                const batch = db.batch();
                const batchGuests = validatedGuests.slice(i, i + batchSize);

                batchGuests.forEach(guest => {
                    const newGuestRef = this.guestsCollection.doc();
                    guest.id = newGuestRef.id;
                    guest.weddingId = weddingId;
                    guest.name = validator.escape(guest.name.trim());
                    guest.email = validator.escape(guest.email.trim());
                    guest.phone = validator.escape(guest.phone.trim());
                    guest.attendingEvents = [];
                    batch.set(newGuestRef, guest);
                });

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError("Could not batch add guests to database: " + error.message);
        }
    }


    async deleteGuest(weddingId: string, guestId: string): Promise<void> {
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
            if (guestData.weddingId !== weddingId) {
                throw new Error('Guest does not belong to the specified wedding.');
            }

            await guestRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete guest from database: " + error);
        }
    }

    async batchDeleteGuests(weddingId: string, guests: Guest[]): Promise<void> {
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
                        if (guestData && guestData.weddingId === weddingId) {
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

    async batchUpdateGuests(weddingId: string, guests: Partial<Guest>[]): Promise<void> {
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

                    if (guest.weddingId && guest.weddingId !== weddingId) {
                        throw new CustomError(`Guest weddingId mismatch for guest id ${guest.id}`, 400);
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

    async getValidatedEvents(guest: Guest, weddingId: string, events: WeddingEvent[]) {
        const eventNames = Array.from(new Set(events.map(event => event.name)));

        const fetchedEventsMap = await this.fetchEventsByNames(weddingId, eventNames);

        for (const name of eventNames) {
            if (!fetchedEventsMap.has(name)) {
                throw new DatabaseError(`Event with name "${name}" does not exist.`);
            }
        }

        const validatedEvents: Array<string> = events.map(event => {
            const fetchedEvent = fetchedEventsMap.get(event.name);
            if (fetchedEvent) {
                return fetchedEvent.id;
            } else {
                throw new DatabaseError(`Event with name "${event.name}" was not found.`);
            }
        });

        return validatedEvents;
    }

}
