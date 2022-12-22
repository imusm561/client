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

<script>
import pkg from '../package.json';
import vertical from '@/layouts/vertical';
import blank from '@/layouts/blank';
import store from '@store';
import { useRouter, clearUserData } from '@utils';
import { computed, onMounted, onUnmounted, ref, nextTick, provide } from 'vue';
import { getSysInfo } from '@api/sys';
import { getUserData } from '@api/user';
import { setWatermark } from '@utils/watermark';
import jwt from 'jsonwebtoken';

export default {
  name: 'App',
  components: {
    vertical,
    blank,
  },
  setup() {
    // Started on 25 June 2021
    console.info(
      `%c ▓▓▓▓█░ ▓▓▓▓▓▓   ▓▓▓▓▓▓  ░██▓██ ▒▓▒██▓   ░▓█████▓▓░  ▓▓▓▓▓▓░  ▒█▓▓▓█░  
▓█████ ▒██████▓ ▓██████  ▓██▓ █░▓▒▒███  ▓██████████  ███████ ░██████▓  
▓████▒ ▒██▓████▓██▓▓▓██  ████░ ▒░░▓ ▓█  ████▓   ▓█   ███▓███▓███▓███▓  
█████  ▒██▓████████▓▓██  █████      ██  ███▒█▒░      ██▓▓██████▓█▓███  
██▓██  ▓██▓██▒▒█▒███▓██░ ██▓ ▓░    ▓██    █ ▓████▒   ███▓██ █▓▓███▓██  
██▒ ▓  ▓███░░▓ ▓ ▓▒█▓██░ ███▓      ███     ░ █░▒███  ███▓ █ ▓ ▒▒▓████  
███    ▓████ ░ ░░ ░█▓██░ ▓████▓░  ▓███         ░███▒ ████▓ ░░░▒ ██▓██  
████   ▒█████     █████  ░███████████▓ ▓█▓▒    ▒███░ ███▓█▓    ▒████▓  
██████ ░███▒▒░   ░█████   ▒█████████▓   ████▓▒▓███▓  ███▓░▒    █████▒  
░▓▓▒▓▓  ▓▓▓▓░    ░▓▓▓▓▒     ▒▓▓██▓▓      ▒▓████▓▒    ▒▓▓▓▓     ▓▓▒▓▓   
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

    const theme = localStorage.getItem('theme');
    if (new Date().getHours() > 6 && new Date().getHours() < 18) {
      if (theme === 'light') localStorage.removeItem('theme');
      store.commit('sys/TOGGLE_THEME', theme || 'light');
    } else {
      if (theme === 'dark') localStorage.removeItem('theme');
      store.commit('sys/TOGGLE_THEME', theme || 'dark');
    }

    const locale = localStorage.getItem('locale') || navigator.language;
    store.commit('sys/TOGGLE_LANG', locale.toLowerCase());

    getSysInfo().then(({ code, data }) => {
      if (code === 200) {
        store.commit('sys/UPDATE_SYS_INFO', data);
        if (localStorage.getItem('accessToken')) getUserData();
      }
    });

    const { route, router } = useRouter();
    const moment = window.moment;

    window.onscroll = () => {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        document.getElementById('back-to-top').style.display = 'block';
      } else {
        document.getElementById('back-to-top').style.display = 'none';
        document.getElementById('back-to-top').classList.remove('active');
      }
    };

    const backToTop = () => {
      document.getElementById('back-to-top').classList.add('active');
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    onMounted(() => {
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
          const token = jwt.decode(localStorage.getItem('accessToken'));
          if (token && token.exp > Math.round(new Date() / 1000)) {
            if (!store.state.user.data.username || token.username === store.state.user.data.username) {
              if (route.value.name === 'login') {
                await getUserData();
                router.replace({ name: 'home' });
              }
            } else {
              router.go(0);
            }
          } else {
            if (route.value?.meta?.auth) {
              await clearUserData();
              router.replace({ name: 'login', query: { redirect: route.value.path } });
            }
          }
        }
      });

      window.addEventListener('resize', () => {
        if (store.state.sys.cfg.water_mark && store.state.user.data.id) setWatermark(`${store.state.user.data.username} - ${store.state.user.data.fullname}`, moment().format('ll'));
      });
    });

    onUnmounted(() => {
      document.removeEventListener('visibilitychange', () => {});
      window.removeEventListener('resize', () => {});
    });

    const resolveLayoutVariant = computed(() => {
      const layout = route.value.path == '/' || route.value.meta.layout === 'blank' ? 'blank' : 'vertical';
      document.documentElement.setAttribute('data-layout', layout);
      return layout;
    });

    sessionStorage.clear();

    return { backToTop, resolveLayoutVariant, isRouterAlive };
  },
};
</script>
