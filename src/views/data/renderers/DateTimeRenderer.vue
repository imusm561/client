<template>
  <span v-if="params.value">
    <span v-if="['alpine', 'quartz'].includes(theme)" class="d-flex align-items-center">
      <i class="fs-32 mdi mdi-calendar-clock text-secondary" />
      <span class="d-flex flex-column ms-1" style="line-height: 100%">
        <span class="fs-14">
          {{
            $moment(
              params._column.cfg.dateFormat.includes('Y-m-d')
                ? params.value
                : `${$moment().format('YYYY-MM-DD')} ${params.value}`,
            ).format(
              params._column.cfg.dateFormat
                .replace('Y', 'YYYY')
                .replace('m', 'MM')
                .replace('d', 'DD')
                .replace('H', 'HH')
                .replace('i', 'mm')
                .replace('S', 'ss'),
            )
          }}
        </span>
      </span>
    </span>
    <span v-else style="line-height: inherit" class="align-items-center d-flex">
      <i class="fs-20 mdi mdi-calendar-clock text-secondary" />
      <span class="ms-1">
        {{
          $moment(
            params._column.cfg.dateFormat.includes('Y-m-d')
              ? params.value
              : `${$moment().format('YYYY-MM-DD')} ${params.value}`,
          ).format(
            params._column.cfg.dateFormat
              .replace('Y', 'YYYY')
              .replace('m', 'MM')
              .replace('d', 'DD')
              .replace('H', 'HH')
              .replace('i', 'mm')
              .replace('S', 'ss'),
          )
        }}
      </span>
    </span>
  </span>
  <span v-else></span>
</template>

<script>
import { defineComponent, computed } from 'vue';
export default defineComponent({
  setup(props) {
    const theme = computed(() => {
      return props.params.api.getTheme();
    });
    return { theme };
  },
});
</script>
