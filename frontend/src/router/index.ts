import { createRouter, createWebHistory } from "vue-router";
import GuestList from "@/components/guest-list/GuestList.vue";
import AddGuest from "@/components/guest-list/AddGuest.vue";
import EditGuest from "@/components/guest-list/EditGuest.vue";
import Landing from "@/components/Landing.vue";
import EventAttendance from "@/components/events/EventAttendance.vue";
import GuestUpload from "@/components/guest-list/GuestUpload.vue";
import { Roles } from "@/models/Roles";
import { useUserStore } from "@/stores/UserStore";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import { auth } from "@/firebase";

const routes = [
   {
      path: '/guests',
      name: 'guests',
      component: GuestList,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/guests-upload',
      name: 'guests-upload',
      component: GuestUpload,
      meta: {
         allowedRoles: [Roles.ADMIN]
      }
   },
   {
      path: '/add-guest',
      name: 'add-guest',
      component: AddGuest,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/edit-guest/:guestId',
      name: 'edit-guest',
      component: EditGuest,
      props: true,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR]
      }
   },
   {
      path: '/event-attendance',
      name: 'event-attendance',
      component: EventAttendance,
      meta: {
         allowedRoles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY]
      }
   },
   {
      path: '/',
      name: 'landing',
      component: Landing,
   }

]

const router = createRouter({
   history: createWebHistory(),
   routes
});


router.beforeEach((to, from, next) => {
   const userStore = useUserStore();
 
   if (!userStore.isAuthReady) {
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
     const { user } = userStore;
     let userRole = userStore.userRole;
 
     const requiresAuth = to.matched.some((record) => record.meta.allowedRoles);
 
     if (requiresAuth) {
       if (!user) {
         next("/");
       } else {
         const allowedRoles = to.matched.flatMap((record) => record.meta.allowedRoles || []);
         const hasAccess = allowedRoles.includes(userRole);
 
         if (hasAccess) {
           next();
         } else {
           ErrorHandler.handleAuthorizationError();
           next("/");
         }
       }
     } else {
       next();
     }
   }
 });

export default router