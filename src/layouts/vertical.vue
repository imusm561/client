<template>
  <div id="layout-wrapper">
    <NavBar />

    <div>
      <div class="app-menu navbar-menu">
        <div class="navbar-brand-box">
          <router-link to="/" :class="['logo', logo]">
            <img
              class="sys-logo"
              :src="`${BASE_URL}static/img/logo/${logo}.png`"
              alt="logo"
              height="45"
            />
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

<script setup>
import { watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getListPath } from '@utils';
import NavBar from './navbar';
import Menu from './menu';
import Footer from './footer';
import store from '@store';

const { BASE_URL } = process.env;

const activeParentCollapseDiv = (element) => {
  let parentCollapseDiv = element.closest('.collapse.menu-dropdown');
  if (parentCollapseDiv) {
    parentCollapseDiv.classList.add('show');
    parentCollapseDiv.parentElement.children[0].classList.add('active');
    parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
    activeParentCollapseDiv(parentCollapseDiv.parentElement.children[0]);
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

    path = getListPath(path).replace('/', BASE_URL);
    let el = document.querySelector('#navbar-nav').querySelector('[href="' + path + '"]');
    if (el) {
      el.classList.add('active');
      activeParentCollapseDiv(el);
    }
  }
};

const onRoutechange = (route) => {
  activeMenu(route.path);
  document.getElementById('menu-overlay').click();
};

const route = useRoute();

onMounted(() => {
  document.getElementById('menu-overlay').addEventListener('click', () => {
    document.body.classList.remove('vertical-sidebar-enable');
  });

  onRoutechange(route);
});

watch(
  () => route,
  (value) => {
    onRoutechange(value);
  },
  { deep: true },
);

const logo = computed(() => {
  return store.getters['sys/logo'];
});

const menu = computed(() => {
  return store.getters['user/menu'];
});
</script>
