<template>
  <div v-if="type === 'DESIGN'">
    <label class="form-label d-flex align-item-end cursor-move">
      {{ column.name }}
      <span v-if="column.alias" class="badge bg-primary ms-2">{{ column.alias }}</span>
    </label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <Amap id="column-design" :placeholder="column.cfg.placeholder" />
    <div v-if="column.footer" class="ck ck-content pt-1" v-html="column.footer"></div>
  </div>
  <div v-else-if="type === 'EDIT'">
    <label class="form-label" :title="resolveColumnTitle(column)">{{ column.name }}</label>
    <div v-if="column.header" class="ck ck-content pb-1" v-html="column.header"></div>
    <Amap
      :id="`${column.field}${editable ? '_enable' : '_disabled'}`"
      :field-class="{ 'is-invalid': error }"
      :placeholder="column.cfg.placeholder"
      :disabled="!editable"
      v-model="value"
    />
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
    <img
      v-if="$store.state.sys.cfg.amap && $store.state.sys.cfg.amap.api_key && isLngLat(value)"
      :src="`//restapi.amap.com/v3/staticmap?location=${value}&zoom=12&size=700*300&markers=,,:${value}&key=${$store.state.sys.cfg.amap.api_key}`"
      @dblclick="handleDblClickMap(value)"
      class="img-fluid"
      :alt="value"
    />
    <span v-else>
      <i class="mdi mdi-map-marker text-info" />
      {{ value }}
    </span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { isLngLat, resolveColumnTitle } from '@utils';
import Amap from '@components/Amap';
export default defineComponent({
  components: {
    Amap,
  },
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
      type: String,
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
    const handleDblClickMap = (lnglat) => {
      window.open(
        `//www.amap.com/regeo?lng=${lnglat.split(',')[0]}&lat=${lnglat.split(',')[1]}`,
        '_blank',
      );
    };

    return {
      isLngLat,
      handleDblClickMap,
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
