import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  // Carrega traduções usando http (public/locales/{{lng}}/{{ns}}.json)
  .use(HttpBackend)
  // Passa a instância i18n para react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    lng: 'pt-BR', // Idioma padrão fixo
    fallbackLng: 'pt-BR',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React já faz escape por padrão
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Namespaces
    ns: ['translation'],
    defaultNS: 'translation',

    // Reage a mudanças de idioma
    react: {
      useSuspense: false,
    },
  });

export default i18n;
