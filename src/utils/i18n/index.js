import { createI18n } from 'vue-i18n/index';

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const dateTimeFormats = {
  'en-us': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  'zh-cn': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      // hour12: true,
    },
  },
};

const i18n = createI18n({
  // legacy: false,
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages: loadLocaleMessages(),
  dateTimeFormats,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});

i18n.global.te = (key) => {
  if (key) {
    const [err, opt] = key.split('|');
    return i18n.global.t(err, opt && JSON.parse(opt));
  }
};

export default i18n;
