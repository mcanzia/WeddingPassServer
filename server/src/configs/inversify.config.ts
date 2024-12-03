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
import { UserDao } from '../dao/UserDao';
import { WeddingController } from '../controllers/WeddingController';
import { WeddingDao } from '../dao/WeddingDao';
import { AuthService } from '../services/AuthService';
import { SurveyController } from '../controllers/SurveyController';
import { SurveyDao } from '../dao/SurveyDao';
import { PendingGuestDao } from '../dao/PendingGuestDao';
import { PendingGuestController } from '../controllers/PendingGuestController';

const container = new Container();

container.bind<PassController>(TYPES.PassController).to(PassController);
container.bind<PassDao>(TYPES.PassDao).to(PassDao);
container.bind<GuestController>(TYPES.GuestController).to(GuestController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserDao>(TYPES.UserDao).to(UserDao);
container.bind<GuestService>(TYPES.GuestService).to(GuestService);
container.bind<GuestDao>(TYPES.GuestDao).to(GuestDao);
container.bind<EventController>(TYPES.EventController).to(EventController);
container.bind<EventDao>(TYPES.EventDao).to(EventDao);
container.bind<SurveyController>(TYPES.SurveyController).to(SurveyController);
container.bind<SurveyDao>(TYPES.SurveyDao).to(SurveyDao);
container.bind<WeddingController>(TYPES.WeddingController).to(WeddingController);
container.bind<WeddingDao>(TYPES.WeddingDao).to(WeddingDao);
container.bind<PendingGuestController>(TYPES.PendingGuestController).to(PendingGuestController)
container.bind<PendingGuestDao>(TYPES.PendingGuestDao).to(PendingGuestDao);

export { container };
