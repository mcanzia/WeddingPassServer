import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from "pinia";
import { computed } from "vue";
export function useRouterHelper() {

  const { selectedWedding } = storeToRefs(useUserStore());
  const router = useRouter();

  function goToRoute(route: string, params?: Record<string, any>, query?: Record<string, any>) {
    router.push({ name: route, params: params, query: query });
  }

  function goToRouteSecured(route: string, extraParams?: Record<string, any>, query?: Record<string, any>) {
    if (selectedWedding.value) {
      router.push({ name: route, params: { ...extraParams, weddingId: selectedWedding.value.id }, query: query });
    } else {
      router.push({ name: 'weddings' });
    }
  }

  function replaceRouteSecured(route: string, extraParams?: Record<string, any>, query?: Record<string, any>) {
    if (selectedWedding.value) {
      router.replace({ name: route, params: { ...extraParams, weddingId: selectedWedding.value.id }, query: query });
    } else {
      router.push({ name: 'weddings' });
    }
  }

  return {
    goToRoute,
    goToRouteSecured,
    replaceRouteSecured,
  }
}