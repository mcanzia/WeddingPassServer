import { db } from '../configs/firebase';
import { DatabaseError } from '../util/error/CustomError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../configs/types';
import { Pass } from '../models/Pass';

@injectable()
export class PassDao {

    async getAllPasses() {
        try {

            let passes: Array<Pass> = [];

            const passRef = db.ref(`passes`);
            const snapshot = await passRef.once('value');

            if (!snapshot.exists()) {
                throw new Error('No passes found.');
            }

            passes = snapshot.val();

            return passes;
        } catch (error) {
            throw new DatabaseError("Could not retrieve passes from database: " + error);
        }
    }

    async getPassById(passId: string) {
        try {
            const passRef = db.ref(`passes/${passId}`);
            const snapshot = await passRef.once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such pass found with the given id');
            }

            const passData = snapshot.val();
            const pass = { ...passData };

            return pass;
        } catch (error) {
            throw new DatabaseError("Could not retrieve pass from database: " + error);
        }
    }

    async getPassByName(passName: string) {
        try {
            const passRef = db.ref(`passes`);
            const snapshot = await passRef.orderByChild('name').equalTo(passName).once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such pass found with the given name');
            }

            const passData = snapshot.val();
            const pass = { ...passData };

            return pass;
        } catch (error) {
            throw new DatabaseError("Could not retrieve pass from database: " + error);
        }
    }

    async createPass(pass: Pass) {
        try {
            const passRef = db.ref(`passes`);
            const newPassRef = passRef.push();

            pass.id = newPassRef.key!;

            await newPassRef.set(pass);

        } catch (error) {
            throw new DatabaseError("Could not add pass to database: " + error);
        }
    }

    async updatePass(passId: string, updatedPass: Pass) {
        try {
            const passRef = db.ref(`passes`);

            await passRef.child(passId).update(updatedPass);

        } catch (error) {
            throw new DatabaseError("Could not update pass details: " + error);
        }
    }

    async deletePass(passId: string) {
        try {
            const passRef = db.ref(`passes/${passId}`);
            await passRef.remove();

        } catch (error) {
            throw new DatabaseError("Could not delete pass from database: " + error);
        }
    }
}
