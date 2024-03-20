<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <FlatPickr
      class="form-control"
      :placeholder="column.cfg.placeholder"
      :config="column.cfg"
    ></FlatPickr>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">
      {{ column.name }}
      <i
        v-if="column.default"
        class="refresh mdi mdi-refresh fs-12 cursor-pointer text-info"
        @click="$emit('refresh', column)"
      ></i>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <FlatPickr
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      :class="['form-control', error && 'is-invalid']"
      :placeholder="column.cfg.placeholder"
      :config="column.cfg"
      :disabled="!editable"
      v-model="value"
    ></FlatPickr>
    <Field
      :name="column.field"
      v-model="value"
      class="d-none"
      :class="{ 'is-invalid': error }"
      :rules="`${required ? 'required' : ''}`"
    />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <span v-if="value">
      <i class="mdi mdi-clock-outline" />
      {{
        moment(
          column.cfg.dateFormat.includes('Y-m-d')
            ? value
            : `${moment().format('YYYY-MM-DD')} ${value}`,
        ).format(
          column.cfg.dateFormat
            .replace('Y', 'YYYY')
            .replace('m', 'MM')
            .replace('d', 'DD')
            .replace('H', 'HH')
            .replace('i', 'mm')
            .replace('S', 'ss'),
        )
      }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { resolveColumnTitle } from '@utils';
import moment from '@utils/moment';
import FlatPickr from '@components/FlatPickr';
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
  modelValue: {
    type: [String, Date],
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
});
const emit = defineEmits(['update:modelValue']);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value || null);
  },
});
</script>
