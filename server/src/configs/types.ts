import { AuthService } from "../services/AuthService";

export const TYPES = {
    AuthController: Symbol.for("AuthController"),
    AuthService: Symbol.for("AuthService"),
    UserDao: Symbol.for("UserDao"),
    PassController: Symbol.for("PassController"),
    PassDao: Symbol.for("PassDao"),
    GuestController: Symbol.for("GuestController"),
    GuestService: Symbol.for("GuestService"),
    GuestDao: Symbol.for("GuestDao"),
    EventController: Symbol.for("EventController"),
    EventDao: Symbol.for("EventDao"),
    SurveyController: Symbol.for("SurveyController"),
    SurveyDao: Symbol.for("SurveyDao"),
    WeddingController: Symbol.for("WeddingController"),
    WeddingDao: Symbol.for("WeddingDao")
};
