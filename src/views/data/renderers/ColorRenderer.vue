<template>
  <span v-if="params.value" class="p-1" :style="{ 'background-color': params.value }">
    {{ params.value }}
  </span>
  <span v-else></span>
</template>
