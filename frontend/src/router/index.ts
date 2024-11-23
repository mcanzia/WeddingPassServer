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

const routes = [
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
      path: '/',
      name: 'landing',
      component: WeddingList,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
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
      const exemptedRoutes = ['login', 'invite', 'guest-login'];
      if (!isAuthenticated && !exemptedRoutes.includes(String(to.name))) {
         if (isGuest) {
            next({ name: 'guest-login' });
         } else {
            next({ name: 'login' });
         }
      } else if (to.name === 'login' && isAuthenticated) {
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