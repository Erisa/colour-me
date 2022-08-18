import locale from 'i18next';

import translationEN from './locales/en-GB.json';
import translationENUS from './locales/en-US.json';

const resources = {
  'en-GB': {
    translation: translationEN
  },
  'en-US': {
    translation: translationENUS
  }
};

locale.init({
  fallbackLng: 'en-GB',
  lng: 'en-GB',
  preload: ['en-GB', 'en-US'],
  debug: false,
  resources
});

console.log(locale.t('colour-me', { lng: 'en-GB' }))

export { locale };
