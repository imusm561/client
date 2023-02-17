<template>
  <div>
    <label class="form-label" :title="resolveColumnTitle(column)">
      {{ $t('data.column.BasicAclEdit') }}
    </label>
    <UsersSelector
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      v-model="value"
      :disabled="!editable"
      :placeholder="$t('data.column.BasicAclView')"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { resolveColumnTitle } from '@utils';
import UsersSelector from '@components/UsersSelector';
export default defineComponent({
  components: {
    UsersSelector,
  },
  props: {
    column: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modelValue: {
      type: Array,
      default: () => {
        return [];
      },
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
    return {
      resolveColumnTitle,
      value: computed({
        get() {
          return props.modelValue || [];
        },
        set(value) {
          emit('update:modelValue', value);
        },
      }),
    };
  },
});
</script>
