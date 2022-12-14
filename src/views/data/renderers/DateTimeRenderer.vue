<template>
  <span v-if="params.value" class="d-flex align-items-center">
    <i class="fs-32 mdi mdi-calendar-clock text-primary" />
    <span class="d-flex flex-column ms-1" style="line-height: 100%">
      <span class="fs-14 text-dark">{{ ['date', 'datetime'].includes(params._column.type) ? $moment(params.value).format('ll') : '' }}</span>
      <span class="mt-1 fs-10 text-muted">
        {{ ['datetime', 'time'].includes(params._column.type) ? $moment(params._column.type === 'datetime' ? params.value : `${$moment().format('YYYY-MM-DD')} ${params.value}`).format('LTS') : '' }}
      </span>
    </span>
  </span>
  <span v-else></span>
</template>
