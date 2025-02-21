import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from "pinia";
import { computed } from "vue";
export function useRouterHelper() {

  const { selectedEvent } = storeToRefs(useUserStore());
  const router = useRouter();

  function goToRoute(route: string, params?: Record<string, any>, query?: Record<string, any>) {
    router.push({ name: route, params: params, query: query });
  }

  function replaceRoute(route: string, params?: Record<string, any>, query?: Record<string, any>) {
    router.replace({ name: route, params: params, query: query });
  }

  function goToRouteSecured(route: string, extraParams?: Record<string, any>, query?: Record<string, any>) {
    if (selectedEvent.value) {
      router.push({ name: route, params: { ...extraParams, eventId: selectedEvent.value.id }, query: query });
    } else {
      router.push({ name: 'events' });
    }
  }

  function replaceRouteSecured(route: string, extraParams?: Record<string, any>, query?: Record<string, any>) {
    if (selectedEvent.value) {
      router.replace({ name: route, params: { ...extraParams, eventId: selectedEvent.value.id }, query: query });
    } else {
      router.push({ name: 'events' });
    }
  }

  return {
    goToRoute,
    replaceRoute,
    goToRouteSecured,
    replaceRouteSecured,
  }
}