<template>
  <div v-if="type === 'DESIGN'">
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <button :class="`btn btn-sm btn-${column.cfg.style} btn-label`">
      <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon} label-icon`"></i>
      {{ column.name }}
    </button>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <button
      :class="`btn btn-sm btn-${column.cfg.style} btn-label`"
      :disabled="!editable"
      @click.prevent="handleClickButton"
      :title="column.cfg.__href"
    >
      <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon} label-icon`"></i>
      {{ column.name }}
    </button>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <button
      :class="`btn btn-sm btn-${column.cfg.style} btn-label`"
      :disabled="!editable"
      @click.prevent="handleClickButton"
      :title="column.cfg.__href"
    >
      <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon} label-icon`"></i>
      {{ column.name }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  type: {
    type: String,
    default: 'EDIT',
  },
  column: {
    type: Object,
    default: () => {
      return {};
    },
  },
  editable: {
    type: [Boolean, Number],
    default: () => true,
  },
});

const { BASE_URL } = process.env;
const handleClickButton = () => {
  if (props.column.cfg.__href)
    window.open(
      props.column.cfg.__href?.charAt(0) === '/'
        ? props.column.cfg.__href.replace('/', BASE_URL)
        : props.column.cfg.__href,
      '_blank',
    );
};
</script>
