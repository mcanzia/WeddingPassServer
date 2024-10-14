import { createRouter, createWebHistory } from "vue-router";
import GuestList from "@/components/GuestList.vue";
import AddGuest from "@/components/AddGuest.vue";
import EditGuest from "@/components/EditGuest.vue";
import Landing from "@/components/Landing.vue";
import EventAttendance from "@/components/events/EventAttendance.vue";

const routes = [
    { 
      path: '/guests',
      name: 'guests',
      component: GuestList,
      meta: {
         requiresAuth: true
      }
   },
   { 
      path: '/add-guest',
      name: 'add-guest',
      component: AddGuest,
      meta: {
         requiresAuth: true
      }
   },
   { 
      path: '/edit-guest/:guestId',
      name: 'edit-guest',
      component: EditGuest,
      props: true,
      meta: {
          requiresAuth: true
      }
  },
   { 
      path: '/event-attendance',
      name: 'event-attendance',
      component: EventAttendance,
      meta: {
         requiresAuth: true
      }
   },
   { 
      path: '/',
      name: 'landing',
      component: Landing,
      meta: {
         requiresAuth: true
      }
   }

]

const router = createRouter({
   history: createWebHistory(),
   routes
 });


// router.beforeEach((to, from, next) => {
//    const currentUser = auth.currentUser;
//    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

//    if (requiresAuth && !currentUser) next('login');
//    else if (!requiresAuth && currentUser) next ('home');
//    else next();
// });

export default router