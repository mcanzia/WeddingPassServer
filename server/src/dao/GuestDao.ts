// src/dao/GuestDao.ts

import { db } from '../configs/firebase';
import { CustomError, DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Guest } from '../models/Guest';
import { WeddingEvent } from '../models/WeddingEvent';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import validator from 'validator';

@injectable()
export class GuestDao {

    private guestsCollection: CollectionReference<DocumentData>;
    private eventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.guestsCollection = db.collection('guests');
        this.eventsCollection = db.collection('events');
    }

    private async fetchEventsByNames(eventNames: string[]): Promise<Map<string, WeddingEvent>> {
        const fetchedEventsMap: Map<string, WeddingEvent> = new Map();
        const batchSize = 10;

        for (let i = 0; i < eventNames.length; i += batchSize) {
            const batch = eventNames.slice(i, i + batchSize);
            const snapshot = await this.eventsCollection.where('name', 'in', batch).get();

            snapshot.forEach(doc => {
                const eventData = doc.data() as WeddingEvent;
                fetchedEventsMap.set(eventData.name, new WeddingEvent(doc.id, eventData.name));
            });
        }

        return fetchedEventsMap;
    }

    private async fetchAllEvents(): Promise<Map<string, WeddingEvent>> {
        const fetchedEventsMap: Map<string, WeddingEvent> = new Map();

        const snapshot: QuerySnapshot<DocumentData> = await this.eventsCollection.get();

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

    async getAllGuests(): Promise<Array<Guest>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.guestsCollection.get();

            if (snapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents();

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getGuestsForEvent(eventId: string): Promise<Array<Guest>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.guestsCollection
                .where('events', 'array-contains', eventId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const guests: Array<Guest> = [];

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents();

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.attendingEvents = guestData.attendingEvents.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests;
        } catch (error : any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getGuestById(guestId: string): Promise<Guest> {
        try {
            const guestDoc = await this.guestsCollection.doc(guestId).get();

            if (!guestDoc.exists) {
                throw new Error('No such guest found with the given id');
            }

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents();

            const guestData = guestDoc.data();
            if (guestData) {
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guestData.id = guestDoc.id;
            }

            return guestData as Guest;
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

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents();

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
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

            const events: Map<string, WeddingEvent> = await this.fetchAllEvents();

            const guests: Array<Guest> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const guestData = doc.data();
                guestData.id = doc.id;
                guestData.events = guestData.events.map((event: string) => events.get(event));
                guests.push(guestData as Guest);
            });

            return guests[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve guest from database: " + error);
        }
    }

    async createGuest(guest: Guest): Promise<void> {
        try {
            const eventNames = Array.from(new Set(guest.events.map(event => event.name)));

            if (eventNames.length === 0) {
                throw new DatabaseError("Guest must be associated with at least one event.");
            }

            const fetchedEventsMap = await this.fetchEventsByNames(eventNames);

            for (const name of eventNames) {
                if (!fetchedEventsMap.has(name)) {
                    throw new DatabaseError(`Event with name "${name}" does not exist.`);
                }
            }

            const validatedEvents: Array<string> = guest.events.map(event => {
                const fetchedEvent = fetchedEventsMap.get(event.name);
                if (fetchedEvent) {
                    return fetchedEvent.id;
                } else {
                    throw new DatabaseError(`Event with name "${event.name}" was not found.`);
                }
            });

            const newGuestRef = this.guestsCollection.doc();
            guest.id = newGuestRef.id;
            guest.name = validator.escape(guest.name.trim());
            guest.email = validator.escape(guest.email.trim());
            guest.phone = validator.escape(guest.phone.trim());
            guest.attendingEvents = [];

            const newGuest = guest.toObject ? { ...guest.toObject(), events: validatedEvents } : { ...guest, events: validatedEvents };

            await newGuestRef.set(newGuest);
        } catch (error: any) {
            throw new DatabaseError("Could not add guest to database: " + error.message);
        }
    }

    async batchCreateGuests(guests: Guest[]): Promise<void> {
        try {
            if (guests.length === 0) {
                throw new DatabaseError("No guests provided for batch creation.");
            }

            const allEventNames = Array.from(
                new Set(
                    guests.flatMap(guest => guest.events.map(event => event.name))
                )
            );

            if (allEventNames.length === 0) {
                throw new DatabaseError("No events associated with the provided guests.");
            }

            const fetchedEventsMap = await this.fetchEventsByNames(allEventNames);

            for (const name of allEventNames) {
                if (!fetchedEventsMap.has(name)) {
                    throw new DatabaseError(`Event with name "${name}" does not exist.`);
                }
            }

            const validatedGuests = guests.map(guest => {
                if (!guest.events || guest.events.length === 0) {
                    throw new DatabaseError(`Guest "${guest.name}" must be associated with at least one event.`);
                }

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

    async updateGuest(guestId: string, updatedGuest: Guest): Promise<void> {
        try {
            const guestRef = this.guestsCollection.doc(guestId);
            const guestDoc = await guestRef.get();

            if (!guestDoc.exists) {
                throw new Error('Guest to update does not exist.');
            }

            const updatedData = { 
                ...updatedGuest,
                name: validator.escape(updatedGuest.name.trim()),
                email: validator.escape(updatedGuest.email.trim()),
                phone: validator.escape(updatedGuest.phone.trim()),
                events: updatedGuest.events.map(event => event.id), 
                attendingEvents: updatedGuest.attendingEvents?.map(event => event.id) 
            };

            await guestRef.update(updatedData);
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

    async batchDeleteGuests(guests: Guest[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < guests.length; i += batchSize) {
                const batch = db.batch();
                const batchGuests = guests.slice(i, i + batchSize);

                batchGuests.forEach(guest => {
                    if (!guest.id) {
                        throw new Error(`Guest at index ${i} does not have an id.`);
                    }
                    const guestRef = this.guestsCollection.doc(guest.id);
                    batch.delete(guestRef);
                });

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError(error.toString());
        }
    }
}
