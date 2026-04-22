import { ChevronDown, Check, Search } from 'lucide-react';
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
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function Select({
  id,
  label,
  options,
  value,
  onChange,
  hint,
  searchable = false,
  searchPlaceholder = 'Поиск...',
}: Props) {
  const internalId = useId();
  const buttonId = id ?? internalId;
  const listId = `${buttonId}-listbox`;
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  // Фильтрация опций
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Закрытие по клику вне или Esc
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Фокус на поиск при открытии
  useEffect(() => {
    if (isOpen && searchable) {
      // Небольшая задержка, чтобы анимация (если будет) не мешала фокусу
      const timer = setTimeout(() => searchInputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  return (
    <div className={styles.field} ref={containerRef}>
      <label className={styles.label} htmlFor={buttonId}>
        {label}
      </label>
      
      <button
        id={buttonId}
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.triggerContent}>
          <span className={styles.triggerLabel}>{selectedOption.label}</span>
          {selectedOption.description && (
            <span className={styles.triggerDescription}>{selectedOption.description}</span>
          )}
        </span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          size={20}
        />
      </button>

      {hint && <span className={styles.hint}>{hint}</span>}

      {isOpen && (
        <div className={styles.popover}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                autoComplete="off"
                spellCheck="false"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()} // чтобы Esc в инпуте работал корректно
              />
            </div>
          )}
          
          <ul 
            className={styles.listbox} 
            id={listId} 
            role="listbox" 
            aria-labelledby={buttonId}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value} role="none">
                    <button
                      className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <span className={styles.optionContent}>
                        <span className={styles.optionLabel}>{option.label}</span>
                        {option.description && (
                          <span className={styles.optionDescription}>{option.description}</span>
                        )}
                      </span>
                      {isSelected && <Check size={18} className={styles.checkIcon} />}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className={styles.noResults}>Ничего не найдено</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}














// import { ChevronDown, Check, Search } from 'lucide-react';
// import { useEffect, useId, useRef, useState } from 'react';
// import styles from './Select.module.css';

// export type SelectOption = {
//   value: string;
//   label: string;
//   description?: string;
// };

// type Props = {
//   id?: string;
//   label: string;
//   options: SelectOption[];
//   value: string;
//   onChange: (value: string) => void;
//   hint?: string;
//   searchable?: boolean;
//   searchPlaceholder?: string;
// };

// export function Select({
//   id,
//   label,
//   options,
//   value,
//   onChange,
//   hint,
//   searchable = false,
//   searchPlaceholder = 'Поиск...',
// }: Props) {
//   const internalId = useId();
//   const buttonId = id ?? internalId;
//   const listId = `${buttonId}-listbox`;
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const searchInputRef = useRef<HTMLInputElement | null>(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const selectedOption = options.find((option) => option.value === value) ?? options[0];

//   // Фильтрация опций при поиске
//   const filteredOptions = searchable
//     ? options.filter((opt) =>
//         opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : options;

//   useEffect(() => {
//     function handlePointerDown(event: MouseEvent) {
//       if (!containerRef.current?.contains(event.target as Node)) {
//         setIsOpen(false);
//         setSearchQuery(''); // сброс поиска при закрытии
//       }
//     }

//     function handleEscape(event: KeyboardEvent) {
//       if (event.key === 'Escape') {
//         setIsOpen(false);
//         setSearchQuery('');
//       }
//     }

//     document.addEventListener('mousedown', handlePointerDown);
//     document.addEventListener('keydown', handleEscape);

//     return () => {
//       document.removeEventListener('mousedown', handlePointerDown);
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, []);

//   // При открытии фокус на поиск, если он есть
//   useEffect(() => {
//     if (isOpen && searchable && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isOpen, searchable]);

//   return (
//     <div className={styles.field} ref={containerRef}>
//       <label className={styles.label} htmlFor={buttonId}>
//         {label}
//       </label>
//       <button
//         id={buttonId}
//         className={styles.trigger}
//         type="button"
//         aria-haspopup="listbox"
//         aria-expanded={isOpen}
//         aria-controls={listId}
//         onClick={() => setIsOpen((open) => !open)}
//       >
//         <span className={styles.triggerContent}>
//           <span className={styles.triggerLabel}>{selectedOption.label}</span>
//           {selectedOption.description ? (
//             <span className={styles.triggerDescription}>{selectedOption.description}</span>
//           ) : null}
//         </span>
//         <ChevronDown
//           className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`.trim()}
//           size={18}
//         />
//       </button>
//       {hint ? <span className={styles.hint}>{hint}</span> : null}

//       {isOpen ? (
//         <div className={styles.popover}>
//           {searchable && (
//             <div className={styles.searchWrapper}>
//               <Search size={16} className={styles.searchIcon} />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 className={styles.searchInput}
//                 placeholder={searchPlaceholder}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onClick={(e) => e.stopPropagation()} // чтобы не закрывать popover
//               />
//             </div>
//           )}
//           <ul className={styles.listbox} id={listId} role="listbox" aria-labelledby={buttonId}>
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => {
//                 const isSelected = option.value === value;
//                 return (
//                   <li key={option.value}>
//                     <button
//                       className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`.trim()}
//                       type="button"
//                       role="option"
//                       aria-selected={isSelected}
//                       onClick={() => {
//                         onChange(option.value);
//                         setIsOpen(false);
//                         setSearchQuery('');
//                       }}
//                     >
//                       <span className={styles.optionContent}>
//                         <span className={styles.optionLabel}>{option.label}</span>
//                         {option.description ? (
//                           <span className={styles.optionDescription}>{option.description}</span>
//                         ) : null}
//                       </span>
//                       {isSelected ? <Check size={16} /> : null}
//                     </button>
//                   </li>
//                 );
//               })
//             ) : (
//               <li className={styles.noResults}>Ничего не найдено</li>
//             )}
//           </ul>
//         </div>
//       ) : null}
//     </div>
//   );
// }













// import { ChevronDown, Check } from 'lucide-react';
// import { useEffect, useId, useRef, useState } from 'react';
// import styles from './Select.module.css';

// export type SelectOption = {
//   value: string;
//   label: string;
//   description?: string;
// };

// type Props = {
//   id?: string;
//   label: string;
//   options: SelectOption[];
//   value: string;
//   onChange: (value: string) => void;
//   hint?: string;
// };

// export function Select({ id, label, options, value, onChange, hint }: Props) {
//   const internalId = useId();
//   const buttonId = id ?? internalId;
//   const listId = `${buttonId}-listbox`;
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   const selectedOption = options.find((option) => option.value === value) ?? options[0];

//   useEffect(() => {
//     function handlePointerDown(event: MouseEvent) {
//       if (!containerRef.current?.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     function handleEscape(event: KeyboardEvent) {
//       if (event.key === 'Escape') {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener('mousedown', handlePointerDown);
//     document.addEventListener('keydown', handleEscape);

//     return () => {
//       document.removeEventListener('mousedown', handlePointerDown);
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, []);

//   return (
//     <div className={styles.field} ref={containerRef}>
//       <label className={styles.label} htmlFor={buttonId}>
//         {label}
//       </label>
//       <button
//         id={buttonId}
//         className={styles.trigger}
//         type="button"
//         aria-haspopup="listbox"
//         aria-expanded={isOpen}
//         aria-controls={listId}
//         onClick={() => setIsOpen((open) => !open)}
//       >
//         <span className={styles.triggerContent}>
//           <span className={styles.triggerLabel}>{selectedOption.label}</span>
//           {selectedOption.description ? (
//             <span className={styles.triggerDescription}>{selectedOption.description}</span>
//           ) : null}
//         </span>
//         <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`.trim()} size={18} />
//       </button>
//       {hint ? <span className={styles.hint}>{hint}</span> : null}

//       {isOpen ? (
//         <div className={styles.popover}>
//           <ul className={styles.listbox} id={listId} role="listbox" aria-labelledby={buttonId}>
//             {options.map((option) => {
//               const isSelected = option.value === value;

//               return (
//                 <li key={option.value}>
//                   <button
//                     className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`.trim()}
//                     type="button"
//                     role="option"
//                     aria-selected={isSelected}
//                     onClick={() => {
//                       onChange(option.value);
//                       setIsOpen(false);
//                     }}
//                   >
//                     <span className={styles.optionContent}>
//                       <span className={styles.optionLabel}>{option.label}</span>
//                       {option.description ? (
//                         <span className={styles.optionDescription}>{option.description}</span>
//                       ) : null}
//                     </span>
//                     {isSelected ? <Check size={16} /> : null}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       ) : null}
//     </div>
//   );
// }
