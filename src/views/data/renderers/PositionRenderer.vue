<template>
  <span v-if="params.value">
    <i class="mdi mdi-map-marker text-info" />
    <span
      v-if="$store.state.sys.cfg.amap && $store.state.sys.cfg.amap.api_key && isLngLat(params.value)"
      class="text-primary cursor-pointer text-decoration-underline"
      @dblclick="handleDblClickLngLat(params.value)"
    >
      {{ params.value }}
    </span>
    <span v-else>{{ params.value }}</span>
  </span>
  <span v-else></span>
</template>

<script>
import { defineComponent } from 'vue';
import { isLngLat } from '@utils';
export default defineComponent({
  setup() {
    const handleDblClickLngLat = (lnglat) => {
      window.open(`//www.amap.com/regeo?lng=${lnglat.split(',')[0]}&lat=${lnglat.split(',')[1]}`, '_blank');
    };
    return {
      isLngLat,
      handleDblClickLngLat,
    };
  },
});
</script>
