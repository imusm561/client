<template>
  <div style="height: 65vh">
    <div class="row g-3">
      <div class="col-md-12">
        <label class="form-label">
          {{ $t('layout.navbar.helper.form.column.config.tabName') }}
        </label>
        <input
          v-model="column.name"
          type="text"
          :placeholder="$t('layout.navbar.helper.form.column.config.tabName')"
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

      <div class="col-md-6">
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

      <div class="col-md-6">
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
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { icons } from '@utils/icons';
export default defineComponent({
  props: {
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
  },
  setup(props, { emit }) {
    const iconOptions = ref([]);
    const fetchIconOptions = (search, loading) => {
      iconOptions.value = [];
      if (search.length > 2) {
        loading(true);
        iconOptions.value = icons.filter((item) => item.name.includes(search));
        loading(false);
      }
    };
    return {
      iconOptions,
      fetchIconOptions,
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
