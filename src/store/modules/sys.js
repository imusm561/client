import i18n from '@utils/i18n';
export default {
  namespaced: true,
  state: {
    lang: 'en',
    theme: 'light',
    name: '',
    company: '',
    beian: '',
    cfg: {},
    var: {},
  },
  getters: {
    logo(state) {
      return `logo-${state.theme == 'light' ? 'dark' : 'light'}`;
    },
  },
  mutations: {
    TOGGLE_LANG(state, lang) {
      i18n.global.locale = lang;
      const moment = window.moment;
      moment.locale(lang);
      state.lang = lang;
      localStorage.setItem('locale', lang);
    },
    TOGGLE_THEME(state, theme) {
      state.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    },
    UPDATE_SYS_INFO(state, value) {
      state.name = value.sys.name;
      state.company = value.sys.company;
      state.beian = value.sys.beian;
      state.cfg = value.sys.cfg;
      state.var = value.var;
      if (value.sys.cfg?.amap?.map_key) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//webapi.amap.com/maps?v=2.0&key=${value.sys.cfg.amap.map_key}&plugin=AMap.AutoComplete,AMap.PlaceSearch,AMap.Geocoder,AMap.CitySearch`;
        document.querySelector('head').appendChild(script);
      }
    },
  },
  actions: {},
};
