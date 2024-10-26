<template>
    <div class="mx-4 mt-4">
        <div class="inline-flex gap-4">
            <Search class="mb-4" placeholder="Search for wedding..." v-model="searchQuery" />
            <Button @click="goToAddWedding">Create Wedding</Button>
        </div>
        <WeddingCard class="cursor-pointer" v-if="allWeddings.length" v-for="wedding in filteredWeddings" :wedding="wedding"
            :key="wedding.id" @click="selectWedding(wedding)"/>
    </div>
</template>

<script setup lang="ts">
import WeddingCard from '@/components/weddings/WeddingCard.vue';
import { Button } from '@/components/ui/button';
import { Wedding } from '@/models/Wedding';
import Search from '@/components/Search.vue';
import { ref, onMounted, watch, computed } from 'vue';
import debounce from 'lodash/debounce';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const userStore = useUserStore();
const { localUser, selectedWedding } = storeToRefs(userStore);

onMounted(() => {
    if (localUser.value) {
        allWeddings.value = localUser.value.weddingRoles.map(weddingRole => weddingRole.wedding);
    }
});

const {goToRoute, goToRouteSecured} = useRouterHelper(); 
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const allWeddings = ref<Wedding[]>([]);

const filteredWeddings = computed(() => {
    let localWeddings = allWeddings.value;

    if (debouncedSearchQuery.value) {
        localWeddings = localWeddings.filter(wedding =>
            wedding.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localWeddings;
});

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

function goToAddWedding() {
    goToRoute('add-wedding');
}

function goToEditWedding(wedding : Wedding) {
    goToRoute('edit-wedding', { weddingId: wedding.id });
}

function selectWedding(wedding: Wedding) {
    selectedWedding.value = wedding;
    goToRouteSecured('guests');
}

</script>