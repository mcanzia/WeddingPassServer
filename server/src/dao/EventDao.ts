import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { WeddingEvent } from '../models/WeddingEvent';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

@injectable()
export class EventDao {

    private eventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.eventsCollection = db.collection('events');
    }

    async getAllEvents(weddingId: string): Promise<Array<WeddingEvent>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.eventsCollection
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const events: Array<WeddingEvent> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const eventData = doc.data() as WeddingEvent;
                eventData.id = doc.id;
                events.push(eventData);
            });

            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventById(weddingId: string, eventId: string): Promise<WeddingEvent> {
        try {
            const snapshot = await this.eventsCollection
                .where('__name__', '==', eventId)
                .where('weddingId', '==', weddingId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such event found with the given id and weddingId');
            }

            const eventDoc = snapshot.docs[0];

            const eventData = eventDoc.data() as WeddingEvent;
            eventData.id = eventDoc.id;

            return eventData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve event from database: " + error);
        }
    }

    async getEventByName(weddingId: string, eventName: string): Promise<WeddingEvent> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.eventsCollection
                .where('name', '==', eventName)
                .where('weddingId', '==', weddingId)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such event found with the given name');
            }

            const events: Array<WeddingEvent> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const eventData = doc.data() as WeddingEvent;
                eventData.id = doc.id;
                events.push(eventData);
            });

            return events[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve event from database: " + error);
        }
    }

    async createEvent(weddingId: string, event: WeddingEvent): Promise<void> {
        try {
            const newEventRef = this.eventsCollection.doc();
            event.id = newEventRef.id;
            event.weddingId = weddingId;
            await newEventRef.set(event);
        } catch (error) {
            throw new DatabaseError("Could not add event to database: " + error);
        }
    }

    async batchCreateEvents(weddingId: string, events: WeddingEvent[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < events.length; i += batchSize) {
                const batch = db.batch();
                const batchEvents = events.slice(i, i + batchSize);

                batchEvents.forEach(event => {
                    const newEventRef = this.eventsCollection.doc();
                    event.id = newEventRef.id;
                    event.weddingId = weddingId;
                    batch.set(newEventRef, event);
                });

                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add events to database: " + error);
        }
    }


    async updateEvent(weddingId: string, eventId: string, updatedEvent: WeddingEvent): Promise<void> {
        try {
            const eventRef = this.eventsCollection.doc(eventId);
            const eventDoc = await eventRef.get();

            if (!eventDoc.exists) {
                throw new Error('Event to update does not exist.');
            }

            const eventData = eventDoc.data();
            if (!eventData) {
                throw new Error('Event data is undefined.');
            }

            if (eventData.weddingId !== weddingId) {
                throw new Error('Event does not belong to the specified wedding.');
            }

            const { id, ...data } = updatedEvent;

            await eventRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update event details: " + error);
        }
    }

    async deleteEvent(weddingId: string, eventId: string): Promise<void> {
        try {
            const eventRef = this.eventsCollection.doc(eventId);
            const eventDoc = await eventRef.get();

            if (!eventDoc.exists) {
                throw new Error('Event to delete does not exist.');
            }

            const eventData = eventDoc.data();
            if (!eventData) {
                throw new Error('Event data is undefined.');
            }

            if (eventData.weddingId !== weddingId) {
                throw new Error('Event does not belong to the specified wedding.');
            }

            await eventRef.delete();
        } catch (error) {
            throw new DatabaseError('Could not delete event from database: ' + error);
        }
    }


    async batchDeleteEvents(weddingId: string, events: WeddingEvent[]): Promise<void> {
        try {
            const batchSize = 500;
            const getAllLimit = 100;

            for (let i = 0; i < events.length; i += batchSize) {
                const batch = db.batch();
                const batchEvents = events.slice(i, i + batchSize);

                const eventRefs = batchEvents.map((event, index) => {
                    if (!event.id) {
                        throw new Error(`Event at index ${i + index} does not have an id.`);
                    }
                    return this.eventsCollection.doc(event.id);
                });

                for (let j = 0; j < eventRefs.length; j += getAllLimit) {
                    const eventRefsChunk = eventRefs.slice(j, j + getAllLimit);

                    const docs = await db.getAll(...eventRefsChunk);

                    docs.forEach(docSnapshot => {
                        if (!docSnapshot.exists) {
                            return;
                        }

                        const eventData = docSnapshot.data();
                        if (eventData && eventData.weddingId === weddingId) {
                            batch.delete(docSnapshot.ref);
                        }
                    });
                }

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError('Could not batch delete events: ' + error);
        }
    }


}
