import { EventController } from '@/controllers/EventController';
import { WeddingEvent } from '@/models/WeddingEvent';
import { useUserStore } from '@/stores/UserStore';

export class EventService {

    private eventController : EventController;
    private userStore : any;

    constructor() {
        this.eventController = new EventController();
        this.userStore = useUserStore();
    }

    async getAllEvents() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.eventController.getAllEvents(userAccessToken);
            const allEvents = response ? response : [];
            return allEvents;
        } catch (error) {
            throw error;
        }
    }

    async getEventById(eventId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const event = await this.eventController.getEventById(userAccessToken, eventId);
            return event;
        } catch (error) {
            throw error;
        }
    }

    async addEvent(eventToAdd: WeddingEvent) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.addEvent(userAccessToken, eventToAdd);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddEvents(events : Array<WeddingEvent>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const event = await this.eventController.batchAddEvents(userAccessToken, events);
            return;   
        } catch (error) {
            throw error;
        }
    }

    async deleteEvent(eventToDelete: WeddingEvent) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.deleteEvent(userAccessToken, eventToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteEvents(events : Array<WeddingEvent>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.batchDeleteEvents(userAccessToken, events);
            return;
        } catch (error) {
            throw error;
        }
    }
}