<template>
  <span v-if="params.value" class="p-1" :style="{ 'background-color': params.value }">
    {{ params.value }}
  </span>
  <span v-else></span>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {},
});
</script>
