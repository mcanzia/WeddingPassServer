import { createRouter, createWebHistory } from "vue-router";
import GuestList from "@/components/guest-list/GuestList.vue";
import AddGuest from "@/components/guest-list/AddGuest.vue";
import AddEvent from "@/components/events/AddEvent.vue";
import EditEvent from "@/components/events/EditEvent.vue";
import InviteUser from "@/components/InviteUser.vue";
import SubEventAttendance from "@/components/subevents/SubEventAttendance.vue";
import GuestUpload from "@/components/guest-list/GuestUpload.vue";
import EventList from "@/components/events/EventList.vue";
import { Roles } from "@/models/Roles";
import { useUserStore } from "@/stores/UserStore";
import Login from "@/components/Login.vue";
import { storeToRefs } from "pinia";
import InvitePage from "@/components/InvitePage.vue";
import SurveyBuilder from "@/components/surveys/SurveyBuilder.vue";
import SurveyList from "@/components/surveys/SurveyList.vue";
import HomeRouter from "@/components/HomeRouter.vue";
import GuestLogin from "@/components/guests/GuestLogin.vue";
import VerifyGuest from "@/components/guests/VerifyGuest.vue";
import GuestSurvey from "@/components/surveys/GuestSurvey.vue";
import SurveyAdmin from "@/components/surveys/SurveyAdmin.vue";
import AssignedSurveys from "@/components/surveys/AssignedSurveys.vue";
import SurveyResponder from "@/components/surveys/SurveyResponder.vue";
import QAndA from "@/components/guests/QAndA.vue";
import ThingsToDo from "@/components/guests/ThingsToDo.vue";
import PendingGuests from "@/components/pending-guests/PendingGuests.vue";
import LoginDirect from "@/components/LoginDirect.vue";
import GuestInfo from "@/components/guests/GuestInfo.vue";
import AccommodationList from "@/components/accommodations/AccommodationList.vue";
import UpdateAccommodation from "@/components/accommodations/UpdateAccommodation.vue";
import GuestEvents from "@/components/guests/GuestEvents.vue";
import BarcodeHandler from "@/components/barcodes/BarcodeHandler.vue";
import SurveyResponseTracking from "@/components/surveys/SurveyResponseTracking.vue";
import DrinkTracker from "@/components/drinks/DrinkTracker.vue";
import SubEventList from "@/components/subevents/SubEventList.vue";
import UpdateSubEvent from "@/components/subevents/UpdateSubEvent.vue";

const routes = [
   {
      path: '/',
      name: 'landing',
      component: EventList,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/guests',
      name: 'guests',
      component: GuestList,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/:eventId/guests-upload',
      name: 'guests-upload',
      component: GuestUpload,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN]
      }
   },
   {
      path: '/:eventId/barcode',
      name: 'barcode',
      component: BarcodeHandler,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN]
      }
   },
   {
      path: '/:eventId/update-guest/:guestId?',
      name: 'update-guest',
      component: AddGuest,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.TRIO]
      }
   },
   {
      path: '/:eventId/invite-user',
      name: 'invite-user',
      component: InviteUser,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN]
      }
   },
   {
      path: '/events',
      name: 'events',
      component: EventList,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/add-event',
      name: 'add-event',
      component: AddEvent,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/edit-event/:eventId',
      name: 'edit-event',
      component: EditEvent,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/sub-event-attendance',
      name: 'sub-event-attendance',
      component: SubEventAttendance,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY, Roles.TRIO]
      }
   },
   {
      path: '/:eventId/drinks',
      name: 'drinks',
      component: DrinkTracker,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY, Roles.TRIO]
      }
   },
   {
      path: '/:eventId/surveys',
      name: 'surveys',
      component: SurveyAdmin,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/:surveyId',
      name: 'edit-survey',
      component: SurveyBuilder,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/:surveyId/tracker',
      name: 'survey-tracker',
      component: SurveyResponseTracking,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/accommodations',
      name: 'accommodations',
      component: AccommodationList,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/:eventId/edit-accommodation/:accommodationId?',
      name: 'edit-accommodation',
      component: UpdateAccommodation,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/sub-events',
      name: 'sub-events',
      component: SubEventList,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/:eventId/edit-sub-event/:subEventId?',
      name: 'edit-sub-event',
      component: UpdateSubEvent,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:eventId/',
      name: 'home',
      component: HomeRouter,
   },
   {
      path: '/login-router',
      name: 'login-router',
      component: LoginDirect,
   },
   {
      path: '/login',
      name: 'login',
      component: Login,
   },
   {
      path: '/guest-login',
      name: 'guest-login',
      component: GuestLogin,
   },
   {
      path: '/verify-guest',
      name: 'verify-guest',
      component: VerifyGuest,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/invite',
      name: 'invite',
      component: InvitePage,
   },
   {
      path: '/:eventId/guest-details',
      name: 'guest-details',
      component: GuestInfo,
   },
   {
      path: '/:eventId/guest-events',
      name: 'guest-events',
      component: GuestEvents,
   },
   {
      path: '/:eventId/guest-surveys',
      name: 'guest-surveys',
      component: AssignedSurveys,
   },
   {
      path: '/:eventId/:surveyId/survey-response/:surveyResponseId',
      name: 'survey-response',
      component: SurveyResponder,
      props: true,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/:eventId/q-and-a',
      name: 'q-and-a',
      component: QAndA,
      props: true,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/:eventId/things-to-do',
      name: 'things-to-do',
      component: ThingsToDo,
      props: true,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/:eventId/pending-guests',
      name: 'pending-guests',
      component: PendingGuests,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   }

]

const router = createRouter({
   history: createWebHistory(),
   routes
});


router.beforeEach((to, from, next) => {
   const userStore = useUserStore();
   const { isAuthReady, user } = storeToRefs(userStore);

   if (!isAuthReady.value) {
      const unsubscribe = userStore.$subscribe((mutation, state) => {
         if (state.isAuthReady) {
            unsubscribe();
            proceedWithNavigation();
         }
      });
   } else {
      proceedWithNavigation();
   }

   function proceedWithNavigation() {
      const isAuthenticated = !!user.value;
      const isGuest = localStorage.getItem('guest');
      // let userRole = userStore.localUser?.eventRoles;
      const exemptedRoutes = ['login', 'invite', 'guest-login', 'login-router'];
      if (!isAuthenticated && !exemptedRoutes.includes(String(to.name))) {
         if (isGuest) {
            next({ name: 'guest-login' });
         } else {
            next({ name: 'login-router' });
         }
      } else if (to.name && to.name in exemptedRoutes && isAuthenticated) {
         next({ name: 'landing' });
      } else {
         next();
      }

      //    const requiresAuth = to.matched.some((record) => record.meta.allowedRoles);

      //    if (requiresAuth) {
      //       if (!user) {
      //          next("/");
      //       } else {
      //          const allowedRoles = to.matched.flatMap((record) => record.meta.allowedRoles || []);
      //          const hasAccess = allowedRoles.includes(userRole);

      //          if (hasAccess) {
      //             next();
      //          } else {
      //             ErrorHandler.handleAuthorizationError();
      //             next("/");
      //          }
      //       }
      //    } else {
      //       next();
      //    }
      // }
   }
});

export default router