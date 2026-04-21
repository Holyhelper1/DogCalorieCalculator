import { Activity, Dog, Flame, Gauge, PawPrint, Scale, Venus, Mars, VenusAndMars } from 'lucide-react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Select, type SelectOption } from '../../components/Select/Select';
import {
  BREEDS,
  ACTIVITY_FACTORS,
  DEFAULT_CALORIES_PER_KILOGRAM,
  formatWeightRange,
  getBreedProfile,
  getSuggestedWeightRange,
  getActivityFactorDescription,
} from '../../utils/calculator';
import { useFeedingCalc } from './useFeedingCalc';
import styles from './Calculator.module.css';

const BODY_CONDITIONS = ['underweight', 'ideal', 'overweight'] as const;



// Генерация опций для селекта активности
const ACTIVITY_OPTIONS: SelectOption[] = Object.keys(ACTIVITY_FACTORS).map((id) => ({
  value: id,
  label: id,
  description: `${ACTIVITY_FACTORS[id].toFixed(2)}x`,
}));

export function Calculator() {
  const { t } = useTranslation();
  const { form, isValid, reset, result, submit, submitted, updateField } = useFeedingCalc();

  const breed = getBreedProfile(form.breed);
  const suggestedWeight = getSuggestedWeightRange(
    form.breed,
    form.gender,
    form.bodyCondition
  );
  const activityFactor = ACTIVITY_FACTORS[form.activity] || 1.4;

  const suggestedWeightText = t('weightRangeValue', {
    value: formatWeightRange(suggestedWeight.min, suggestedWeight.max),
  });


  // Генерация опций для селекта возраста
const AGE_OPTIONS: SelectOption[] = [
  { value: 'puppy_0_3' },
  { value: 'puppy_3_6' },
  { value: 'junior_6_12' },
  { value: 'adult_1_2' },
  { value: 'senior_2_plus' },
].map((opt) => ({
  value: opt.value,
  label: t(`ageGroups.${opt.value}`),
  description: t(`ageDescription.${opt.value}`),
}));

  const breedOptions: SelectOption[] = BREEDS.map((item) => ({
    value: item.id,
    label: t(`breed.${item.id}`),
    description: t(`breedSize.${item.imageType}`),
  }));

  const conditionOptions: SelectOption[] = BODY_CONDITIONS.map((item) => ({
    value: item,
    label: t(`bodyCondition.${item}`),
    description: t(`bodyConditionHint.${item}`),
  }));

  const weightError = submitted && !form.weight ? t('validationMessage') : undefined;
  const caloriesError = submitted && !isValid && form.weight ? t('validationMessage') : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  return (
    <>
      <section className={styles.heroCard}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="hero-copy">{t('subtitle')}</p>

          <div className="hero-meta">
            <span className="chip">
              <PawPrint size={15} />
              {t(`breed.${breed.id}`)}
            </span>
            <span className="chip">
              <Scale size={15} />
              {suggestedWeightText}
            </span>
            <span className="chip">
              <Activity size={15} />
              {t(`activity.${form.activity}`)}
            </span>
            <span className="chip">
            {form.gender === 'male' ?  <Mars size={15} /> : <Venus size={15} />}
              {t(`gender.${form.gender}`)}
            </span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img alt={t(`breed.${breed.id}`)} className={styles.heroBreedImage} src={breed.image} />
        </div>
      </section>

      <section className={styles.layout}>
        <section className={styles.panel}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGrid}>
              <Select
                id="breed"
                label={t('breedLabel')}
                options={breedOptions}
                value={form.breed}
                hint={t('breedHint')}
                onChange={(value) => updateField('breed', value as typeof form.breed)}
              />

              <Select
                id="bodyCondition"
                label={t('bodyConditionLabel')}
                options={conditionOptions}
                value={form.bodyCondition}
                hint={t('weightRangeHint', { value: suggestedWeightText })}
                onChange={(value) => updateField('bodyCondition', value as typeof form.bodyCondition)}
              />

              <Select
                id="age"
                label={t('ageLabel')}
                options={AGE_OPTIONS.map(opt => ({
                  ...opt,
                  label: t(`ageGroups.${opt.value}`),
                }))}
                value={form.age}
                onChange={(value) => updateField('age', value as typeof form.age)}
              />

              <Select
                id="activity"
                label={t('activityLabel')}
                options={ACTIVITY_OPTIONS.map(opt => ({
                  ...opt,
                  label: t(`activity.${opt.value}`),
                  description: t(getActivityFactorDescription(opt.value as any)),
                }))}
                value={form.activity}
                hint={t(getActivityFactorDescription(form.activity))}
                onChange={(value) => updateField('activity', value as typeof form.activity)}
              />

              <div className={styles.genderField}>
                <span className={styles.label}>{t('genderLabel')}</span>
                <div className={styles.genderGroup}>
                  <label className={`${styles.genderOption} ${form.gender === 'male' ? styles.active : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === 'male'}
                      onChange={() => updateField('gender', 'male')}
                    />
                    <Mars size={18} />
                    <span>{t('gender.male')}</span>
                  </label>
                  <label className={`${styles.genderOption} ${form.gender === 'female' ? styles.active : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === 'female'}
                      onChange={() => updateField('gender', 'female')}
                    />
                    <Venus size={18} />
                    <span>{t('gender.female')}</span>
                  </label>
                </div>
                <p className={styles.hint}>{t('genderHint')}</p>
              </div>

              <Input
                id="weight"
                label={t('weightLabel')}
                type="number"
                min="0.1"
                step="0.1"
                inputMode="decimal"
                placeholder={t('weightPlaceholder')}
                value={form.weight}
                hint={t('weightInputHint', { value: suggestedWeightText })}
                onChange={(event) => updateField('weight', event.target.value)}
                error={weightError}
              />

              <Input
                id="calories"
                label={t('caloriesLabel')}
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder={t('caloriesPlaceholder')}
                value={form.caloriesPerKilogram}
                hint={t('caloriesHint')}
                onChange={(event) => updateField('caloriesPerKilogram', event.target.value)}
                error={caloriesError}
              />
            </div>

            <div className={styles.actions}>
              <Button type="submit">{t('calculateButton')}</Button>
              <Button type="button" variant="secondary" onClick={reset}>
                {t('resetButton')}
              </Button>
            </div>
          </form>
        </section>

        <section className={styles.resultCard} aria-live="polite">
          <div className={styles.resultHeader}>
            <p className="eyebrow">{t('resultEyebrow')}</p>
            <p className={styles.status}>{result ? t('resultDone') : t('resultReady')}</p>
          </div>

          <div className={styles.resultMain}>
            <p className={styles.grams}>
              {result ? t('gramsPerDay', { value: result.dailyFoodGrams.toFixed(0) }) : '0 г'}
            </p>
            <p className={styles.caption}>{t('resultCaption')}</p>
          </div>

          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                <Flame size={16} />
                {t('energyLabel')}
              </span>
              <strong className={styles.statValue}>
                {result ? t('kcalPerDay', { value: result.caloricNeeds.toFixed(0) }) : '0 ккал'}
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                <Gauge size={16} />
                {t('densityLabel')}
              </span>
              <strong className={styles.statValue}>
                {result
                  ? t('kcalPer100g', { value: result.foodDensityPer100g.toFixed(0) })
                  : t('kcalPer100g', {
                      value: (DEFAULT_CALORIES_PER_KILOGRAM / 10).toFixed(0),
                    })}
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                <Dog size={16} />
                {t('formulaLabel')}
              </span>
              <strong className={styles.statValue}>
                {result ? t(`formula.${result.formulaKey}`) : t('formulaPending')}
              </strong>
            </article>
          </div>

          <div className={styles.detailsCard}>
            <p className={styles.detailsTitle}>{t('detailsTitle')}</p>
            <div className={styles.detailsRows}>
              <div className={styles.detailRow}>
                <span>{t('selectedBreedLabel')}</span>
                <strong>{t(`breed.${breed.id}`)}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>{t('recommendedWeightLabel')}</span>
                <strong>{suggestedWeightText}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>{t('weightForCalculation')}</span>
                <strong>
                  {result ? t('weightRangeValue', { value: result.calculationWeight.toFixed(1) }) : '—'}
                </strong>
              </div>
              <div className={styles.detailRow}>
                <span>{t('activityMultiplierLabel')}</span>
                <strong>{activityFactor.toFixed(2)}x</strong>
              </div>
              <div className={styles.detailRow}>
                <span>{t('baseCaloriesLabel')}</span>
                <strong>
                  {result ? t('kcalPerDay', { value: result.baseCalories.toFixed(0) }) : '0 ккал'}
                </strong>
              </div>
              <div className={styles.detailRow}>
                <span>{t('genderLabel')}</span>
                <strong>{t(`gender.${form.gender}`)}</strong>
              </div>
            </div>
          </div>

          <p className={styles.note}>
            {isValid || !submitted ? t('noteDefault') : t('validationMessage')}
            <br />
            {form.bodyCondition !== 'ideal' && isValid
              ? ` ${t('bodyConditionFormulaNote')}`
              : ''}
          </p>
        </section>
      </section>
    </>
  );
}






// import { Activity, Dog, Flame, Gauge, PawPrint, Scale } from 'lucide-react';
// import type { FormEvent } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Button } from '../../components/Button/Button';
// import { Input } from '../../components/Input/Input';
// import { Select, type SelectOption } from '../../components/Select/Select';
// import {
//   ACTIVITY_LEVELS,
//   AGE_GROUPS,
//   BREEDS,
//   DEFAULT_CALORIES_PER_KILOGRAM,
//   formatWeightRange,
//   getActivityLevel,
//   getBreedProfile,
//   getCalculationWeight,
//   getSuggestedWeightRange,
// } from '../../utils/calculator';
// import { useFeedingCalc } from './useFeedingCalc';
// import styles from './Calculator.module.css';

// const BODY_CONDITIONS = ['underweight', 'ideal', 'overweight'] as const;

// export function Calculator() {
//   const { t } = useTranslation();
//   const { form, isValid, reset, result, submit, submitted, updateField } = useFeedingCalc();

//   const breed = getBreedProfile(form.breed);
//   const suggestedWeight = getSuggestedWeightRange(form.breed, form.bodyCondition);
//   const selectedActivity = getActivityLevel(form.activity);

//   const calculationWeight = isValid
//     ? getCalculationWeight(Number(form.weight), form.breed, form.bodyCondition)
//     : null;

//   const suggestedWeightText = t('weightRangeValue', {
//     value: formatWeightRange(suggestedWeight.min, suggestedWeight.max),
//   });

//   const breedOptions: SelectOption[] = BREEDS.map((item) => ({
//     value: item.id,
//     label: t(`breed.${item.id}`),
//     description: t(`breedSize.${item.imageType}`),
//   }));

//   const conditionOptions: SelectOption[] = BODY_CONDITIONS.map((item) => ({
//     value: item,
//     label: t(`bodyCondition.${item}`),
//     description: t(`bodyConditionHint.${item}`),
//   }));

//   const ageOptions: SelectOption[] = AGE_GROUPS.map((group) => ({
//     value: group.id,
//     label: t(`ageGroups.${group.id}`),
//     description: group.usesPuppyFormula ? t('formulaPuppyShort') : t('formulaAdultShort'),
//   }));

//   const activityOptions: SelectOption[] = ACTIVITY_LEVELS.map((level) => ({
//     value: level.id,
//     label: t(`activity.${level.id}`),
//     description: `${level.factor.toFixed(2)}x`,
//   }));

//   const weightError = submitted && !form.weight ? t('validationMessage') : undefined;
//   const caloriesError = submitted && !isValid && form.weight ? t('validationMessage') : undefined;

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     submit();
//   }

//   return (
//     <>
//       <section className={styles.heroCard}>
//         <div className={styles.heroCopy}>
//           <p className="eyebrow">{t('eyebrow')}</p>
//           <h1>{t('title')}</h1>
//           <p className="hero-copy">{t('subtitle')}</p>

//           <div className="hero-meta">
//             <span className="chip">
//               <PawPrint size={15} />
//               {t(`breed.${breed.id}`)}
//             </span>
//             <span className="chip">
//               <Scale size={15} />
//               {suggestedWeightText}
//             </span>
//             <span className="chip">
//               <Activity size={15} />
//               {t(`activity.${form.activity}`)}
//             </span>
//           </div>
//         </div>

//         <div className={styles.heroVisual}>
//           <img alt={t(`breed.${breed.id}`)} className={styles.heroBreedImage} src={breed.image} />
//         </div>
//       </section>

//       <section className={styles.layout}>
//         <section className={styles.panel}>
//           <form onSubmit={handleSubmit} noValidate>
//             <div className={styles.fieldGrid}>
//               <Select
//                 id="breed"
//                 label={t('breedLabel')}
//                 options={breedOptions}
//                 value={form.breed}
//                 hint={t('breedHint')}
//                 onChange={(value) => updateField('breed', value as typeof form.breed)}
//               />

//               <Select
//                 id="bodyCondition"
//                 label={t('bodyConditionLabel')}
//                 options={conditionOptions}
//                 value={form.bodyCondition}
//                 hint={t('weightRangeHint', { value: suggestedWeightText })}
//                 onChange={(value) => updateField('bodyCondition', value as typeof form.bodyCondition)}
//               />

//               <Select
//                 id="age"
//                 label={t('ageLabel')}
//                 options={ageOptions}
//                 value={form.age}
//                 onChange={(value) => updateField('age', value as typeof form.age)}
//               />

//               <Select
//                 id="activity"
//                 label={t('activityLabel')}
//                 options={activityOptions}
//                 value={form.activity}
//                 hint={t(selectedActivity.descriptionKey)}
//                 onChange={(value) => updateField('activity', value as typeof form.activity)}
//               />

//               <Input
//                 id="weight"
//                 label={t('weightLabel')}
//                 type="number"
//                 min="0.1"
//                 step="0.1"
//                 inputMode="decimal"
//                 placeholder={t('weightPlaceholder')}
//                 value={form.weight}
//                 hint={t('weightInputHint', { value: suggestedWeightText })}
//                 onChange={(event) => updateField('weight', event.target.value)}
//                 error={weightError}
//               />

//               <Input
//                 id="calories"
//                 label={t('caloriesLabel')}
//                 type="number"
//                 min="1"
//                 step="1"
//                 inputMode="numeric"
//                 placeholder={t('caloriesPlaceholder')}
//                 value={form.caloriesPerKilogram}
//                 hint={t('caloriesHint')}
//                 onChange={(event) => updateField('caloriesPerKilogram', event.target.value)}
//                 error={caloriesError}
//               />
//             </div>

//             <div className={styles.actions}>
//               <Button type="submit">{t('calculateButton')}</Button>
//               <Button type="button" variant="secondary" onClick={reset}>
//                 {t('resetButton')}
//               </Button>
//             </div>
//           </form>
//         </section>

//         <section className={styles.resultCard} aria-live="polite">
//           <div className={styles.resultHeader}>
//             <p className="eyebrow">{t('resultEyebrow')}</p>
//             <p className={styles.status}>{result ? t('resultDone') : t('resultReady')}</p>
//           </div>

//           <div className={styles.resultMain}>
//             <p className={styles.grams}>
//               {result ? t('gramsPerDay', { value: result.dailyFoodGrams.toFixed(0) }) : '0 г'}
//             </p>
//             <p className={styles.caption}>{t('resultCaption')}</p>
//           </div>

//           <div className={styles.statsGrid}>
//             <article className={styles.statCard}>
//               <span className={styles.statLabel}>
//                 <Flame size={16} />
//                 {t('energyLabel')}
//               </span>
//               <strong className={styles.statValue}>
//                 {result ? t('kcalPerDay', { value: result.caloricNeeds.toFixed(0) }) : '0 ккал'}
//               </strong>
//             </article>

//             <article className={styles.statCard}>
//               <span className={styles.statLabel}>
//                 <Gauge size={16} />
//                 {t('densityLabel')}
//               </span>
//               <strong className={styles.statValue}>
//                 {result
//                   ? t('kcalPer100g', { value: result.foodDensityPer100g.toFixed(0) })
//                   : t('kcalPer100g', {
//                       value: (DEFAULT_CALORIES_PER_KILOGRAM / 10).toFixed(0),
//                     })}
//               </strong>
//             </article>

//             <article className={styles.statCard}>
//               <span className={styles.statLabel}>
//                 <Dog size={16} />
//                 {t('formulaLabel')}
//               </span>
//               <strong className={styles.statValue}>
//                 {result ? t(`formula.${result.formulaKey}`) : t('formulaPending')}
//               </strong>
//             </article>
//           </div>

//           <div className={styles.detailsCard}>
//             <p className={styles.detailsTitle}>{t('detailsTitle')}</p>
//             <div className={styles.detailsRows}>
//               <div className={styles.detailRow}>
//                 <span>{t('selectedBreedLabel')}</span>
//                 <strong>{t(`breed.${breed.id}`)}</strong>
//               </div>
//               <div className={styles.detailRow}>
//                 <span>{t('recommendedWeightLabel')}</span>
//                 <strong>{suggestedWeightText}</strong>
//               </div>
//               <div className={styles.detailRow}>
//                 <span>{t('weightForCalculation')}</span>
//                 <strong>
//                   {result ? t('weightRangeValue', { value: result.calculationWeight.toFixed(1) }) : '—'}
//                 </strong>
//               </div>
//               <div className={styles.detailRow}>
//                 <span>{t('activityMultiplierLabel')}</span>
//                 <strong>{selectedActivity.factor.toFixed(2)}x</strong>
//               </div>
//               <div className={styles.detailRow}>
//                 <span>{t('baseCaloriesLabel')}</span>
//                 <strong>
//                   {result ? t('kcalPerDay', { value: result.baseCalories.toFixed(0) }) : '0 ккал'}
//                 </strong>
//               </div>
//             </div>
//           </div>

//           <p className={styles.note}>
//             {isValid || !submitted ? t('noteDefault') : t('validationMessage')}
//             <br />
//             {form.bodyCondition !== 'ideal' && isValid
//               ? ` ${t('bodyConditionFormulaNote')}`
//               : ''}
//           </p>
//         </section>
//       </section>
//     </>
//   );
// }
