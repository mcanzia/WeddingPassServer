<template>
  <div class="mx-4 mt-4">
    <div class="inline-flex gap-4">
      <Search
        class="mb-4"
        placeholder="Search for wedding..."
        v-model="searchQuery"
      />
      <Button @click="goToAddWedding">Create Wedding</Button>
    </div>
    <div v-if="allWeddingRoles.length">
      <WeddingCard
        class="cursor-pointer"
        v-for="weddingRole in filteredWeddingRoles"
        :wedding-role="weddingRole"
        :key="weddingRole.wedding.id"
        @click="selectWedding(weddingRole)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import WeddingCard from "@/components/weddings/WeddingCard.vue";
import { Button } from "@/components/ui/button";
import { Wedding } from "@/models/Wedding";
import Search from "@/components/Search.vue";
import { ref, onMounted, watch, computed } from "vue";
import debounce from "lodash/debounce";
import { useUserStore } from "@/stores/UserStore";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { WeddingRole } from "@/models/WeddingRole";

const userStore = useUserStore();
const { localUser, selectedWeddingRole } = storeToRefs(userStore);

onMounted(() => {
  if (localUser.value) {
    allWeddingRoles.value = localUser.value.weddingRoles;
  }
});

const { goToRoute, goToRouteSecured } = useRouterHelper();
const searchQuery = ref("");
const debouncedSearchQuery = ref("");
const allWeddingRoles = ref<WeddingRole[]>([]);

const filteredWeddingRoles = computed(() => {
  let localWeddingRoles = allWeddingRoles.value;

  if (debouncedSearchQuery.value) {
    localWeddingRoles = localWeddingRoles.filter((weddingRole) =>
      weddingRole.wedding.name
        .toLowerCase()
        .includes(debouncedSearchQuery.value.toLowerCase())
    );
  }
  return localWeddingRoles;
});

const updateSearchQuery = debounce((value: string) => {
  debouncedSearchQuery.value = value;
}, 250);

watch(searchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

function goToAddWedding() {
  goToRoute("add-wedding");
}

function goToEditWedding(weddingRole: WeddingRole) {
  goToRoute("edit-wedding", { weddingId: weddingRole.wedding.id });
}

function selectWedding(weddingRole: WeddingRole) {
  selectedWeddingRole.value = weddingRole;
  goToRouteSecured("home");
}
</script>