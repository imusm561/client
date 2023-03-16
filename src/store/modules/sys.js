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
      localStorage.setItem('locale', state.lang);
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
      if (value.cfg?.amap?.map_key) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//webapi.amap.com/maps?v=2.0&key=${value.cfg.amap.map_key}&plugin=AMap.AutoComplete,AMap.PlaceSearch,AMap.Geocoder,AMap.CitySearch`;
        document.head.appendChild(script);
      }
    },
  },
  actions: {},
};
