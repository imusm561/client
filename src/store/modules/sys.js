import { decryptData } from '@utils';
import i18n from '@utils/i18n';
import moment from '@utils/moment';
const { BASE_URL } = process.env;

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
      return `logo-${state.theme == 'light' ? 'light' : 'dark'}`;
    },
  },
  mutations: {
    TOGGLE_LANG(state, value) {
      state.lang = value;
    },
    TOGGLE_THEME(state, value) {
      state.theme = value;
    },
    UPDATE_SYS_INFO(state, value) {
      for (let key in value) {
        state[key] = value[key];
      }
    },
  },
  actions: {
    toggleLang({ commit }, value) {
      const lang = ['en-us', 'zh-cn'].includes(value) ? value : 'en-us';
      commit('TOGGLE_LANG', lang);
      i18n.global.locale = lang;
      moment.locale(lang);
      localStorage.setItem(`${BASE_URL.replace(/\//g, '_')}locale`, lang);
    },
    toggleTheme({ commit }, value) {
      commit('TOGGLE_THEME', value);
      document.documentElement.setAttribute('data-theme', value);
    },
    updateSysInfo({ commit }, value) {
      value.cfg = JSON.parse(decryptData(value.cfg, value.public_key));
      commit('UPDATE_SYS_INFO', value);
      if (value.cfg.amapJsCode) {
        window._AMapSecurityConfig = {
          securityJsCode: value.cfg.amapJsCode,
        };
      }
    },
  },
};
