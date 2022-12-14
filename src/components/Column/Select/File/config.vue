<template>
  <div class="row g-3">
    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.name') }}</label>
      <input v-model="column.name" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.name')" :class="['form-control', errors.name && 'is-invalid']" />
      <Field name="name" v-model="column.name" class="d-none" :class="{ 'is-invalid': errors.name }" rules="required|exclude: @" />
      <span class="invalid-feedback">{{ errors.name }}</span>
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.style') }}</label>
      <VueSelect
        v-model="column.cfg.style"
        :placeholder="$t('layout.navbar.helper.form.column.config.style')"
        :options="[
          { label: 'Primary', value: 'btn-primary' },
          { label: 'Secondary', value: 'btn-secondary' },
          { label: 'Success', value: 'btn-success' },
          { label: 'Info', value: 'btn-info' },
          { label: 'Warning', value: 'btn-warning' },
          { label: 'Danger', value: 'btn-danger' },
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
      <VueSelect v-model="column.col" :placeholder="$t('layout.navbar.helper.form.column.config.col')" :options="[4, 5, 6, 7, 8, 12]" :clearable="false">
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
      <VueSelect v-model="column.alias" :placeholder="$t('layout.navbar.helper.form.column.config.alias')" :options="alias">
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span>
              <span v-html="$t('components.vs.search', { search })"></span>
            </span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.btnName') }}</label>
      <input v-model="column.cfg.placeholder" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.btnName')" class="form-control" />
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.prefix') }}</label>
      <input v-model="column.cfg.prefix" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.prefix')" class="form-control" />
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.accept') }}</label>
      <input v-model="column.cfg.accept" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.accept')" class="form-control" />
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.multiple') }}</label>
      <VueSelect v-model="column.cfg.multiple" :placeholder="$t('layout.navbar.helper.form.column.config.multiple')" :options="[true, false]" :clearable="false">
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-html="$t('components.vs.search', { search })"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-3 col-sm-6">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.qrable') }}</label>
      <VueSelect v-model="column.cfg.qrable" :placeholder="$t('layout.navbar.helper.form.column.config.qrable')" :options="[true, false]" :clearable="false">
        <template v-slot:no-options="{ search, searching }">
          <template v-if="searching">
            <span v-html="$t('components.vs.search', { search })"></span>
          </template>
          <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
        </template>
      </VueSelect>
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.visible') }}</label>
      <input v-model="column.visible" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.visible')" class="form-control" />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.required') }}</label>
      <input v-model="column.required" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.required')" class="form-control" />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.editable') }}</label>
      <input v-model="column.editable" type="text" :placeholder="$t('layout.navbar.helper.form.column.config.editable')" class="form-control" />
    </div>

    <div class="col-md-12">
      <label class="form-label">{{ $t('layout.navbar.helper.form.column.config.tags') }}</label>
      <VueSelect v-model="column.tags" multiple :close-on-select="false" taggable push-tags :placeholder="$t('layout.navbar.helper.form.column.config.tags')" :options="['batchUpdate', 'searchable']">
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

<script>
import { defineComponent, computed } from 'vue';
import CKEditor from '@components/CKEditor';
export default defineComponent({
  components: {
    CKEditor,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
    alias: {
      type: Array,
      default: () => {
        return [];
      },
    },
    errors: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    return {
      column: computed({
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
