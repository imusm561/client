<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <VueSelect class="w-100" :placeholder="column.cfg.placeholder" multiple :close-on-select="false" taggable push-tags></VueSelect>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <VueSelect
      :id="`id_${column.field}${editable ? '' : '_disabled'}`"
      :class="{ 'is-invalid': error }"
      :placeholder="column.cfg.placeholder"
      :disabled="!editable"
      v-model="value"
      multiple
      :close-on-select="false"
      taggable
      :options="options"
    >
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          <span v-html="$t('components.vs.search', { search })"></span>
        </template>
        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateOption') }}</em>
      </template>
    </VueSelect>
    <Field :name="column.field" v-model="value" class="d-none" :class="{ 'is-invalid': error }" :rules="`${required ? 'required' : ''}`" />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else class="d-flex gap-1">
    <span v-for="(item, index) in value" :key="index" class="badge bg-primary">{{ item }}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
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
    modelValue: {
      type: Array,
      default: () => null,
    },
    required: {
      type: [Boolean, Number],
      default: () => false,
    },
    editable: {
      type: [Boolean, Number],
      default: () => true,
    },
    error: {
      type: String,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const options = computed(() => {
      return Array.from(new Set([...(props.column.cfg.options || []), ...(props.modelValue || [])]));
    });

    return {
      options,
      resolveColumnTitle,
      value: computed({
        get() {
          return props.modelValue;
        },
        set(value) {
          emit('update:modelValue', value);
        },
      }),
    };
  },
});
</script>
