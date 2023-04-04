<template>
  <span class="p-1" :style="{ 'background-color': params.value }">{{ params.value }}</span>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {},
});
</script>
