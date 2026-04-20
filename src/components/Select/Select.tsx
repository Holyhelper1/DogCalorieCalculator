import { ChevronDown, Check } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  id?: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
};

export function Select({ id, label, options, value, onChange, hint }: Props) {
  const internalId = useId();
  const buttonId = id ?? internalId;
  const listId = `${buttonId}-listbox`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value) ?? options[0];

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

  return (
    <div className={styles.field} ref={containerRef}>
      <label className={styles.label} htmlFor={buttonId}>
        {label}
      </label>
      <button
        id={buttonId}
        className={styles.trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.triggerContent}>
          <span className={styles.triggerLabel}>{selectedOption.label}</span>
          {selectedOption.description ? (
            <span className={styles.triggerDescription}>{selectedOption.description}</span>
          ) : null}
        </span>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`.trim()} size={18} />
      </button>
      {hint ? <span className={styles.hint}>{hint}</span> : null}

      {isOpen ? (
        <div className={styles.popover}>
          <ul className={styles.listbox} id={listId} role="listbox" aria-labelledby={buttonId}>
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value}>
                  <button
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`.trim()}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <span className={styles.optionContent}>
                      <span className={styles.optionLabel}>{option.label}</span>
                      {option.description ? (
                        <span className={styles.optionDescription}>{option.description}</span>
                      ) : null}
                    </span>
                    {isSelected ? <Check size={16} /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
