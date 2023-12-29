<template>
  <TreeSelect
    :options="options"
    :placeholder="placeholder"
    v-model="users"
    multiple
    :clearable="true"
    :searchable="false"
    :disabled="disabled"
    :open-on-click="true"
    :open-on-focus="false"
    :clear-on-select="true"
    :close-on-select="false"
    :always-open="false"
    :max-height="200"
    value-consists-of="LEAF_PRIORITY"
    sort-value-by="ORDER_SELECTED"
    clear-all-text=""
    clear-value-text=""
    :no-options-text="$t('components.vst.noOptionsText')"
    :no-results-text="$t('components.vst.noResultsText')"
  >
    <template
      #option-label="{
        node: {
          id: username,
          label: fullname,
          raw: { avatar },
        },
      }"
    >
      <div class="ms-1 d-flex align-items-center">
        <Avatar class="me-2" :data="{ username, fullname, avatar }" size="xxs" />
        <span class="ms-1 align-middle text-dark">{{ fullname }}</span>
      </div>
    </template>
    <template
      #value-label="{
        node: {
          id: username,
          label: fullname,
          raw: { avatar },
        },
      }"
    >
      <div class="d-flex align-items-center">
        <Avatar class="me-2" :data="{ username, fullname, avatar }" size="xxs" />
        <span class="ms-1 align-middle text-dark">{{ fullname }}</span>
      </div>
    </template>
  </TreeSelect>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import TreeSelect from 'vue3-treeselect';
import Avatar from '@components/Avatar';
import store from '@store';
export default defineComponent({
  components: {
    Avatar,
    TreeSelect,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disableList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: () => 'Select Users',
    },
  },
  setup(props, { emit }) {
    const users = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const options = ref([]);

    const generateDeptUserTree = (list, parent_id = 0) =>
      list
        .filter((item) => item.pid === parent_id)
        .map((item) => {
          const children = generateDeptUserTree(list, item.id);
          if (children.length) item.children = [...item.children, ...children];
          if (item.children.every((child) => child.isDisabled)) {
            item.isDisabled = true;
            item.isDefaultExpanded = false;
          }
          return item;
        });

    const _users = JSON.parse(JSON.stringify(store.state.org.users)).map((user) => {
      return {
        id: user.username,
        label: user.fullname,
        isDisabled: props.disableList.includes(user.username),
        dept: user.dept,
        avatar: user.avatar,
      };
    });

    const _depts = JSON.parse(JSON.stringify(store.state.org.depts)).map((dept) => {
      return {
        id: dept.id,
        label: dept.name,
        isDefaultExpanded: true,
        pid: dept.pid,
        children: _users.filter((user) => user.dept === dept.id),
      };
    });

    options.value = generateDeptUserTree(_depts);

    return {
      users,
      options,
    };
  },
});
</script>
