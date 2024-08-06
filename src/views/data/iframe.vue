<template>
  <iframe v-if="url" class="h-iframe w-100" :src="url" frameborder="0"></iframe>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { decryptData } from '@utils';

const url = ref(null);
const route = useRoute();
watch(
  () => route.params.code,
  (value) => {
    try {
      url.value = decryptData(decodeURIComponent(value));
    } catch (error) {
      // console.error(error);
      url.value = null;
    }
  },
  { immediate: true },
);
</script>
