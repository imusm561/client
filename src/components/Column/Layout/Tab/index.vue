<template>
  <ul class="nav nav-tabs nav-tabs-custom nav-primary">
    <li class="nav-item">
      <a :class="`nav-link active text-${column.cfg.style}`">
        <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon}`"></i>
        {{ column.name }}
      </a>
    </li>
  </ul>
</template>

<script setup>
// eslint-disable-next-line
defineProps({
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>
