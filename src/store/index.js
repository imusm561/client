import { createStore } from 'vuex';
import sys from './modules/sys';
import org from './modules/org';
import user from './modules/user';

const store = createStore({
  modules: {
    sys,
    org,
    user,
  },
  strict: process.env.NODE_ENV !== 'production',
});

export default store;
