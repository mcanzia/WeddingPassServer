import { createRouter, createWebHistory } from "vue-router";
import GuestList from "@/components/guest-list/GuestList.vue";
import AddGuest from "@/components/guest-list/AddGuest.vue";
import AddWedding from "@/components/weddings/AddWedding.vue";
import EditWedding from "@/components/weddings/EditWedding.vue";
import EditGuest from "@/components/guest-list/EditGuest.vue";
import InviteUser from "@/components/InviteUser.vue";
import Home from "@/components/Home.vue";
import EventAttendance from "@/components/events/EventAttendance.vue";
import GuestUpload from "@/components/guest-list/GuestUpload.vue";
import WeddingList from "@/components/weddings/WeddingList.vue";
import { Roles } from "@/models/Roles";
import { useUserStore } from "@/stores/UserStore";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import { auth } from "@/firebase";
import Login from "@/components/Login.vue";
import { storeToRefs } from "pinia";
import InvitePage from "@/components/InvitePage.vue";
import SurveyBuilder from "@/components/surveys/SurveyBuilder.vue";

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
      component: SurveyBuilder,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/:weddingId/',
      name: 'home',
      component: Home,
   },
   {
      path: '/login',
      name: 'login',
      component: Login,
   },
   {
      path: '/invite',
      name: 'invite',
      component: InvitePage,
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
      // let userRole = userStore.localUser?.weddingRoles;
      if(to.name !== 'login' && to.name !== 'invite' && !isAuthenticated) {
         next({ name: 'login'});
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