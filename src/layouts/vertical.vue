<template>
  <div id="layout-wrapper">
    <NavBar />

    <div>
      <div class="app-menu navbar-menu">
        <div class="navbar-brand-box">
          <router-link to="/" :class="['logo', logo]">
            <img :src="`/static/img/logo/${logo}.png`" alt="logo" height="45" />
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
    const handleMenuItemClick = (collapse) => {
      let parentCollapse = collapse.parentElement.closest('.collapse');
      if (parentCollapse) {
        let siblingCollapses = parentCollapse.querySelectorAll('.collapse');
        siblingCollapses.forEach((siblingCollapse) => {
          if (siblingCollapse.classList.contains('show')) {
            let aChild = siblingCollapse.parentNode.firstChild;
            if (aChild.hasAttribute('aria-expanded')) {
              aChild.setAttribute('aria-expanded', 'false');
            }
            siblingCollapse.classList.remove('show');
          }
        });
      } else {
        let getSiblings = (elem) => {
          let siblings = [];
          let sibling = elem.parentNode.firstChild;
          while (sibling) {
            if (sibling.nodeType === 1 && sibling !== elem) {
              siblings.push(sibling);
            }
            sibling = sibling.nextSibling;
          }
          return siblings;
        };
        let siblings = getSiblings(collapse.parentElement);
        siblings.forEach((item) => {
          if (item.childNodes.length > 2) item.firstElementChild.setAttribute('aria-expanded', 'false');
          let ids = item.querySelectorAll('*[id]');
          ids.forEach((id) => {
            let aChild = id.parentNode.firstChild;
            if (aChild.hasAttribute('aria-expanded')) {
              aChild.setAttribute('aria-expanded', 'false');
            }
            id.classList.remove('show');
            if (id.childNodes.length > 2) {
              let val = id.querySelectorAll('ul li a');
              val.forEach((subitem) => {
                if (subitem.hasAttribute('aria-expanded')) subitem.setAttribute('aria-expanded', 'false');
              });
            }
          });
        });
      }
    };

    const setMenuItemEvent = () => {
      let collapses = document.querySelectorAll('.navbar-nav .collapse');
      if (collapses)
        collapses.forEach((collapse) => {
          collapse.addEventListener('show.bs.collapse', (e) => {
            e.stopPropagation();
            handleMenuItemClick(collapse);
          });
        });
    };

    onMounted(() => {
      document.getElementById('menu-overlay').addEventListener('click', () => {
        document.body.classList.remove('vertical-sidebar-enable');
      });

      setMenuItemEvent();

      watch(
        () => menu,
        () => {
          setTimeout(() => {
            setMenuItemEvent();
          }, 500);
        },
        { immediate: true, deep: true },
      );

      watch(
        () => route,
        (route) => {
          onRoutechange(route.value);
        },
        { immediate: true, deep: true },
      );
    });

    const { route } = useRouter();

    const onRoutechange = (route) => {
      initActiveMenu(route.path);
      document.getElementById('menu-overlay').click();
      if (document.getElementsByClassName('active').length > 0) {
        const currentPosition = document.getElementsByClassName('active')[0].offsetTop;
        if (currentPosition > 500) if (this.$refs.isSimplebar) this.$refs.isSimplebar.value.getScrollElement().scrollTop = currentPosition + 300;
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

    const initActiveMenu = (path) => {
      if (document.querySelector('#navbar-nav')) {
        let actives = document.querySelectorAll('.navbar-nav .active');
        actives.forEach((active) => {
          active.classList.remove('active');
        });
        let collapses = document.querySelectorAll('.navbar-nav .collapse');
        collapses.forEach((collapse) => {
          handleMenuItemClick(collapse);
        });

        path = getListPath(path);
        let a = document.querySelector('#navbar-nav').querySelector('[href="' + path + '"]');
        if (a) {
          setTimeout(() => {
            a.classList.add('active');
          }, 0);
          activeParentCollapseDiv(a);
        }
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
