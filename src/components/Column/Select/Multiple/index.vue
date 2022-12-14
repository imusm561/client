<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <VueSelect :placeholder="column.cfg.placeholder"></VueSelect>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <VueSelect
      v-if="column.cfg.source"
      :id="`id_${column.field}${editable ? '' : '_disabled'}`"
      :class="{ 'is-invalid': error }"
      :placeholder="column.cfg.placeholder"
      :disabled="!editable"
      v-model="value"
      multiple
      :close-on-select="false"
      :reduce="(item) => item.value"
      label="text"
      :options="options"
      @search="
        (search, loading) => {
          $emit('search', { search, loading, column });
        }
      "
      :selectable="(option) => option.value !== 'Error: '"
    >
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          <span v-html="$t('components.vs.search', { search })"></span>
        </template>
        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
      </template>
    </VueSelect>
    <VueSelect
      v-else
      :id="`id_${column.field}${editable ? '' : '_disabled'}`"
      :class="{ 'is-invalid': error }"
      :placeholder="column.cfg.placeholder"
      :disabled="!editable"
      v-model="value"
      multiple
      :close-on-select="false"
      :options="column.cfg.options"
    >
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          <span v-html="$t('components.vs.search', { search })"></span>
        </template>
        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
      </template>
    </VueSelect>
    <Field :name="column.field" v-model="value" class="d-none" :class="{ 'is-invalid': error }" :rules="`${required ? 'required' : ''}`" />
    <span class="invalid-feedback">{{ error }}</span>
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else>
    <div v-for="(item, index) in value" :key="index">
      {{ index + 1 }}.
      <span v-if="item.tid && item.rid" class="cursor-pointer text-decoration-underline text-secondary" @click="handleClickValue(item)" :title="`${item.tid}/${item.rid}`">{{ item.text }}</span>
      <span v-else>{{ item }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { resolveColumnTitle, useRouter } from '@utils';
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
    const unique = (arr) => {
      const res = new Map();
      return arr.filter((item) => !res.has(item.value) && res.set(item.value, 1));
    };

    const options = computed(() => {
      return unique([...(props.column.cfg.search || []), ...(props.column.cfg.options || []), ...(props.column.cfg.selected || [])]);
    });

    const { router } = useRouter();
    const handleClickValue = (item) => {
      const route = router.resolve({ name: 'view', params: { tid: item.tid, rid: item.rid } });
      window.open(route.href, '_blank');
    };

    return {
      options,
      resolveColumnTitle,
      handleClickValue,
      value: computed({
        get() {
          return props.modelValue;
        },
        set(value) {
          emit('update:modelValue', value);
          emit(
            'selected',
            options.value.filter((option) => value.includes(option.value)),
          );
        },
      }),
    };
  },
});
</script>
