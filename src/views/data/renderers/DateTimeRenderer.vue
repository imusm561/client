<template>
  <span v-if="params.value">
    <span v-if="theme === 'alpine'" class="d-flex align-items-center">
      <i class="fs-32 mdi mdi-calendar-clock text-primary" />
      <span class="d-flex flex-column ms-1" style="line-height: 100%">
        <span class="fs-14">
          {{
            ['date', 'datetime'].includes(params._column.type)
              ? $moment(params.value).format('ll')
              : ''
          }}
        </span>
        <span class="fs-10">
          {{
            ['datetime', 'time'].includes(params._column.type)
              ? $moment(
                  params._column.type === 'datetime'
                    ? params.value
                    : `${$moment().format('YYYY-MM-DD')} ${params.value}`,
                ).format('LTS')
              : ''
          }}
        </span>
      </span>
    </span>
    <span v-else style="line-height: inherit" class="align-items-center d-flex">
      <i class="fs-20 mdi mdi-calendar-clock text-primary" />
      <span class="ms-1">
        {{
          ['date', 'datetime'].includes(params._column.type)
            ? $moment(params.value).format('ll')
            : ''
        }}
        {{
          ['datetime', 'time'].includes(params._column.type)
            ? $moment(
                params._column.type === 'datetime'
                  ? params.value
                  : `${$moment().format('YYYY-MM-DD')} ${params.value}`,
              ).format('LTS')
            : ''
        }}
      </span>
    </span>
  </span>
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
