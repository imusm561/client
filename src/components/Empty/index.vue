<template>
  <div class="d-flex flex-column justify-content-center m-5">
    <img src="@/assets/images/svg/empty.svg" class="mx-auto p-2" height="150" loading="lazy" />
    <p class="text-muted text-center">{{ text || $t('components.empty.text') }}</p>
    <slot></slot>
  </div>
</template>

<script setup>
// eslint-disable-next-line
defineProps({
  text: {
    type: String,
    default: () => '',
    requried: true,
  },
});
</script>
