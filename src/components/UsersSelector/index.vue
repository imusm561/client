<template>
  <VueSelect
    v-model="show_users"
    multiple
    :close-on-select="false"
    :placeholder="placeholder"
    :reduce="(item) => item.value"
    label="label"
    :options="options"
    :disabled="disabled"
    :selectable="
      (option) =>
        show_users.includes(0)
          ? option.value === 0
          : option.users
          ? true
          : !(!show_users.includes(option.value) && real_users.includes(option.value))
    "
  >
    <template #option="data">
      <div class="d-flex align-items-center">
        <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
        <span class="ml-50 align-middle">{{ data.label }}</span>
      </div>
    </template>

    <template #selected-option="data">
      <div class="d-flex align-items-center">
        <Avatar class="me-2" :data="data" size="xxs" key-username="value" key-fullname="label" />
        <span class="ml-50 align-middle">{{ data.label }}</span>
      </div>
    </template>

    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        <span v-html="$t('components.vs.search', { search })"></span>
      </template>
      <em v-else style="opacity: 0.5">{{ $t('components.vs.searchUser') }}</em>
    </template>
  </VueSelect>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import Avatar from '@components/Avatar';
import store from '@store';
import i18n from '@utils/i18n';
export default defineComponent({
  components: {
    Avatar,
  },
  props: {
    modelValue: {
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
    const show_users = ref([]);
    const real_users = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const all = [
      {
        value: 0,
        label: i18n.global.t('components.userSelector.userAll'),
        title: i18n.global.t('components.userSelector.userAll'),
      },
    ];
    const users = JSON.parse(JSON.stringify(store.state.org.users)).map((user) => {
      return {
        value: user.username,
        label: user.fullname,
        dept: user.dept,
        avatar: user.avatar,
        gender: user.gender,
      };
    });
    const depts = JSON.parse(JSON.stringify(store.state.org.depts))
      .map((dept) => {
        return {
          value: dept.id,
          label: dept.name,
          users: users
            .filter((user) => user.dept === dept.id)
            .map((user) => {
              return {
                username: user.value,
                fullname: user.label,
              };
            }),
        };
      })
      .filter((dept) => dept.users.length != 0);

    const options = ref([...all, ...depts, ...users]);

    onMounted(() => {
      watch(
        real_users,
        (newVal = [], oldVal = []) => {
          if (
            newVal.filter((item) => !oldVal.includes(item)).length ||
            oldVal.filter((item) => !newVal.includes(item)).length
          )
            randerShowUsers();
        },
        { immediate: true },
      );
      watch(
        show_users,
        (newVal = [], oldVal = []) => {
          if (
            newVal.filter((item) => !oldVal.includes(item)).length ||
            oldVal.filter((item) => !newVal.includes(item)).length
          )
            generateRealUsers();
        },
        { immediate: true },
      );
    });

    const randerShowUsers = () => {
      let temp_show_users = JSON.parse(JSON.stringify(real_users.value));
      if (real_users.value && real_users.value.length === 0) temp_show_users = [];
      else if (real_users.value && real_users.value.length === users.length) temp_show_users = [0];
      else {
        JSON.parse(JSON.stringify(depts))
          .reverse()
          .forEach((dept) => {
            if (
              dept.users
                .map((user) => {
                  return user.username;
                })
                .every((username) => temp_show_users.includes(username))
            ) {
              temp_show_users.unshift(dept.value);
              temp_show_users = temp_show_users.filter(
                (item) =>
                  !dept.users
                    .map((user) => {
                      return user.username;
                    })
                    .includes(item),
              );
            }
          });
      }
      show_users.value = temp_show_users;
    };

    const generateRealUsers = () => {
      let temp_show_users = JSON.parse(JSON.stringify(show_users.value));
      let temp_real_users = [];
      if (
        temp_show_users.includes(0) ||
        depts.every((dept) => temp_show_users.includes(dept.value))
      ) {
        temp_show_users = [0];
        temp_real_users = users.map((user) => {
          return user.value;
        });
      } else {
        temp_show_users.forEach((value) => {
          if (typeof value === 'number') {
            const dept = depts.find((dept) => dept.value === value);
            temp_real_users = [
              ...temp_real_users,
              ...dept.users.map((user) => {
                return user.username;
              }),
            ];
            temp_show_users = temp_show_users.filter(
              (item) =>
                !dept.users
                  .map((user) => {
                    return user.username;
                  })
                  .includes(item),
            );
          } else {
            temp_real_users.push(value);
          }
        });
        depts
          .filter((dept) => !temp_show_users.includes(dept.value))
          .forEach((dept) => {
            if (
              dept.users
                .map((user) => {
                  return user.username;
                })
                .every((username) => temp_show_users.includes(username))
            ) {
              temp_show_users.push(dept.value);
              temp_show_users = temp_show_users.filter(
                (item) =>
                  !dept.users
                    .map((user) => {
                      return user.username;
                    })
                    .includes(item),
              );
            }
          });
      }
      show_users.value = temp_show_users;
      real_users.value = temp_real_users;
    };

    return {
      show_users,
      real_users,
      options,
    };
  },
});
</script>
