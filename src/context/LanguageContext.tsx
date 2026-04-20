import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import i18n from '../i18n';
import type { SupportedLanguage } from '../types/calculator';

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
};

const STORAGE_KEY = 'dog-food-calc-language';

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'ru';
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY);

  if (persisted === 'ru' || persisted === 'en') {
    return persisted;
  }

  return window.navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  useEffect(() => {
    void i18n.changeLanguage(language);
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setLanguageState,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
