<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-block d-flex align-item-end cursor-move">
      &nbsp;
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <button :class="`btn btn-${column.cfg.style} btn-label`">
      <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon} label-icon`"></i>
      {{ column.name }}
    </button>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label d-block" :title="resolveColumnTitle(column)">&nbsp;</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <button
      :class="`btn btn-${column.cfg.style} btn-label`"
      :disabled="!editable"
      @click.prevent="handleClickButton"
    >
      <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon} label-icon`"></i>
      {{ column.name }}
    </button>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <label class="form-label d-block" :title="resolveColumnTitle(column)">&nbsp;</label>
    <button
      :class="`btn btn-sm btn-${column.cfg.style} btn-label`"
      :disabled="!editable"
      @click.prevent="handleClickButton"
    >
      <i v-if="column.cfg.icon" :class="`mdi ${column.cfg.icon} label-icon`"></i>
      {{ column.name }}
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { resolveColumnTitle } from '@utils';
export default defineComponent({
  props: {
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
  },
  setup(props) {
    const handleClickButton = () => {
      if (props.column.cfg.__href) window.open(props.column.cfg.__href, '_blank');
    };

    return {
      resolveColumnTitle,
      handleClickButton,
    };
  },
});
</script>
