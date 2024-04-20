<template>
  <span v-if="params.value">
    <span v-if="['alpine', 'quartz'].includes(theme)" class="d-flex align-items-center">
      <i class="fs-32 mdi mdi-calendar-clock text-secondary" />
      <span class="d-flex flex-column ms-1" style="line-height: 100%">
        <span
          class="fs-14"
          :class="
            ['BasicCreatedAt', 'BasicUpdatedAt'].includes(params._column.component) &&
            dayjs().isSame(params.value, 'day')
              ? 'text-info text-decoration-underline'
              : ''
          "
        >
          {{
            dayjs(
              params._column.cfg.dateFormat.includes('Y-m-d')
                ? params.value
                : `${dayjs().format('YYYY-MM-DD')} ${params.value}`,
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
      <span
        class="ms-1"
        :class="
          ['BasicCreatedAt', 'BasicUpdatedAt'].includes(params._column.component) &&
          dayjs().isSame(params.value, 'day')
            ? 'text-info text-decoration-underline'
            : ''
        "
      >
        {{
          dayjs(
            params._column.cfg.dateFormat.includes('Y-m-d')
              ? params.value
              : `${dayjs().format('YYYY-MM-DD')} ${params.value}`,
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

<script setup>
import { computed } from 'vue';
import dayjs from '@utils/dayjs';

// eslint-disable-next-line
const props = defineProps(['params']);
const theme = computed(() => {
  return props.params.api.getTheme();
});
</script>
