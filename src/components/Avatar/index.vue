<template>
  <div v-if="isGroup" class="avatar-group">
    <span v-for="(user, index) in users" :key="index" class="avatar-group-item cursor-pointer">
      <div :title="user[keyFullname]">
        <img
          v-if="user[keyAvatar]"
          :src="`${BASE_URL}${user[keyAvatar]}`"
          :class="`avatar-${size} rounded-circle bg-avatar ${thumbnail && 'img-thumbnail'}`"
        />
        <img
          v-else-if="$store.state.sys.cfg.use_default_avatar"
          :src="
            user.collapse
              ? require('@/assets/images/avatar/collapse.png')
              : typeof user[keyUsername] === 'string'
              ? require(`@/assets/images/avatar/${
                  user[keyUsername] === '@system'
                    ? 'system'
                    : user[keyUsername] === 'admin'
                    ? 'admin'
                    : user.gender === 1
                    ? 'male'
                    : user.gender === 0
                    ? 'female'
                    : 'user'
                }.png`)
              : require(`@/assets/images/avatar/${user[keyUsername] === 0 ? 'all' : 'group'}.png`)
          "
          :class="`avatar-${size} rounded-circle bg-avatar p-1 ${thumbnail && 'img-thumbnail'}`"
        />
        <div v-else :class="`avatar-${size} rounded-circle`">
          <div
            :class="`avatar-title rounded-circle bg-avatar text-light ${fs[size]} ${
              thumbnail && 'img-thumbnail'
            }`"
          >
            {{
              user.collapse
                ? user[keyUsername]
                : typeof user[keyUsername] === 'string'
                ? user[keyUsername] && user[keyUsername].charAt(0).toUpperCase()
                : user[keyFullname] && user[keyFullname].charAt(0).toUpperCase()
            }}
          </div>
        </div>
      </div>
    </span>
  </div>
  <div v-else :title="user[keyFullname]">
    <img
      v-if="user[keyAvatar]"
      :src="`${BASE_URL}${user[keyAvatar]}`"
      :class="`avatar-${size} rounded-circle bg-avatar ${thumbnail && 'img-thumbnail'}`"
    />
    <img
      v-else-if="$store.state.sys.cfg.use_default_avatar"
      :src="
        typeof user[keyUsername] === 'string'
          ? require(`@/assets/images/avatar/${
              user[keyUsername] === '@system'
                ? 'system'
                : user[keyUsername] === 'admin'
                ? 'admin'
                : user.gender === 1
                ? 'male'
                : user.gender === 0
                ? 'female'
                : 'user'
            }.png`)
          : require(`@/assets/images/avatar/${user[keyUsername] === 0 ? 'all' : 'group'}.png`)
      "
      :class="`avatar-${size} rounded-circle bg-avatar p-1 ${thumbnail && 'img-thumbnail'}`"
    />
    <div v-else :class="`avatar-${size} rounded-circle`">
      <div
        :class="`avatar-title rounded-circle bg-avatar text-light ${fs[size]} ${
          thumbnail && 'img-thumbnail'
        }`"
      >
        {{
          typeof user[keyUsername] === 'string'
            ? user[keyUsername] && user[keyUsername].charAt(0).toUpperCase()
            : user[keyFullname] && user[keyFullname].charAt(0).toUpperCase()
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue';
export default defineComponent({
  props: {
    data: {
      type: [Object, Array],
      requried: true,
    },
    size: {
      type: String,
      default: () => 'xs',
      requried: true,
    },
    thumbnail: {
      type: Boolean,
      default: () => false,
    },
    keyAvatar: {
      type: String,
      default: () => 'avatar',
      requried: true,
    },
    keyUsername: {
      type: String,
      default: () => 'username',
      requried: true,
    },
    keyFullname: {
      type: String,
      default: () => 'fullname',
      requried: true,
    },
  },
  setup(props) {
    const isGroup = ref(false);
    const user = ref({});
    const users = ref([]);

    const fs = ref({
      xxs: 'fs-10',
      xs: 'fs-16',
      sm: 'fs-20',
      md: 'fs-24',
      lg: 'fs-36',
      xl: 'fs-48',
    });

    onMounted(() => {
      watch(
        () => props.data,
        (val) => {
          const data = JSON.parse(JSON.stringify(val));
          if (Array.isArray(data)) {
            isGroup.value = true;
            if (data.length < 6) users.value = data;
            else {
              const collapse_users_object = {};
              collapse_users_object.collapse = true;
              collapse_users_object[props.keyUsername] = '···';
              collapse_users_object[props.keyFullname] = data
                .slice(4)
                .map((item) => {
                  return item[props.keyFullname];
                })
                .toString();
              users.value = [...data.slice(0, 4), ...[collapse_users_object]];
            }
          } else {
            isGroup.value = false;
            user.value = data;
          }
        },
        { immediate: true, deep: true },
      );
    });

    return {
      isGroup,
      user,
      users,
      fs,
    };
  },
});
</script>
