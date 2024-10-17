import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import DEFAULT_TRANSLATIONS from '../public/locales/en.json';

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = [
  "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "hu",
  "id", "it", "ja", "ko", "lt", "lv", "nb", "nl", "pl", "pt-BR", "pt-PT", "ro",
  "ru", "sk", "sl", "sv", "tr", "uk", "zh-HANS", "zh"
];

type SupportedLocale = typeof SUPPORTED_LOCALES[number];

type TranslationDictionary = {
  [key: SupportedLocale]: string;
};

const useTranslate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<SupportedLocale | null>(null);
  const [translations, setTranslations] = useState<TranslationDictionary>(DEFAULT_TRANSLATIONS);

  useEffect(() => {
    const currentLocale = pathname.split('/')[1] || DEFAULT_LOCALE;
    setLocale(currentLocale);

    const loadTranslations = async () => {
      try {
        const res = await fetch(`/locales/${currentLocale}.json`);
        const data = await res.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    if (currentLocale !== DEFAULT_LOCALE) {
      loadTranslations();
    }
  }, [pathname]);

  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[key] || key;

    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }

    return translation;
  };

  const changeLocale = (newLocale: string) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      const newPathname = `/${newLocale}${pathname.replace(/^\/[^\/]+/, '')}`;
      router.push(newPathname);
    } else {
      console.warn(`Unsupported locale: ${newLocale}`);
    }
  };

  return { t, locale, changeLocale, SUPPORTED_LOCALES };
};

export default useTranslate;
