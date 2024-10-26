// src/dao/GuestDao.ts

import { db } from '../configs/firebase';
import { CustomError, DatabaseError, NoDataError } from '../util/error/CustomError';
import { injectable } from 'inversify';
import { CollectionReference, DocumentData, QuerySnapshot, QueryDocumentSnapshot, FieldPath } from 'firebase-admin/firestore';
import validator from 'validator';
import { Wedding } from '../models/Wedding';
import { User } from '../models/User';
import { WeddingRole } from '../models/WeddingRole';

@injectable()
export class UserDao {

    private usersCollection: CollectionReference<DocumentData>;
    private weddingsCollection: CollectionReference<DocumentData>;

    constructor() {
        this.usersCollection = db.collection('users');
        this.weddingsCollection = db.collection('weddings');
    }

    private async fetchWeddingsByNames(weddingNames: string[]): Promise<Map<string, Wedding>> {
        const fetchedWeddingsMap: Map<string, Wedding> = new Map();
        const batchSize = 10;

        for (let i = 0; i < weddingNames.length; i += batchSize) {
            const batch = weddingNames.slice(i, i + batchSize);
            const snapshot = await this.weddingsCollection.where('name', 'in', batch).get();

            snapshot.forEach(doc => {
                const weddingData = doc.data() as Wedding;
                fetchedWeddingsMap.set(weddingData.name, new Wedding(doc.id, weddingData.name, weddingData.date, weddingData.location, weddingData.ownerId));
            });
        }

        return fetchedWeddingsMap;
    }

    private async fetchWeddingsByIds(weddingIds: string[]): Promise<Map<string, Wedding>> {
        const fetchedWeddingsMap: Map<string, Wedding> = new Map();
        const batchSize = 10;

        for (let i = 0; i < weddingIds.length; i += batchSize) {
            const batch = weddingIds.slice(i, i + batchSize);
            const snapshot = await this.weddingsCollection.where(FieldPath.documentId(), 'in', batch).get();

            snapshot.forEach(doc => {
                const weddingData = doc.data() as Wedding;
                fetchedWeddingsMap.set(doc.id, new Wedding(doc.id, weddingData.name, weddingData.date, weddingData.location, weddingData.ownerId));
            });
        }

        return fetchedWeddingsMap;
    }

    private async fetchAllWeddings(): Promise<Map<string, Wedding>> {
        const fetchedWeddingsMap: Map<string, Wedding> = new Map();

        const snapshot: QuerySnapshot<DocumentData> = await this.weddingsCollection.get();

        if (snapshot.empty) {
            return fetchedWeddingsMap;
        }

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const weddingData = doc.data() as Wedding;
            weddingData.id = doc.id;
            fetchedWeddingsMap.set(weddingData.id, weddingData);
        });

        return fetchedWeddingsMap;
    }

    async getAllUsers(): Promise<Array<User>> {
        try {
            const snapshot: QuerySnapshot<DocumentData> = await this.usersCollection.get();

            if (snapshot.empty) {
                return [];
            }

            const users: Array<User> = [];

            const weddings: Map<string, Wedding> = await this.fetchAllWeddings();

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const userData = doc.data();
                userData.id = doc.id;
                userData.weddingRoles = userData.weddingRoles.map((weddingRole: any) => {
                    const foundWedding = weddings.get(weddingRole.wedding);
                    if (weddingRole && foundWedding) {
                        const userWeddingRole = new WeddingRole(weddingRole.role, foundWedding);
                        return userWeddingRole;
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

            const weddings: Map<string, Wedding> = await this.fetchAllWeddings();

            const userData = userDoc.data();
            if (userData) {
                userData.weddingRoles = userData.weddingRoles.map((weddingRole: any) => {
                    const foundWedding = weddings.get(weddingRole.wedding);
                    if (weddingRole && foundWedding) {
                        const userWeddingRole = new WeddingRole(weddingRole.role, foundWedding);
                        return userWeddingRole;
                    }
                });
                userData.id = userDoc.id;
            }

            return userData as User;
        } catch (error) {
            throw new DatabaseError("Could not retrieve user from database: " + error);
        }
    }

    async createUser(user: User): Promise<void> {
        try {
            const weddingIds = Array.from(new Set(user.weddingRoles.map(weddingRole => weddingRole.wedding.id)));

            const fetchedWeddingsMap = await this.fetchWeddingsByIds(weddingIds);

            const validatedWeddingRoles : Array<Object> = [];

            user.weddingRoles.forEach(weddingRole => {
                const fetchedWedding = fetchedWeddingsMap.get(weddingRole.wedding.id);
                if (fetchedWedding) {
                    validatedWeddingRoles.push({ role: weddingRole.role, wedding: fetchedWedding.id });
                }
            });

            if (!user.id) {
                throw new DatabaseError('User ID is required to create a user document.');
            }
            const newUserRef = this.usersCollection.doc(user.id);

            user.email = validator.escape(user.email.trim());

            const newUser = user.toObject ? { ...user.toObject(), weddingRoles: validatedWeddingRoles } : { ...user, weddingRoles: validatedWeddingRoles };

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
                email: validator.escape(updatedUser.email.trim()),
                weddingRoles: updatedUser.weddingRoles.map(weddingRole => { return { role: weddingRole.role, wedding: weddingRole.wedding.id } }),
            };

            await userRef.update(updatedData);

        } catch (error) {
            throw new DatabaseError("Could not update user details: " + error);
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
}
