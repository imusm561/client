<template>
  <div id="layout-wrapper">
    <NavBar />

    <div>
      <div class="app-menu navbar-menu">
        <div class="navbar-brand-box">
          <router-link to="/" :class="['logo', logo]">
            <img :src="`${BASE_URL}static/img/logo/${logo}.png`" alt="logo" height="45" />
          </router-link>
        </div>
        <div data-simplebar class="h-100">
          <Menu :key="JSON.stringify(menu)" :items="menu"></Menu>
        </div>
      </div>
      <div class="menu-overlay" id="menu-overlay"></div>
    </div>

    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { watch, computed, onMounted } from 'vue';
import { useRouter, getListPath } from '@utils';
import NavBar from './navbar';
import Footer from './footer';
import store from '@store';
import Menu from './menu';
export default {
  components: {
    NavBar,
    Footer,
    Menu,
  },
  setup() {
    const { route } = useRouter();

    onMounted(() => {
      document.getElementById('menu-overlay').addEventListener('click', () => {
        document.body.classList.remove('vertical-sidebar-enable');
      });

      watch(
        () => route,
        (route) => {
          onRoutechange(route.value);
        },
        { immediate: true, deep: true },
      );
    });

    const onRoutechange = (route) => {
      activeMenu(route.path);
      document.getElementById('menu-overlay').click();
      if (document.getElementsByClassName('active').length > 0) {
        const currentPosition = document.getElementsByClassName('active')[0].offsetTop;
        if (currentPosition > 500)
          if (this.$refs.isSimplebar)
            this.$refs.isSimplebar.value.getScrollElement().scrollTop = currentPosition + 300;
      }
    };

    const activeMenu = (path) => {
      if (document.querySelector('#navbar-nav')) {
        let actives = document.querySelectorAll('.navbar-nav .active');
        actives.forEach((active) => {
          active.classList.remove('active');
        });
        let collapses = document.querySelectorAll('.navbar-nav .collapse');
        collapses.forEach((collapse) => {
          collapse.parentNode.firstChild.setAttribute('aria-expanded', 'false');
          collapse.classList.remove('show');
        });

        path = getListPath(path).replace('/', process.env.BASE_URL);
        let el = document.querySelector('#navbar-nav').querySelector('[href="' + path + '"]');
        if (el) {
          el.classList.add('active');
          activeParentCollapseDiv(el);
        }
      }
    };

    const activeParentCollapseDiv = (element) => {
      let parentCollapseDiv = element.closest('.collapse.menu-dropdown');
      if (parentCollapseDiv) {
        parentCollapseDiv.classList.add('show');
        parentCollapseDiv.parentElement.children[0].classList.add('active');
        parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
        activeParentCollapseDiv(parentCollapseDiv.parentElement.children[0]);
      }
    };

    const logo = computed(() => {
      return store.getters['sys/logo'];
    });

    const menu = computed(() => {
      return store.getters['user/menu'];
    });

    return {
      logo,
      menu,
    };
  },
};
</script>
