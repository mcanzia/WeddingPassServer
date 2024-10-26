import { createRouter, createWebHistory } from "vue-router";
import GuestList from "@/components/guest-list/GuestList.vue";
import AddGuest from "@/components/guest-list/AddGuest.vue";
import AddWedding from "@/components/weddings/AddWedding.vue";
import EditWedding from "@/components/weddings/EditWedding.vue";
import EditGuest from "@/components/guest-list/EditGuest.vue";
import Home from "@/components/Home.vue";
import EventAttendance from "@/components/events/EventAttendance.vue";
import GuestUpload from "@/components/guest-list/GuestUpload.vue";
import WeddingList from "@/components/weddings/WeddingList.vue";
import { Roles } from "@/models/Roles";
import { useUserStore } from "@/stores/UserStore";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import { auth } from "@/firebase";

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
      path: '/:weddingId/',
      name: 'home',
      component: Home,
   }

]

const router = createRouter({
   history: createWebHistory(),
   routes
});


// router.beforeEach((to, from, next) => {
//    const userStore = useUserStore();
 
//    if (!userStore.isAuthReady) {
//      const unsubscribe = userStore.$subscribe((mutation, state) => {
//        if (state.isAuthReady) {
//          unsubscribe();
//          proceedWithNavigation();
//        }
//      });
//    } else {
//      proceedWithNavigation();
//    }
 
//    function proceedWithNavigation() {
//      const { user } = userStore;
//      let userRole = userStore.localUser.user;
 
//      const requiresAuth = to.matched.some((record) => record.meta.allowedRoles);
 
//      if (requiresAuth) {
//        if (!user) {
//          next("/");
//        } else {
//          const allowedRoles = to.matched.flatMap((record) => record.meta.allowedRoles || []);
//          const hasAccess = allowedRoles.includes(userRole);
 
//          if (hasAccess) {
//            next();
//          } else {
//            ErrorHandler.handleAuthorizationError();
//            next("/");
//          }
//        }
//      } else {
//        next();
//      }
//    }
//  });

export default router