import { AuthController } from '@/controllers/AuthController';
import { EventController } from '@/controllers/EventController';
import { Event } from '@/models/Event';
import { EventRole } from '@/models/EventRole';
import { Roles } from '@/models/Roles';
import { useUserStore } from '@/stores/UserStore';

export class EventService {

    private eventController: EventController;
    private userController: AuthController;
    private userStore: any;

    constructor() {
        this.eventController = new EventController();
        this.userController = new AuthController();
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

    async getEventsByOwner(ownerId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.eventController.getEventsByOwner(userAccessToken, ownerId);
            const events = response ? response : [];
            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventById(eventId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const event = await this.eventController.getEventById(userAccessToken, eventId);
            return event;
        } catch (error) {
            throw error;
        }
    }

    async saveEvent(eventToAdd: Event) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const createdEvent = await this.eventController.saveEvent(userAccessToken, eventToAdd);
            const adminRole = new EventRole(Roles.ADMIN, createdEvent);
            await this.userStore.updateUserDetails(adminRole);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddEvents(events: Array<Event>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const event = await this.eventController.batchAddEvents(userAccessToken, events);
            return;
        } catch (error) {
            throw error;
        }
    }

    // async updateEvent(event: Event) {
    //     try {
    //         const userAccessToken = await this.userStore.getAccessToken();
    //         await this.eventController.updateEvent(userAccessToken, event);
    //         return;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async deleteEvent(eventToDelete: Event) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.deleteEvent(userAccessToken, eventToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteEvents(events: Array<Event>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.eventController.batchDeleteEvents(userAccessToken, events);
            return;
        } catch (error) {
            throw error;
        }
    }
}