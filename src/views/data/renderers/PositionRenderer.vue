<template>
  <span v-if="params.value">
    <i class="mdi mdi-map-marker text-info" />
    <span
      v-if="$store.state.sys.cfg.amapWebService && isLngLat(params.value)"
      class="text-secondary cursor-pointer text-decoration-underline"
      @dblclick="handleDblClickLngLat(params.value)"
    >
      {{ params.value }}
    </span>
    <span v-else>{{ params.value }}</span>
  </span>
  <span v-else></span>
</template>

<script setup>
import { isLngLat } from '@utils';
const handleDblClickLngLat = (lnglat) => {
  window.open(
    `//www.amap.com/regeo?lng=${lnglat.split(',')[0]}&lat=${lnglat.split(',')[1]}`,
    '_blank',
  );
};
</script>
