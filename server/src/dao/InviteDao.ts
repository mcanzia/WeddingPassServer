import { CollectionReference, DocumentData, Timestamp } from "firebase-admin/firestore";
import { injectable } from "inversify";
import { db } from "../configs/firebase";
import { InviteToken } from "../models/InviteToken";

@injectable()
export class InviteDao {

    private invitesCollection: CollectionReference<DocumentData>;

    constructor() {
        this.invitesCollection = db.collection('invites');
    }

    async createInvite(inviteToken: InviteToken): Promise<void> {
        const inviteRef = this.invitesCollection.doc(inviteToken.token);
        await inviteRef.set({
            eventRole: inviteToken.eventRole,
            createdAt: Timestamp.now(),
        });
    }

    async getInvite(token: string): Promise<InviteToken | null> {
        const inviteRef = this.invitesCollection.doc(token);
        const doc = await inviteRef.get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        if (data) {
            return new InviteToken(token, data.eventRole);
        }

        return null;
    }

    async deleteInvite(token: string): Promise<void> {
        const inviteRef = this.invitesCollection.doc(token);
        await inviteRef.delete();
    }
}