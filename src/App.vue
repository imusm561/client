<template>
  <component :is="resolveLayoutVariant">
    <router-view v-slot="{ Component }" v-if="isRouterAlive">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <button id="back-to-top" @click="backToTop" class="btn btn-danger btn-icon">
      <i class="mdi mdi-arrow-up-thick fs-18"></i>
    </button>
  </component>
</template>

<script setup>
import pkg from '../package.json';
import { computed, onMounted, onUnmounted, ref, nextTick, provide, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import jwt from 'jsonwebtoken';
import { clearUserData } from '@utils';
import { setWatermark } from '@utils/watermark';
import moment from '@utils/moment';
import { initSocket } from '@utils/socket';
import store from '@store';
import Vertical from '@layouts/vertical';
import Blank from '@layouts/blank';
import { getSysInfo } from '@api/sys';
import { getUserData } from '@api/user';

// Started on 25 June 2021
console.info(
  `%c __     __    __     __  __     ______     __    __
/\\ \\   /\\ "-./  \\   /\\ \\/\\ \\   /\\  ___\\   /\\ "-./  \\
\\ \\ \\  \\ \\ \\-./\\ \\  \\ \\ \\_\\ \\  \\ \\___  \\  \\ \\ \\-./\\ \\
 \\ \\_\\  \\ \\_\\ \\ \\_\\  \\ \\_____\\  \\/\\_____\\  \\ \\_\\ \\ \\_\\
  \\/_/   \\/_/  \\/_/   \\/_____/   \\/_____/   \\/_/  \\/_/
          %cRelease %cv${pkg.version}%c. Crafted with %c❤ %cby %cYuGuanpei`,
  'color:#c33b33;',
  'color:#878a99;',
  'color:#a5a7fe;',
  'color:#878a99;',
  'color:#ff0000;',
  'color:#878a99;',
  'color:#f7bc60;',
);

const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

provide('reload', reload);

const { BASE_URL } = process.env;

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = localStorage.getItem(`${BASE_URL.replace(/\//g, '_')}theme`);
if (prefersDarkMode) {
  if (theme === 'dark') localStorage.removeItem(`${BASE_URL.replace(/\//g, '_')}theme`);
  store.dispatch('sys/toggleTheme', theme || 'dark');
} else {
  if (theme === 'light') localStorage.removeItem(`${BASE_URL.replace(/\//g, '_')}theme`);
  store.dispatch('sys/toggleTheme', theme || 'light');
}

const locale = localStorage.getItem(`${BASE_URL.replace(/\//g, '_')}locale`) || navigator.language;
store.dispatch('sys/toggleLang', locale.toLowerCase());

getSysInfo().then(({ code, data }) => {
  if (code === 200) {
    store.dispatch('sys/updateSysInfo', data);
    if (localStorage.getItem(`${BASE_URL.replace(/\//g, '_')}accessToken`)) getUserData();
  }
});

watch(
  () => store.state.sys.cfg.origin,
  (newVal, oldVal) => {
    if (newVal && newVal != oldVal) initSocket();
  },
  { immediate: true },
);

const route = useRoute();
const router = useRouter();

const documentVisibilitychangeHandler = async () => {
  if (document.visibilityState === 'visible') {
    const token = jwt.decode(localStorage.getItem(`${BASE_URL.replace(/\//g, '_')}accessToken`));
    if (token && token.exp > Math.round(new Date().getTime() / 1000)) {
      if (!store.state.user.data.username || token.username === store.state.user.data.username) {
        if (route.name === 'login') {
          await getUserData();
          router.replace({ name: 'home' });
        }
      } else {
        router.go(0);
      }
    } else {
      if (route?.meta?.auth) {
        clearUserData();
        router.replace({ name: 'login', query: { redirect: route.path } });
      }
    }
  }
};

const backToTop = () => {
  document.getElementById('back-to-top').classList.add('active');
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const windowResizeHandler = () => {
  if (store.state.sys.cfg.waterMark && store.state.user.data.id)
    setWatermark(
      `${store.state.user.data.username} - ${store.state.user.data.fullname}`,
      moment().format('ll'),
    );
};

const windowScrollHandler = () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    document.getElementById('back-to-top').style.display = 'block';
  } else {
    document.getElementById('back-to-top').style.display = 'none';
    document.getElementById('back-to-top').classList.remove('active');
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', documentVisibilitychangeHandler);
  window.addEventListener('resize', windowResizeHandler);
  window.addEventListener('scroll', windowScrollHandler);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', documentVisibilitychangeHandler);
  window.removeEventListener('resize', windowResizeHandler);
  window.removeEventListener('scroll', windowScrollHandler);
});

const resolveLayoutVariant = computed(() => {
  const layout = route.path == '/' || route.meta.layout === 'blank' ? Blank : Vertical;
  document.documentElement.setAttribute('data-layout', layout);
  return layout;
});
</script>
