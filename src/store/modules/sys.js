import i18n from '@utils/i18n';
import { decryptData } from '@utils';
export default {
  namespaced: true,
  state: {
    lang: 'en-us',
    theme: 'light',
    name: '',
    company: '',
    beian: '',
    key: '',
    cfg: {},
  },
  getters: {
    logo(state) {
      return `logo-${state.theme == 'light' ? 'dark' : 'light'}`;
    },
  },
  mutations: {
    TOGGLE_LANG(state, lang) {
      state.lang = ['en-us', 'zh-cn'].includes(lang) ? lang : 'en-us';
      i18n.global.locale = state.lang;
      const moment = window.moment;
      moment.locale(state.lang);
      localStorage.setItem(`${process.env.BASE_URL.replace(/\//g, '_')}locale`, state.lang);
    },
    TOGGLE_THEME(state, theme) {
      state.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    },
    UPDATE_SYS_INFO(state, value) {
      state.name = value.name;
      state.company = value.company;
      state.beian = value.beian;
      state.key = value.key;
      state.cfg = JSON.parse(decryptData(value.cfg));
      if (state.cfg.amap.js_code) {
        window._AMapSecurityConfig = {
          securityJsCode: state.cfg.amap.js_code,
        };
      }
    },
  },
  actions: {},
};
