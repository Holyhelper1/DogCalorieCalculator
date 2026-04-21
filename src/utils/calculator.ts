import type {
  ActivityLevelId,
  AgeGroupId,
  BodyConditionId,
  BreedId,
  CalculationResult,
} from "../types/calculator";

import chihuahuaImage from "../assets/Breed/chihuahua.webp";
import dachshundImage from "../assets/Breed/dachshund.webp";
import frenchBulldogImage from "../assets/Breed/french_bulldog.webp";
import shibaInuImage from "../assets/Breed/shiba_inu.webp";
import cardiganCorgiImage from "../assets/Breed/cardigan_corgi.webp";
import germanShepherdImage from "../assets/Breed/german_shepherd.webp";
import goldenRetrieverImage from "../assets/Breed/golden_retriever.webp";
import huskyImage from "../assets/Breed/husky.webp";
import jackRussellImage from "../assets/Breed/jack_russell.webp";
import labradorImage from "../assets/Breed/labrador.webp";
import pomeranianImage from "../assets/Breed/pomeranian.webp";
import corgiImage from "../assets/Breed/welsh_corgi.webp";

export const DEFAULT_CALORIES_PER_KILOGRAM = 4200;

// ==================== КОНСТАНТЫ FEDIAF ====================
export const ACTIVITY_FACTORS: Record<string, number> = {
  couch: 1.2, // Стерилизованные / малоподвижные
  light_hour: 1.4, // Обычная домашняя собака (1 час прогулок)
  light_day: 1.6, // Активная (2+ часа прогулок)
  heavy_work: 3.0, // Рабочие / спортивные
  puppy_active: 2.5, // Щенки в активной фазе роста
  senior: 1.2, // Пожилые
  nursing: 2.5, // Кормящие суки
  outdoor_cold: 1.25, // Содержание на улице в прохладную погоду
  outdoor_freezing: 1.75, // На улице в мороз
  outdoor_hot: 2.5, // На улице в жару
};

export const PUPPY_FACTORS: Record<AgeGroupId, number> = {
  puppy_0_3: 2.5,
  puppy_3_6: 2.1,
  junior_6_12: 1.8,
  adult_1_2: 1.0, // взрослые — не используем
  senior_2_plus: 1.0,
};

// ==================== ПОРОДЫ С УЧЁТОМ ПОЛА ====================
export interface BreedProfileWithGender {
  id: BreedId;
  minWeightMale: number;
  maxWeightMale: number;
  minWeightFemale: number;
  maxWeightFemale: number;
  image: string;
  imageType: "small" | "medium" | "large";
}

export const BREEDS: BreedProfileWithGender[] = [
  {
    id: "labrador",
    minWeightMale: 29,
    maxWeightMale: 36,
    minWeightFemale: 25,
    maxWeightFemale: 32,
    image: labradorImage,
    imageType: "large",
  },
  {
    id: "german_shepherd",
    minWeightMale: 30,
    maxWeightMale: 40,
    minWeightFemale: 22,
    maxWeightFemale: 32,
    image: germanShepherdImage,
    imageType: "large",
  },
  {
    id: "golden_retriever",
    minWeightMale: 29,
    maxWeightMale: 34,
    minWeightFemale: 25,
    maxWeightFemale: 32,
    image: goldenRetrieverImage,
    imageType: "large",
  },
  {
    id: "husky",
    minWeightMale: 20,
    maxWeightMale: 27,
    minWeightFemale: 16,
    maxWeightFemale: 23,
    image: huskyImage,
    imageType: "large",
  },
  {
    id: "french_bulldog",
    minWeightMale: 10,
    maxWeightMale: 14,
    minWeightFemale: 9,
    maxWeightFemale: 13,
    image: frenchBulldogImage,
    imageType: "medium",
  },
  {
    id: "shiba_inu",
    minWeightMale: 9,
    maxWeightMale: 11,
    minWeightFemale: 7,
    maxWeightFemale: 9,
    image: shibaInuImage,
    imageType: "medium",
  },
  {
    id: "cardigan_corgi",
    minWeightMale: 13,
    maxWeightMale: 17,
    minWeightFemale: 11,
    maxWeightFemale: 15,
    image: cardiganCorgiImage,
    imageType: "medium",
  },
  {
    id: "corgi",
    minWeightMale: 12,
    maxWeightMale: 14,
    minWeightFemale: 10,
    maxWeightFemale: 12,
    image: corgiImage,
    imageType: "medium",
  },
  {
    id: "dachshund",
    minWeightMale: 7,
    maxWeightMale: 15,
    minWeightFemale: 7,
    maxWeightFemale: 12,
    image: dachshundImage,
    imageType: "medium",
  },
  {
    id: "jack_russell",
    minWeightMale: 6,
    maxWeightMale: 8,
    minWeightFemale: 5,
    maxWeightFemale: 7,
    image: jackRussellImage,
    imageType: "small",
  },
  {
    id: "chihuahua",
    minWeightMale: 1.8,
    maxWeightMale: 3,
    minWeightFemale: 1.5,
    maxWeightFemale: 2.5,
    image: chihuahuaImage,
    imageType: "small",
  },
  {
    id: "pomeranian",
    minWeightMale: 1.8,
    maxWeightMale: 3.5,
    minWeightFemale: 1.5,
    maxWeightFemale: 3,
    image: pomeranianImage,
    imageType: "small",
  },
];

// ==================== УТИЛИТЫ ====================

export function getBreedProfile(breedId: BreedId): BreedProfileWithGender {
  return BREEDS.find((b) => b.id === breedId) ?? BREEDS[0];
}

/**
 * Идеальный вес породы с учётом пола (среднее арифметическое от нормы)
 */
export function getIdealWeight(
  breedId: BreedId,
  gender: "male" | "female",
): number {
  const breed = getBreedProfile(breedId);
  if (gender === "male") {
    return (breed.minWeightMale + breed.maxWeightMale) / 2;
  }
  return (breed.minWeightFemale + breed.maxWeightFemale) / 2;
}

/**
 * Рекомендованный диапазон веса для конкретной собаки (с учётом пола и кондиции)
 */
export function getSuggestedWeightRange(
  breedId: BreedId,
  gender: "male" | "female",
  conditionId: BodyConditionId,
): { min: number; max: number } {
  const breed = getBreedProfile(breedId);
  let minNorm, maxNorm;
  if (gender === "male") {
    minNorm = breed.minWeightMale;
    maxNorm = breed.maxWeightMale;
  } else {
    minNorm = breed.minWeightFemale;
    maxNorm = breed.maxWeightFemale;
  }

  if (conditionId === "underweight") {
    return { min: Math.max(0.5, minNorm * 0.7), max: minNorm * 0.95 };
  }
  if (conditionId === "overweight") {
    return { min: maxNorm * 1.05, max: maxNorm * 1.35 };
  }
  return { min: minNorm, max: maxNorm };
}

/**
 * Расчёт RER (Resting Energy Requirement)
 */
export function calculateRER(weight: number): number {
  return 70 * Math.pow(weight, 0.75);
}

/**
 * Основной расчёт суточной нормы корма
 */
export function calculateDailyFood(
  currentWeight: number,
  caloriesPerKilogram: number,
  breedId: BreedId,
  bodyConditionId: BodyConditionId,
  ageId: AgeGroupId,
  activityId: ActivityLevelId,
  gender: "male" | "female" = "male",
): CalculationResult {
  // 1. Идеальный вес по полу и породе
  const idealWeight = getIdealWeight(breedId, gender);

  // 2. Вес для расчёта и поправочный коэффициент кондиции
  let weightForCalculation = currentWeight;
  let conditionFactor = 1.0;

  if (bodyConditionId === "overweight") {
    weightForCalculation = idealWeight;
    conditionFactor = 0.9;
  } else if (bodyConditionId === "underweight") {
    weightForCalculation = currentWeight;
    conditionFactor = 1.2;
  } else {
    // ideal
    const isPuppyOrJunior = ageId.includes("puppy") || ageId.includes("junior");
    if (!isPuppyOrJunior) {
      // Для взрослых ограничиваем вес диапазоном породы
      const breed = getBreedProfile(breedId);
      const minNorm =
        gender === "male" ? breed.minWeightMale : breed.minWeightFemale;
      const maxNorm =
        gender === "male" ? breed.maxWeightMale : breed.maxWeightFemale;
      weightForCalculation = Math.min(
        Math.max(currentWeight, minNorm),
        maxNorm,
      );
    }
    // Для щенков и юниоров оставляем текущий вес
  }

  // 3. Базовый RER
  const rer = calculateRER(weightForCalculation);

  // 4. Фактор активности
  let activityFactor = ACTIVITY_FACTORS[activityId] ?? 1.4;

  // 5. Корректировка на возраст
  const isJunior = ageId.includes("junior");
  const isPuppy = ageId.includes("puppy");
  const isSenior = ageId.includes("senior");

  if (isPuppy || isJunior) {
    // Для щенков и юниоров используем специальные возрастные коэффициенты
    activityFactor = PUPPY_FACTORS[ageId] || 2.1;
  } else if (isSenior) {
    activityFactor = ACTIVITY_FACTORS.senior;
  }

  // 6. Коэффициент пола (кобели +5%)
  const genderFactor = gender === "male" ? 1.05 : 1.0;

  // 7. Итоговая суточная потребность в ккал (DER)
  const caloricNeeds = rer * activityFactor * conditionFactor * genderFactor;

  // 8. Перевод в граммы корма
  const dailyFoodGrams = (caloricNeeds / caloriesPerKilogram) * 1000;

  return {
    baseCalories: rer,
    calculationWeight: weightForCalculation,
    dailyFoodGrams: Math.round(dailyFoodGrams),
    caloricNeeds: Math.round(caloricNeeds),
    foodDensityPer100g: caloriesPerKilogram / 10,
    formulaKey: isPuppy ? "puppy" : "adult",
  };
}

/**
 * Форматирование диапазона веса (например, "10.5-12.0")
 */
export function formatWeightRange(min: number, max: number): string {
  const trim = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${trim(min)}-${trim(max)}`;
}

/**
 * Получение описания фактора активности (для подсказки в UI)
 */
export function getActivityFactorDescription(
  activityId: ActivityLevelId,
): string {
  return `activityDesc.${activityId}`; // или можно сразу вернуть текст
}

/**
 * Проверка, является ли строка положительным числом
 */
export function isPositiveNumber(value: string): boolean {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
}

// import type {
//   ActivityLevel,
//   ActivityLevelId,
//   AgeGroup,
//   AgeGroupId,
//   BodyConditionId,
//   BreedId,
//   BreedProfile,
//   CalculationResult,
// } from '../types/calculator';

// import chihuahuaImage from '../assets/Breed/chihuahua.webp';
// import dachshundImage from '../assets/Breed/dachshund.webp';
// import frenchBulldogImage from '../assets/Breed/french_bulldog.webp';
// import shibaInuImage from '../assets/Breed/shiba_inu.webp';
// import cardiganCorgiImage from '../assets/Breed/cardigan_corgi.webp';
// import germanShepherdImage from '../assets/Breed/german_shepherd.webp';
// import goldenRetrieverImage from '../assets/Breed/golden_retriever.webp';
// import huskyImage from '../assets/Breed/husky.webp';
// import jackRussellImage from '../assets/Breed/jack_russell.webp';
// import labradorImage from '../assets/Breed/labrador.webp';
// import pomeranianImage from '../assets/Breed/pomeranian.webp';
// import corgiImage from '../assets/Breed/welsh_corgi.webp';

// export const DEFAULT_CALORIES_PER_KILOGRAM = 4200;

// export const AGE_GROUPS: AgeGroup[] = [
//   { id: 'puppy_0_3', usesPuppyFormula: true },
//   { id: 'puppy_3_6', usesPuppyFormula: true },
//   { id: 'junior_6_12', usesPuppyFormula: false },
//   { id: 'adult_1_2', usesPuppyFormula: false },
//   { id: 'senior_2_plus', usesPuppyFormula: false },
// ];

// export const ACTIVITY_LEVELS: ActivityLevel[] = [
//   { id: 'light_hour', factor: 1.1, descriptionKey: 'activityDesc.light_hour' },
//   { id: 'light_day', factor: 1.4, descriptionKey: 'activityDesc.light_day' },
//   { id: 'heavy_work', factor: 3, descriptionKey: 'activityDesc.heavy_work' },
//   { id: 'couch', factor: 0.8, descriptionKey: 'activityDesc.couch' },
//   { id: 'outdoor_cool', factor: 1.25, descriptionKey: 'activityDesc.outdoor_cool' },
//   { id: 'outdoor_freezing', factor: 1.75, descriptionKey: 'activityDesc.outdoor_freezing' },
//   { id: 'outdoor_hot', factor: 2.5, descriptionKey: 'activityDesc.outdoor_hot' },
//   { id: 'puppy_small_3_9', factor: 1.6, descriptionKey: 'activityDesc.puppy_small_3_9' },
//   { id: 'puppy_small_9_24', factor: 1.2, descriptionKey: 'activityDesc.puppy_small_9_24' },
//   { id: 'puppy_large_3_9', factor: 1.6, descriptionKey: 'activityDesc.puppy_large_3_9' },
//   { id: 'puppy_large_9_24', factor: 1.2, descriptionKey: 'activityDesc.puppy_large_9_24' },
//   { id: 'nursing', factor: 2, descriptionKey: 'activityDesc.nursing' },
// ];

// export const BREEDS: BreedProfile[] = [
//  { id: 'labrador', minWeight: 25, maxWeight: 36, image: labradorImage, imageType: 'large' },
//   { id: 'german_shepherd', minWeight: 22, maxWeight: 40, image: germanShepherdImage, imageType: 'large' },
//   { id: 'golden_retriever', minWeight: 25, maxWeight: 34, image: goldenRetrieverImage, imageType: 'large' },
//   { id: 'french_bulldog', minWeight: 9, maxWeight: 14, image: frenchBulldogImage, imageType: 'medium' },
//   { id: 'shiba_inu', minWeight: 8, maxWeight: 11, image: shibaInuImage, imageType: 'medium' },
//   { id: 'cardigan_corgi', minWeight: 11, maxWeight: 17, image: cardiganCorgiImage, imageType: 'medium' },
//   { id: 'corgi', minWeight: 10, maxWeight: 14, image: corgiImage, imageType: 'medium' },
//   { id: 'dachshund', minWeight: 7, maxWeight: 15, image: dachshundImage, imageType: 'medium' },
//   { id: 'husky', minWeight: 16, maxWeight: 27, image: huskyImage, imageType: 'large' },
//   { id: 'jack_russell', minWeight: 6, maxWeight: 8, image: jackRussellImage, imageType: 'small' },
//   { id: 'chihuahua', minWeight: 1.8, maxWeight: 3, image: chihuahuaImage, imageType: 'small' },
//   { id: 'pomeranian', minWeight: 1.8, maxWeight: 3.5, image: pomeranianImage, imageType: 'small' },
// ];

// export function getAgeGroup(ageId: AgeGroupId) {
//   return AGE_GROUPS.find((group) => group.id === ageId) ?? AGE_GROUPS[0];
// }

// export function getActivityLevel(activityId: ActivityLevelId) {
//   return ACTIVITY_LEVELS.find((level) => level.id === activityId) ?? ACTIVITY_LEVELS[0];
// }

// export function getBreedProfile(breedId: BreedId) {
//   return BREEDS.find((breed) => breed.id === breedId) ?? BREEDS[0];
// }

// export function getBreedIdealWeight(breedId: BreedId) {
//   const breed = getBreedProfile(breedId);
//   return (breed.minWeight + breed.maxWeight) / 2;
// }

// export function getSuggestedWeightRange(breedId: BreedId, conditionId: BodyConditionId) {
//   const breed = getBreedProfile(breedId);

//   if (conditionId === 'underweight') {
//     return {
//       min: Math.max(0.5, breed.minWeight * 0.7),
//       max: breed.minWeight * 0.95,
//     };
//   }

//   if (conditionId === 'overweight') {
//     return {
//       min: breed.maxWeight * 1.05,
//       max: breed.maxWeight * 1.35,
//     };
//   }

//   return {
//     min: breed.minWeight,
//     max: breed.maxWeight,
//   };
// }

// export function formatWeightRange(min: number, max: number) {
//   return `${trimWeight(min)}-${trimWeight(max)}`;
// }

// function trimWeight(value: number) {
//   return Number.isInteger(value) ? String(value) : value.toFixed(1);
// }

// export function getCalculationWeight(
//   weight: number,
//   breedId: BreedId,
//   bodyConditionId: BodyConditionId,
// ) {
//   const breed = getBreedProfile(breedId);

//   if (bodyConditionId === 'ideal') {
//     return weight;
//   }

//   if (bodyConditionId === 'underweight') {
//     return Math.max(weight, breed.minWeight);
//   }

//   return Math.min(weight, breed.maxWeight);
// }
// export function getBaseCalories(weight: number, ageGroup: AgeGroup) {
//   if (ageGroup.usesPuppyFormula) {
//     return 2 * (70 * Math.pow(weight, 0.75));
//   }

//   return 2 * (30 * weight + 70);
// }

// export function calculateDailyFood(
//   weight: number,
//   caloriesPerKilogram: number,
//   breedId: BreedId,
//   bodyConditionId: BodyConditionId,
//   ageId: AgeGroupId,
//   activityId: ActivityLevelId,
// ): CalculationResult {
//   const ageGroup = getAgeGroup(ageId);
//   const activityLevel = getActivityLevel(activityId);
//   const calculationWeight = getCalculationWeight(weight, breedId, bodyConditionId);
//   const baseCalories = getBaseCalories(calculationWeight, ageGroup);
//   const caloricNeeds = baseCalories * activityLevel.factor;
//   const foodDensityPer100g = caloriesPerKilogram / 10;
//   const dailyFoodGrams = (caloricNeeds * 1000) / caloriesPerKilogram;

//   return {
//     baseCalories,
//     calculationWeight,
//     dailyFoodGrams,
//     caloricNeeds,
//     foodDensityPer100g,
//     formulaKey: ageGroup.usesPuppyFormula ? 'puppy' : 'adult',
//   };
// }

// export function isPositiveNumber(value: string) {
//   const parsed = Number(value);
//   return Number.isFinite(parsed) && parsed > 0;
// }
