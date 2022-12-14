<template>
  <div v-if="typeof params.value === 'boolean'" :class="`form-check form-switch mt-2 form-switch-${params._column.cfg.style} form-switch-md`">
    <input type="checkbox" class="form-check-input" disabled :checked="params.value" />
  </div>
  <span v-else></span>
</template>
