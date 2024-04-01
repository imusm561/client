<template>
  <div class="row g-3">
    <div class="col-md-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.name') }}</label>
      <input
        v-model="column.name"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.name')"
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

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.alias') }}</label>
      <input
        v-model="column.alias"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.alias')"
        :class="['form-control', errors.alias && 'is-invalid']"
        @dblclick="
          () => {
            column.alias =
              column.alias ||
              pinyin(column.name, { toneType: 'none', type: 'array' })
                .map((item) => {
                  return item.charAt(0).toUpperCase() + item.slice(1);
                })
                .join('');
          }
        "
      />
      <Field
        name="alias"
        v-model="column.alias"
        class="d-none"
        :class="{ 'is-invalid': errors.alias }"
        :rules="`notin:${alias}`"
      />
      <span class="invalid-feedback">{{ errors.alias }}</span>
    </div>

    <div class="col-md-6">
      <label class="form-label">
        {{ $t('layout.navbar.helper.form.column.config.placeholder') }}
      </label>
      <input
        v-model="column.cfg.placeholder"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.placeholder')"
        class="form-control"
      />
    </div>

    <div class="col-md-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.default') }}</label>
      <input
        v-model="column.default"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.default')"
        :class="['form-control', errors.default && 'is-invalid']"
      />
      <Field
        name="default"
        v-model="column.default"
        class="d-none"
        :class="{ 'is-invalid': errors.default }"
        rules="exclude:*=="
      />
      <span class="invalid-feedback">{{ errors.default }}</span>
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.options') }}</label>
      <VueSelect
        v-model="column.cfg.options"
        multiple
        :close-on-select="false"
        taggable
        push-tags
        :placeholder="$t('layout.navbar.helper.form.column.config.options')"
      >
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-html="$t('components.vs.search', { search })"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.generateOption') }}</em>
        </template>
      </VueSelect>
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
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.required') }}</label>
      <input
        v-model="column.required"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.required')"
        class="form-control"
      />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.editable') }}</label>
      <input
        v-model="column.editable"
        type="text"
        :placeholder="$t('layout.navbar.helper.form.column.config.editable')"
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
        :options="['cellEdit', 'batchUpdate', 'searchable']"
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
import { computed } from 'vue';
import { pinyin } from 'pinyin-pro';
import CKEditor from '@components/CKEditor';
// eslint-disable-next-line
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return {};
    },
  },
  alias: {
    type: String,
    default: () => {
      return '';
    },
  },
  errors: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
// eslint-disable-next-line
const emits = defineEmits(['update:modelValue']);
const column = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>
