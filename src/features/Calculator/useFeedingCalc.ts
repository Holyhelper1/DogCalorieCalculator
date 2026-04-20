import { useState } from 'react';
import type { CalculatorFormState } from '../../types/calculator';
import { DEFAULT_CALORIES_PER_KILOGRAM, calculateDailyFood, isPositiveNumber } from '../../utils/calculator';

const INITIAL_STATE: CalculatorFormState = {
  breed: 'labrador',
  bodyCondition: 'ideal',
  age: 'puppy_0_3',
  activity: 'light_hour',
  weight: '',
  caloriesPerKilogram: String(DEFAULT_CALORIES_PER_KILOGRAM),
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
      form.age,
      form.activity,
    );
  })();

  function updateField<K extends keyof CalculatorFormState>(field: K, value: CalculatorFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function reset() {
    setForm(INITIAL_STATE);
    setSubmitted(false);
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
