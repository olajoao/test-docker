import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
  return useI18nTranslation();
}

export function useLanguage() {
  const { i18n } = useI18nTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('app_language', lng);
  };
  
  return {
    language: i18n.language,
    changeLanguage,
    availableLanguages: ['pt-BR', 'en'],
  };
}
