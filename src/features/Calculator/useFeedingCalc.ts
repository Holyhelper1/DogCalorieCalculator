import { useState, useEffect } from 'react';
import type { CalculatorFormState } from '../../types/calculator';
import {
  DEFAULT_CALORIES_PER_KILOGRAM,
  calculateDailyFood,
  isPositiveNumber,
} from '../../utils/calculator';

const STORAGE_KEY = 'dogFeedingCalcPrefs';

// Загрузка сохранённых предпочтений
function loadSavedPrefs(): Partial<CalculatorFormState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load preferences from localStorage', e);
  }
  return {};
}

// Сохранение предпочтений
function savePrefs(prefs: Partial<CalculatorFormState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save preferences to localStorage', e);
  }
}

const DEFAULT_STATE: CalculatorFormState = {
  breed: 'labrador',
  bodyCondition: 'ideal',
  age: 'puppy_0_3',
  activity: 'light_hour',
  weight: '',
  caloriesPerKilogram: String(DEFAULT_CALORIES_PER_KILOGRAM),
  gender: 'male',
};

const INITIAL_STATE: CalculatorFormState = {
  ...DEFAULT_STATE,
  ...loadSavedPrefs(),
};

export function useFeedingCalc() {
  const [form, setForm] = useState<CalculatorFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  const isValid = isPositiveNumber(form.weight) && isPositiveNumber(form.caloriesPerKilogram);

  const result = (() => {
    if (!isValid) {
      return null;
    }

    return calculateDailyFood(
      Number(form.weight),
      Number(form.caloriesPerKilogram),
      form.breed,
      form.bodyCondition,
      form.age,
      form.activity,
      form.gender,
    );
  })();

  function updateField<K extends keyof CalculatorFormState>(field: K, value: CalculatorFormState[K]) {
    setForm((current) => {
      const updated = { ...current, [field]: value };
      
      // Сохраняем только ключевые настройки (порода, пол, возраст, активность, кондиция)
      const prefsToSave: Partial<CalculatorFormState> = {
        breed: updated.breed,
        gender: updated.gender,
        age: updated.age,
        activity: updated.activity,
        bodyCondition: updated.bodyCondition,
      };
      savePrefs(prefsToSave);
      
      return updated;
    });
  }

  function reset() {
    setForm(INITIAL_STATE);
    setSubmitted(false);
    // При сбросе тоже сохраняем дефолтные значения
    savePrefs({
      breed: INITIAL_STATE.breed,
      gender: INITIAL_STATE.gender,
      age: INITIAL_STATE.age,
      activity: INITIAL_STATE.activity,
      bodyCondition: INITIAL_STATE.bodyCondition,
    });
  }

  function submit() {
    setSubmitted(true);
  }

  return {
    form,
    result,
    isValid,
    submitted,
    updateField,
    reset,
    submit,
  };
}


// import { useState } from 'react';
// import type { CalculatorFormState } from '../../types/calculator';
// import {
//   DEFAULT_CALORIES_PER_KILOGRAM,
//   calculateDailyFood,
//   isPositiveNumber,
// } from '../../utils/calculator';

// const INITIAL_STATE: CalculatorFormState = {
//   breed: 'labrador',
//   bodyCondition: 'ideal',
//   age: 'puppy_0_3',
//   activity: 'light_hour',
//   weight: '',
//   caloriesPerKilogram: String(DEFAULT_CALORIES_PER_KILOGRAM),
// };

// export function useFeedingCalc() {
//   const [form, setForm] = useState<CalculatorFormState>(INITIAL_STATE);
//   const [submitted, setSubmitted] = useState(false);

//   const isValid = isPositiveNumber(form.weight) && isPositiveNumber(form.caloriesPerKilogram);

//   const result = (() => {
//     if (!isValid) {
//       return null;
//     }

//     return calculateDailyFood(
//       Number(form.weight),
//       Number(form.caloriesPerKilogram),
//       form.breed,
//       form.bodyCondition,
//       form.age,
//       form.activity,
//     );
//   })();

//   function updateField<K extends keyof CalculatorFormState>(field: K, value: CalculatorFormState[K]) {
//     setForm((current) => ({
//       ...current,
//       [field]: value,
//     }));
//   }

//   function reset() {
//     setForm(INITIAL_STATE);
//     setSubmitted(false);
//   }

//   function submit() {
//     setSubmitted(true);
//   }

//   return {
//     form,
//     result,
//     isValid,
//     submitted,
//     updateField,
//     reset,
//     submit,
//   };
// }

