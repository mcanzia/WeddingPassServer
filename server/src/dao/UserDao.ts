// src/dao/GuestDao.ts

import { db } from '../configs/firebase';
import { CustomError, DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot, FieldPath } from 'firebase-admin/firestore';
import validator from 'validator';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { EventRole } from '../models/EventRole';
import { PendingGuest } from '../models/PendingGuest';
import { Guest } from '../models/Guest';
import { Roles } from '../models/Roles';

@injectable()
export class UserDao {

    private usersCollection: CollectionReference<DocumentData>;
    private eventsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.usersCollection = db.collection('users');
        this.eventsCollection = db.collection('events');
    }

    private async fetchEventsByNames(eventNames: string[]): Promise<Map<string, Event>> {
        const fetchedEventsMap: Map<string, Event> = new Map();
        const batchSize = 10;

        for (let i = 0; i < eventNames.length; i += batchSize) {
            const batch = eventNames.slice(i, i + batchSize);
            const snapshot = await this.eventsCollection.where('name', 'in', batch).get();

            snapshot.forEach(doc => {
                const eventData = doc.data() as Event;
                fetchedEventsMap.set(eventData.name, new Event(doc.id, eventData.name, eventData.date, eventData.location, eventData.ownerId));
            });
        }

        return fetchedEventsMap;
    }

    private async fetchEventsByIds(eventIds: string[]): Promise<Map<string, Event>> {
        const fetchedEventsMap: Map<string, Event> = new Map();
        const batchSize = 10;

        if (!eventIds) {
            return fetchedEventsMap;
        }
        for (let i = 0; i < eventIds.length; i += batchSize) {
            const batch = eventIds.slice(i, i + batchSize);
            const snapshot = await this.eventsCollection.where(FieldPath.documentId(), 'in', batch).get();

            snapshot.forEach(doc => {
                const eventData = doc.data() as Event;
                fetchedEventsMap.set(doc.id, new Event(doc.id, eventData.name, eventData.date, eventData.location, eventData.ownerId));
            });
        }

        return fetchedEventsMap;
    }

    private async fetchAllEvents(): Promise<Map<string, Event>> {
        const fetchedEventsMap: Map<string, Event> = new Map();

        const snapshot: QuerySnapshot<DocumentData> = await this.eventsCollection.get();

        if (snapshot.empty) {
            return fetchedEventsMap;
        }

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const eventData = doc.data() as Event;
            eventData.id = doc.id;
            fetchedEventsMap.set(eventData.id, eventData);
        });

        return fetchedEventsMap;
    }

    async getAllUsers(): Promise<Array<User>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.usersCollection.get();

            if (snapshot.empty) {
                return [];
            }

            const users: Array<User> = [];

            const events: Map<string, Event> = await this.fetchAllEvents();

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const userData = doc.data();
                userData.id = doc.id;
                userData.eventRoles = userData.eventRoles.map((eventRole: any) => {
                    const foundEvent = events.get(eventRole.event);
                    if (eventRole && foundEvent) {
                        const userEventRole = new EventRole(eventRole.role, foundEvent, eventRole.guestId);
                        return userEventRole;
                    }
                });
                users.push(userData as User);
            });

            return users;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        try {
            const userDoc = await this.usersCollection.doc(userId).get();

            if (!userDoc.exists) {
                return null;
            }

            const events: Map<string, Event> = await this.fetchAllEvents();

            const userData = userDoc.data();
            if (userData) {
                userData.eventRoles = userData.eventRoles.map((eventRole: any) => {
                    const foundEvent = events.get(eventRole.event);
                    if (eventRole && foundEvent) {
                        const userEventRole = new EventRole(
                            eventRole.role,
                            foundEvent,
                            eventRole.guestId
                        );
                        return userEventRole;
                    }
                    return null;
                }).filter(Boolean);

                userData.id = userDoc.id;
            }

            return userData as User;
        } catch (error) {
            throw new DatabaseError("Could not retrieve user from database: " + error);
        }
    }

    async getUserByPhone(userPhone: string): Promise<User | null> {
        try {
            const querySnapshot = await this.usersCollection
                .where('phone', '==', userPhone)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                return null;
            }

            const userDoc = querySnapshot.docs[0];

            const events: Map<string, Event> = await this.fetchAllEvents();

            const userData = userDoc.data();
            if (userData) {
                userData.eventRoles = userData.eventRoles.map((eventRole: any) => {
                    const foundEvent = events.get(eventRole.event);
                    if (eventRole && foundEvent) {
                        const userEventRole = new EventRole(
                            eventRole.role,
                            foundEvent,
                            eventRole.guestId
                        );
                        return userEventRole;
                    }
                    return null;
                }).filter(Boolean);

                userData.id = userDoc.id;
            }

            return userData as User;
        } catch (error) {
            throw new DatabaseError("Could not retrieve user from database: " + error);
        }
    }

    async getUserByEmail(userEmail: string): Promise<User | null> {
        try {
            const querySnapshot = await this.usersCollection
                .where('email', '==', userEmail)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                return null;
            }

            const userDoc = querySnapshot.docs[0];

            const events: Map<string, Event> = await this.fetchAllEvents();

            const userData = userDoc.data();
            if (userData) {
                userData.eventRoles = userData.eventRoles.map((eventRole: any) => {
                    const foundEvent = events.get(eventRole.event);
                    if (eventRole && foundEvent) {
                        const userEventRole = new EventRole(
                            eventRole.role,
                            foundEvent,
                            eventRole.guestId
                        );
                        return userEventRole;
                    }
                    return null;
                }).filter(Boolean);

                userData.id = userDoc.id;
            }

            return userData as User;
        } catch (error) {
            throw new DatabaseError("Could not retrieve user from database: " + error);
        }
    }

    async createUser(user: User): Promise<void> {
        try {
            const eventIds = Array.from(new Set(user.eventRoles.map(eventRole => eventRole.event.id)));

            const fetchedEventsMap = await this.fetchEventsByIds(eventIds);

            const validatedEventRoles: Array<Object> = [];

            user.eventRoles.forEach(eventRole => {
                const fetchedEvent = fetchedEventsMap.get(eventRole.event.id);
                if (fetchedEvent) {
                    validatedEventRoles.push({ role: eventRole.role, event: fetchedEvent.id, guestId: eventRole.guestId ?? "" });
                }
            });

            if (!user.id) {
                throw new DatabaseError('User ID is required to create a user document.');
            }
            const newUserRef = this.usersCollection.doc(user.id);

            if (user.email) {
                user.email = validator.escape(user.email.trim());
            }

            const newUser = user.toObject ? { ...user.toObject(), eventRoles: validatedEventRoles } : { ...user, eventRoles: validatedEventRoles };

            await newUserRef.set(newUser);
        } catch (error: any) {
            throw new DatabaseError("Could not add user to database: " + error.message);
        }
    }

    async updateUser(userId: string, updatedUser: User): Promise<void> {
        try {
            const userRef = this.usersCollection.doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                throw new Error('User to update does not exist.');
            }

            const updatedData = {
                ...updatedUser,
                email: validator.escape(updatedUser.email?.trim()),
                eventRoles: updatedUser.eventRoles.map(eventRole => { return { role: eventRole.role, event: eventRole.event.id, guestId: eventRole.guestId || null } }),
            };

            await userRef.update(updatedData);

        } catch (error) {
            throw new DatabaseError("Could not update user details: " + error);
        }
    }

    async addUserToEvent(userId: string, newEventRole: EventRole): Promise<void> {
        try {
            if (!userId) {
                throw new Error('Provided User ID is empty');
            }
            const userRef = this.usersCollection.doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                throw new Error('User to update does not exist.');
            }

            const userData = userDoc.data();

            if (!userData) {
                throw new Error('User to update does not exist.');
            }

            const currentEventRoles = userData.eventRoles;
            let filteredEventRoles = currentEventRoles.filter((eventRole: any) => eventRole.event !== newEventRole.event.id);

            filteredEventRoles.push({ role: newEventRole.role, event: newEventRole.event.id, guestId: newEventRole.guestId || null });

            const updatedData = {
                ...userData,
                eventRoles: filteredEventRoles,
            };

            await userRef.update(updatedData);

        } catch (error) {
            throw new DatabaseError("Could not add user to event: " + error);
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            const userRef = this.usersCollection.doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                throw new Error('User to delete does not exist.');
            }

            await userRef.delete();
        } catch (error) {
            throw new DatabaseError("Could not delete user from database: " + error);
        }
    }

    async linkGuestAccount(eventId: string, pendingGuest: PendingGuest, guest: Guest) {
        try {
            const userId = pendingGuest.userId;
            const existingUser: User | null = await this.getUserById(userId);

            if (!existingUser) {
                throw new Error('Can not find existing user account.');
            }

            const newEventRole = {
                role: Roles.GUEST,
                guestId: guest.id,
                event: {
                    id: eventId
                } as Event
            } as EventRole

            const updatedUser = {
                ...existingUser,
                phone: pendingGuest.phone,
                email: pendingGuest.email,
                eventRoles: [...existingUser.eventRoles, newEventRole]
            } as User;

            await this.updateUser(userId, updatedUser);

        } catch (error: any) {
            throw new DatabaseError(error.message);
        }


    }
}
