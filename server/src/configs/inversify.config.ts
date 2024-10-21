import 'reflect-metadata';
import { Container } from 'inversify';
import { PassController } from '../controllers/PassController';
import { TYPES } from './types';
import { PassDao } from '../dao/PassDao';
import { GuestController } from '../controllers/GuestController';
import { GuestDao } from '../dao/GuestDao';
import { GuestService } from '../services/GuestService';
import { EventController } from '../controllers/EventController';
import { EventDao } from '../dao/EventDao';
import { AuthController } from '../controllers/AuthController';

const container = new Container();

container.bind<PassController>(TYPES.PassController).to(PassController);
container.bind<PassDao>(TYPES.PassDao).to(PassDao);
container.bind<GuestController>(TYPES.GuestController).to(GuestController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<GuestService>(TYPES.GuestService).to(GuestService);
container.bind<GuestDao>(TYPES.GuestDao).to(GuestDao);
container.bind<EventController>(TYPES.EventController).to(EventController);
container.bind<EventDao>(TYPES.EventDao).to(EventDao);

export { container };
