<template>
  <div class="row g-3">
    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.btnName') }}</label>
      <input
        v-model="column.name"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.btnName')"
        :class="['form-control', errors.name && 'is-invalid']"
      />
      <Field
        name="name"
        v-model="column.name"
        class="d-none"
        :class="{ 'is-invalid': errors.name }"
        rules="required|exclude: @"
      />
      <span class="invalid-feedback">{{ errors.name }}</span>
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.icon') }}</label>
      <VueSelect
        v-model="column.cfg.icon"
        :placeholder="$t('layout.navbar.helper.form.column.config.icon')"
        :reduce="(item) => `mdi-${item.name}`"
        label="name"
        @search="fetchIconOptions"
        :options="iconOptions"
      >
        <template #option="{ name }">
          <div class="d-flex align-items-center">
            <i :class="`mdi mdi-${name} me-2`" />
            <span class="ml-50 align-middle text-truncate">{{ name }}</span>
          </div>
        </template>

        <template #selected-option="{ name }">
          <div class="d-flex align-items-center">
            <i :class="`mdi ${name}`" />
          </div>
        </template>

        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-if="search.length > 2">
              <span v-html="$t('components.vs.search', { search })"></span>
            </span>
            <span v-else v-html="$t('components.vs.searchRule')"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.style') }}</label>
      <VueSelect
        v-model="column.cfg.style"
        :placeholder="$t('layout.navbar.helper.form.column.config.style')"
        :options="[
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Success', value: 'success' },
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Danger', value: 'danger' },
        ]"
        :reduce="(item) => item.value"
        label="label"
        :clearable="false"
      >
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-html="$t('components.vs.search', { search })"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.col') }}</label>
      <VueSelect
        v-model="column.col"
        :placeholder="$t('layout.navbar.helper.form.column.config.col')"
        :options="[4, 5, 6, 7, 8, 12]"
        :clearable="false"
      >
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-html="$t('components.vs.search', { search })"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.href') }}</label>
      <input
        v-model="column.cfg.href"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.href')"
        class="form-control"
      />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.visible') }}</label>
      <input
        v-model="column.visible"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.visible')"
        class="form-control"
      />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.disabled') }}</label>
      <input
        v-model="column.editable"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.disabled')"
        class="form-control"
      />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.tags') }}</label>
      <VueSelect
        v-model="column.tags"
        multiple
        :close-on-select="false"
        taggable
        push-tags
        :placeholder="$t('layout.navbar.helper.form.column.config.tags')"
      >
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-html="$t('components.vs.search', { search })"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.header') }}</label>
      <CKEditor v-model="column.header" />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.footer') }}</label>
      <CKEditor v-model="column.footer" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { icons } from '@utils/icons';
import CKEditor from '@components/CKEditor';
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return {};
    },
  },
  errors: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const emit = defineEmits(['update:modelValue']);

const iconOptions = ref([]);
const fetchIconOptions = (search, loading) => {
  iconOptions.value = [];
  if (search.length > 2) {
    loading(true);
    iconOptions.value = icons.filter((item) => item.name.includes(search));
    loading(false);
  }
};

const column = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
