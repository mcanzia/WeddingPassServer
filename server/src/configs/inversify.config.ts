import 'reflect-metadata';
import { Container } from 'inversify';
import { PassController } from '../controllers/PassController';
import { TYPES } from './types';
import { PassDao } from '../dao/PassDao';
import { GuestController } from '../controllers/GuestController';
import { GuestDao } from '../dao/GuestDao';
import { GuestService } from '../services/GuestService';
import { SubEventController } from '../controllers/SubEventController';
import { SubEventDao } from '../dao/SubEventDao';
import { AuthController } from '../controllers/AuthController';
import { UserDao } from '../dao/UserDao';
import { EventDao } from '../dao/EventDao';
import { AuthService } from '../services/AuthService';
import { SurveyController } from '../controllers/SurveyController';
import { SurveyService } from '../services/SurveyService';
import { SurveyDao } from '../dao/SurveyDao';
import { PendingGuestDao } from '../dao/PendingGuestDao';
import { PendingGuestController } from '../controllers/PendingGuestController';
import { AccommodationDao } from '../dao/AccommodationDao';
import { InviteDao } from '../dao/InviteDao';
import { EventController } from '../controllers/EventController';
import { AccommodationController } from '../controllers/AccommodationController';

const container = new Container();

container.bind<PassController>(TYPES.PassController).to(PassController);
container.bind<PassDao>(TYPES.PassDao).to(PassDao);
container.bind<GuestController>(TYPES.GuestController).to(GuestController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserDao>(TYPES.UserDao).to(UserDao);
container.bind<GuestService>(TYPES.GuestService).to(GuestService);
container.bind<GuestDao>(TYPES.GuestDao).to(GuestDao);
container.bind<SubEventController>(TYPES.SubEventController).to(SubEventController);
container.bind<SubEventDao>(TYPES.SubEventDao).to(SubEventDao);
container.bind<SurveyController>(TYPES.SurveyController).to(SurveyController);
container.bind<SurveyService>(TYPES.SurveyService).to(SurveyService);
container.bind<SurveyDao>(TYPES.SurveyDao).to(SurveyDao);
container.bind<EventController>(TYPES.EventController).to(EventController);
container.bind<EventDao>(TYPES.EventDao).to(EventDao);
container.bind<PendingGuestController>(TYPES.PendingGuestController).to(PendingGuestController);
container.bind<PendingGuestDao>(TYPES.PendingGuestDao).to(PendingGuestDao);
container.bind<AccommodationController>(TYPES.AccommodationController).to(AccommodationController);
container.bind<AccommodationDao>(TYPES.AccommodationDao).to(AccommodationDao);
container.bind<InviteDao>(TYPES.InviteDao).to(InviteDao);


export { container };
