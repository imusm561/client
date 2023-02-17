<template>
  <span v-if="params.value === $t('data.list.filter.selectAll')">
    {{ $t('data.list.filter.selectAll') }}
  </span>
  <span v-else>
    <i class="mdi" :class="resolveItemIconClass(Number(params.value))"></i>
    {{
      Number(params.value) === 1
        ? $t('data.list.filter.switch.true')
        : $t('data.list.filter.switch.false')
    }}
  </span>
</template>

<script>
import { computed, defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const resolveItemIconClass = computed(() => {
      return (value) => {
        switch (value) {
          case 0:
            return 'mdi-checkbox-blank-outline text-danger';
          case 1:
            return 'mdi-checkbox-marked-outline text-success';
          default:
            return 'mdi-checkbox-marked-outline text-success';
        }
      };
    });
    return {
      resolveItemIconClass,
    };
  },
});
</script>
