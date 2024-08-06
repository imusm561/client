<template>
  <iframe class="h-iframe w-100" :src="url" frameborder="0"></iframe>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const url = ref(null);
const route = useRoute();
watch(
  () => route.params.url,
  (value) => {
    if (value) {
      url.value = decodeURIComponent(value);
    }
  },
  { immediate: true },
);
</script>
