import { Globe, Menu, MonitorCog, MoonStar, SunMedium } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { SupportedLanguage, ThemeMode } from '../../types/calculator';
import styles from './SettingsMenu.module.css';

const LANGUAGE_OPTIONS: SupportedLanguage[] = ['ru', 'en'];
const THEME_OPTIONS: ThemeMode[] = ['system', 'light', 'dark'];

export function SettingsMenu() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function renderThemeIcon(themeMode: ThemeMode) {
    if (themeMode === 'light') {
      return <SunMedium size={16} />;
    }

    if (themeMode === 'dark') {
      return <MoonStar size={16} />;
    }

    return <MonitorCog size={16} />;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        type="button"
        aria-expanded={isOpen}
        aria-label={t('settingsMenu')}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Menu size={18} />
      </button>

      {isOpen ? (
        <section className={styles.menu}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <Globe size={16} />
              <span>{t('languageTitle')}</span>
            </div>
            <div className={styles.segmented}>
              {LANGUAGE_OPTIONS.map((item) => (
                <button
                  key={item}
                  className={`${styles.segment} ${language === item ? styles.segmentActive : ''}`.trim()}
                  type="button"
                  onClick={() => setLanguage(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <MonitorCog size={16} />
              <span>{t('themeTitle')}</span>
            </div>
            <div className={styles.stack}>
              {THEME_OPTIONS.map((item) => (
                <button
                  key={item}
                  className={`${styles.rowButton} ${mode === item ? styles.rowButtonActive : ''}`.trim()}
                  type="button"
                  onClick={() => setMode(item)}
                >
                  <span className={styles.rowButtonStart}>
                    {renderThemeIcon(item)}
                    {t(`theme.${item}`)}
                  </span>
                  <span className={styles.rowButtonMeta}>{t(`themeHint.${item}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
