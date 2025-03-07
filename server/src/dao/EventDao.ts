import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { Event } from '../models/Event';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

@injectable()
export class EventDao {

    private eventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.eventsCollection = db.collection('events');
    }

    async getAllEvents(): Promise<Array<Event>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.eventsCollection.get();

            if (snapshot.empty) {
                throw new NoDataError('No events found.');
            }

            const events: Array<Event> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const eventData = doc.data() as Event;
                eventData.id = doc.id;
                events.push(eventData);
            });

            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventsByOwner(ownerId: string): Promise<Array<Event>> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.eventsCollection
                .where('ownerId', '==', ownerId)
                .get();

            if (querySnapshot.empty) {
                return [];
            }

            const events: Array<Event> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const eventData = doc.data() as Event;
                eventData.id = doc.id;
                events.push(eventData);
            });

            return events;
        } catch (error) {
            throw new DatabaseError(`Could not retrieve events for owner ${ownerId}: ${error}`);
        }
    }

    async getEventById(eventId: string): Promise<Event> {
        try {
            const eventDoc = await this.eventsCollection.doc(eventId).get();

            if (!eventDoc.exists) {
                throw new Error('No such event found with the given id');
            }

            const eventData = eventDoc.data() as Event;
            eventData.id = eventDoc.id;

            return eventData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve event from database: " + error);
        }
    }

    async getEventByName(eventName: string): Promise<Event> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.eventsCollection
                .where('name', '==', eventName)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such event found with the given name');
            }

            const events: Array<Event> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const eventData = doc.data() as Event;
                eventData.id = doc.id;
                events.push(eventData);
            });

            return events[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve event from database: " + error);
        }
    }

    async createEvent(event: Event): Promise<Event> {
        try {
            const newEventRef = this.eventsCollection.doc();
            event.id = newEventRef.id;
            await newEventRef.set(event);

            return event;

        } catch (error) {
            throw new DatabaseError("Could not add event to database: " + error);
        }
    }

    async batchCreateEvents(events: Event[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < events.length; i += batchSize) {
                const batch = db.batch();
                const batchEvents = events.slice(i, i + batchSize);

                batchEvents.forEach(event => {
                    const newEventRef = this.eventsCollection.doc();
                    event.id = newEventRef.id;
                    batch.set(newEventRef, event);
                });

                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add events to database: " + error);
        }
    }


    async updateEvent(eventId: string, updatedEvent: Event): Promise<void> {
        try {
            const eventRef = this.eventsCollection.doc(eventId);
            const eventDoc = await eventRef.get();

            if (!eventDoc.exists) {
                throw new Error('Event to update does not exist.');
            }

            const { id, ...data } = updatedEvent;

            await eventRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update event details: " + error);
        }
    }

    async deleteEvent(eventId: string): Promise<void> {
        try {
            const eventRef = this.eventsCollection.doc(eventId);
            const eventDoc = await eventRef.get();

            if (!eventDoc.exists) {
                throw new Error('Event to delete does not exist.');
            }

            await eventRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete event from database: " + error);
        }
    }

    async batchDeleteEvents(events: Event[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < events.length; i += batchSize) {
                const batch = db.batch();
                const batchEvents = events.slice(i, i + batchSize);

                batchEvents.forEach(event => {
                    if (!event.id) {
                        throw new Error(`Event at index ${i} does not have an id.`);
                    }
                    const eventRef = this.eventsCollection.doc(event.id);
                    batch.delete(eventRef);
                });

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError(error.toString());
        }
    }

}
