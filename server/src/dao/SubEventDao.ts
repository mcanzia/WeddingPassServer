import { db } from '../configs/firebase';
import { DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { SubEvent } from '../models/SubEvent';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';

@injectable()
export class SubEventDao {

    private subEventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.subEventsCollection = db.collection('subevents');
    }

    async getAllSubEvents(eventId: string): Promise<Array<SubEvent>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.subEventsCollection
                .where('eventId', '==', eventId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            const subEvents: Array<SubEvent> = [];

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const subEventData = doc.data() as SubEvent;
                subEventData.id = doc.id;
                subEvents.push(subEventData);
            });

            return subEvents;
        } catch (error) {
            throw new DatabaseError("Could not retrieve subevents from database: " + error);
        }
    }

    async getSubEventById(eventId: string, subEventId: string): Promise<SubEvent> {
        try {
            const snapshot = await this.subEventsCollection
                .where('__name__', '==', subEventId)
                .where('eventId', '==', eventId)
                .get();

            if (snapshot.empty) {
                throw new Error('No such subevent found with the given id and eventId');
            }

            const subEventDoc = snapshot.docs[0];

            const subEventData = subEventDoc.data() as SubEvent;
            subEventData.id = subEventDoc.id;

            return subEventData;
        } catch (error) {
            throw new DatabaseError("Could not retrieve subevent from database: " + error);
        }
    }

    async getSubEventByName(eventId: string, subEventName: string): Promise<SubEvent> {
        try {
            const querySnapshot: QuerySnapshot<DocumentData> = await this.subEventsCollection
                .where('name', '==', subEventName)
                .where('eventId', '==', eventId)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error('No such sub event found with the given name');
            }

            const subEvents: Array<SubEvent> = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const subEventData = doc.data() as SubEvent;
                subEventData.id = doc.id;
                subEvents.push(subEventData);
            });

            return subEvents[0];
        } catch (error) {
            throw new DatabaseError("Could not retrieve subevent from database: " + error);
        }
    }

    async createSubEvent(eventId: string, subEvent: SubEvent): Promise<void> {
        try {
            const newSubEventRef = this.subEventsCollection.doc();
            subEvent.id = newSubEventRef.id;
            subEvent.eventId = eventId;
            await newSubEventRef.set(subEvent);
        } catch (error) {
            throw new DatabaseError("Could not add subEvent to database: " + error);
        }
    }

    async batchCreateSubEvents(eventId: string, subEvents: SubEvent[]): Promise<void> {
        try {
            const batchSize = 500;
            for (let i = 0; i < subEvents.length; i += batchSize) {
                const batch = db.batch();
                const batchSubEvents = subEvents.slice(i, i + batchSize);

                batchSubEvents.forEach(subEvent => {
                    const newSubEventRef = this.subEventsCollection.doc();
                    subEvent.id = newSubEventRef.id;
                    subEvent.eventId = eventId;
                    batch.set(newSubEventRef, subEvent);
                });

                await batch.commit();
            }
        } catch (error) {
            throw new DatabaseError("Could not batch add subEvents to database: " + error);
        }
    }


    async updateSubEvent(eventId: string, subEventId: string, updatedSubEvent: SubEvent): Promise<void> {
        try {
            const subEventRef = this.subEventsCollection.doc(subEventId);
            const subEventDoc = await subEventRef.get();

            if (!subEventDoc.exists) {
                throw new Error('Event to update does not exist.');
            }

            const subEventData = subEventDoc.data();
            if (!subEventData) {
                throw new Error('SubEvent data is undefined.');
            }

            if (subEventData.eventId !== eventId) {
                throw new Error('SubEvent does not belong to the specified event.');
            }

            const { id, ...data } = updatedSubEvent;

            await subEventRef.update(data);
        } catch (error) {
            throw new DatabaseError("Could not update subevent details: " + error);
        }
    }

    async deleteSubEvent(eventId: string, subEventId: string): Promise<void> {
        try {
            const subEventRef = this.subEventsCollection.doc(subEventId);
            const subEventDoc = await subEventRef.get();

            if (!subEventDoc.exists) {
                throw new Error('SubEvent to delete does not exist.');
            }

            const subEventData = subEventDoc.data();
            if (!subEventData) {
                throw new Error('SubEvent data is undefined.');
            }

            if (subEventData.eventId !== eventId) {
                throw new Error('SubEvent does not belong to the specified event.');
            }

            await subEventRef.delete();
        } catch (error) {
            throw new DatabaseError('Could not delete subevent from database: ' + error);
        }
    }


    async batchDeleteSubEvents(eventId: string, subEvents: SubEvent[]): Promise<void> {
        try {
            const batchSize = 500;
            const getAllLimit = 100;

            for (let i = 0; i < subEvents.length; i += batchSize) {
                const batch = db.batch();
                const batchSubEvents = subEvents.slice(i, i + batchSize);

                const subEventRefs = batchSubEvents.map((subEvent, index) => {
                    if (!subEvent.id) {
                        throw new Error(`SubEvent at index ${i + index} does not have an id.`);
                    }
                    return this.subEventsCollection.doc(subEvent.id);
                });

                for (let j = 0; j < subEventRefs.length; j += getAllLimit) {
                    const subEventRefsChunk = subEventRefs.slice(j, j + getAllLimit);

                    const docs = await db.getAll(...subEventRefsChunk);

                    docs.forEach(docSnapshot => {
                        if (!docSnapshot.exists) {
                            return;
                        }

                        const subEventData = docSnapshot.data();
                        if (subEventData && subEventData.eventId === eventId) {
                            batch.delete(docSnapshot.ref);
                        }
                    });
                }

                await batch.commit();
            }
        } catch (error: any) {
            throw new DatabaseError('Could not batch delete subEvents: ' + error);
        }
    }


}
