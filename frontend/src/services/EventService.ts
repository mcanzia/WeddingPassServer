import { EventController } from '@/controllers/EventController';
import { WeddingEvent } from '@/models/WeddingEvent';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class EventService {

    private eventController : EventController;
    private userStore : any;
    private weddingRole : WeddingRole;

    constructor() {
        this.eventController = new EventController();
        this.userStore = useUserStore();
        this.weddingRole = this.userStore.selectedWeddingRole;
    }

    async getAllEvents() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.eventController.getAllEvents(userAccessToken, this.weddingRole);
            const allEvents = response ? response : [];
            return allEvents;
        } catch (error) {
            throw error;
        }
    }

    async getEventById(eventId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const event = await this.eventController.getEventById(userAccessToken, this.weddingRole, eventId);
            return event;
        } catch (error) {
            throw error;
        }
    }

    async addEvent(eventToAdd: WeddingEvent) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.addEvent(userAccessToken, this.weddingRole, eventToAdd);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddEvents(events : Array<WeddingEvent>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const event = await this.eventController.batchAddEvents(userAccessToken, this.weddingRole, events);
            return;   
        } catch (error) {
            throw error;
        }
    }

    async deleteEvent(eventToDelete: WeddingEvent) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.deleteEvent(userAccessToken, this.weddingRole, eventToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteEvents(events : Array<WeddingEvent>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.batchDeleteEvents(userAccessToken, this.weddingRole, events);
            return;
        } catch (error) {
            throw error;
        }
    }
}