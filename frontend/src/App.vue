<template>
  <div class="bg-background">
        <Navbar />
        <div class="bg-background">
          <router-view />
        </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import {onMounted} from 'vue';

onMounted(() => {
  document.documentElement.classList.add('dark')
});

</script>

<style>


</style>