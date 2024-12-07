import { createRouter, createWebHistory } from "vue-router";
import GuestList from "@/components/guest-list/GuestList.vue";
import AddGuest from "@/components/guest-list/AddGuest.vue";
import AddWedding from "@/components/weddings/AddWedding.vue";
import EditWedding from "@/components/weddings/EditWedding.vue";
import EditGuest from "@/components/guest-list/EditGuest.vue";
import InviteUser from "@/components/InviteUser.vue";
import EventAttendance from "@/components/events/EventAttendance.vue";
import GuestUpload from "@/components/guest-list/GuestUpload.vue";
import WeddingList from "@/components/weddings/WeddingList.vue";
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

const routes = [
   {
      path: '/',
      name: 'landing',
      component: WeddingList,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/guests',
      name: 'guests',
      component: GuestList,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/:weddingId/guests-upload',
      name: 'guests-upload',
      component: GuestUpload,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN]
      }
   },
   {
      path: '/:weddingId/add-guest',
      name: 'add-guest',
      component: AddGuest,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/edit-guest/:guestId',
      name: 'edit-guest',
      component: EditGuest,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/invite-user',
      name: 'invite-user',
      component: InviteUser,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN]
      }
   },
   {
      path: '/weddings',
      name: 'weddings',
      component: WeddingList,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/add-wedding',
      name: 'add-wedding',
      component: AddWedding,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/edit-wedding/:weddingId',
      name: 'edit-wedding',
      component: EditWedding,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/event-attendance',
      name: 'event-attendance',
      component: EventAttendance,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/:weddingId/surveys',
      name: 'surveys',
      component: SurveyAdmin,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/:surveyId',
      name: 'edit-survey',
      component: SurveyBuilder,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/',
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
      path: '/:weddingId/guest-surveys',
      name: 'guest-surveys',
      component: AssignedSurveys,
   },
   {
      path: '/:weddingId/:surveyId/survey-response/:surveyResponseId',
      name: 'survey-response',
      component: SurveyResponder,
      props: true,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/:weddingId/q-and-a',
      name: 'q-and-a',
      component: QAndA,
      props: true,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/:weddingId/things-to-do',
      name: 'things-to-do',
      component: ThingsToDo,
      props: true,
      meta: {
         allowedRoles: [Roles.GUEST]
      }
   },
   {
      path: '/:weddingId/pending-guests',
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
      // let userRole = userStore.localUser?.weddingRoles;
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