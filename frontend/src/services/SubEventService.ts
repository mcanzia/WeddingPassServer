import { SubEventController } from '@/controllers/SubEventController';
import { SubEvent } from '@/models/SubEvent';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class SubEventService {

    private subEventController: SubEventController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.subEventController = new SubEventController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
    }

    async getAllSubEvents() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.subEventController.getAllSubEvents(userAccessToken, this.eventRole);
            const allSubEvents = response ? response : [];
            return allSubEvents;
        } catch (error) {
            throw error;
        }
    }

    async getSubEventById(subEventId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const subEvent = await this.subEventController.getSubEventById(userAccessToken, this.eventRole, subEventId);
            return subEvent;
        } catch (error) {
            throw error;
        }
    }

    async saveSubEvent(subEventToAdd: SubEvent) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.subEventController.saveSubEvent(userAccessToken, this.eventRole, subEventToAdd);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddEvents(subEvents: Array<SubEvent>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.subEventController.batchAddSubEvents(userAccessToken, this.eventRole, subEvents);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteSubEvent(subEventToDelete: SubEvent) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.subEventController.deleteSubEvent(userAccessToken, this.eventRole, subEventToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteSubEvents(subEvents: Array<SubEvent>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.subEventController.batchDeleteSubEvents(userAccessToken, this.eventRole, subEvents);
            return;
        } catch (error) {
            throw error;
        }
    }
}