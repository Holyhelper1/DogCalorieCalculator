import type {
  ActivityLevel,
  ActivityLevelId,
  AgeGroup,
  AgeGroupId,
  BodyConditionId,
  BreedId,
  BreedProfile,
  CalculationResult,
} from '../types/calculator';
import corgiImage from '../assets/Breed/welsh_corgi.jpg';
import labradorImage from '../assets/Breed/labrador.jpeg';

export const DEFAULT_CALORIES_PER_KILOGRAM = 4270;

export const AGE_GROUPS: AgeGroup[] = [
  { id: 'puppy_0_3', usesPuppyFormula: true },
  { id: 'puppy_3_6', usesPuppyFormula: true },
  { id: 'junior_6_12', usesPuppyFormula: false },
  { id: 'adult_1_2', usesPuppyFormula: false },
  { id: 'senior_2_plus', usesPuppyFormula: false },
];

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { id: 'light_hour', factor: 1.1, descriptionKey: 'activityDesc.light_hour' },
  { id: 'light_day', factor: 1.4, descriptionKey: 'activityDesc.light_day' },
  { id: 'heavy_work', factor: 3, descriptionKey: 'activityDesc.heavy_work' },
  { id: 'couch', factor: 0.8, descriptionKey: 'activityDesc.couch' },
  { id: 'outdoor_cool', factor: 1.25, descriptionKey: 'activityDesc.outdoor_cool' },
  { id: 'outdoor_freezing', factor: 1.75, descriptionKey: 'activityDesc.outdoor_freezing' },
  { id: 'outdoor_hot', factor: 2.5, descriptionKey: 'activityDesc.outdoor_hot' },
  { id: 'puppy_small_3_9', factor: 1.6, descriptionKey: 'activityDesc.puppy_small_3_9' },
  { id: 'puppy_small_9_24', factor: 1.2, descriptionKey: 'activityDesc.puppy_small_9_24' },
  { id: 'puppy_large_3_9', factor: 1.6, descriptionKey: 'activityDesc.puppy_large_3_9' },
  { id: 'puppy_large_9_24', factor: 1.2, descriptionKey: 'activityDesc.puppy_large_9_24' },
  { id: 'nursing', factor: 2, descriptionKey: 'activityDesc.nursing' },
];

export const BREEDS: BreedProfile[] = [
  { id: 'labrador', minWeight: 25, maxWeight: 36, image: labradorImage, imageType: 'large' },
  { id: 'german_shepherd', minWeight: 22, maxWeight: 40, image: labradorImage, imageType: 'large' },
  { id: 'golden_retriever', minWeight: 25, maxWeight: 34, image: labradorImage, imageType: 'large' },
  { id: 'french_bulldog', minWeight: 9, maxWeight: 14, image: corgiImage, imageType: 'medium' },
  { id: 'corgi', minWeight: 10, maxWeight: 14, image: corgiImage, imageType: 'medium' },
  { id: 'dachshund', minWeight: 7, maxWeight: 15, image: corgiImage, imageType: 'medium' },
  { id: 'husky', minWeight: 16, maxWeight: 27, image: labradorImage, imageType: 'large' },
  { id: 'jack_russell', minWeight: 6, maxWeight: 8, image: corgiImage, imageType: 'small' },
  { id: 'chihuahua', minWeight: 1.8, maxWeight: 3, image: corgiImage, imageType: 'small' },
  { id: 'pomeranian', minWeight: 1.8, maxWeight: 3.5, image: corgiImage, imageType: 'small' },
];

export function getAgeGroup(ageId: AgeGroupId) {
  return AGE_GROUPS.find((group) => group.id === ageId) ?? AGE_GROUPS[0];
}

export function getActivityLevel(activityId: ActivityLevelId) {
  return ACTIVITY_LEVELS.find((level) => level.id === activityId) ?? ACTIVITY_LEVELS[0];
}

export function getBaseCalories(weight: number, ageGroup: AgeGroup) {
  if (ageGroup.usesPuppyFormula) {
    return 2 * (70 * Math.pow(weight, 0.75));
  }

  return 2 * (30 * weight + 70);
}

export function getBreedProfile(breedId: BreedId) {
  return BREEDS.find((breed) => breed.id === breedId) ?? BREEDS[0];
}

export function getSuggestedWeightRange(breedId: BreedId, conditionId: BodyConditionId) {
  const breed = getBreedProfile(breedId);

  if (conditionId === 'underweight') {
    return {
      min: Math.max(0.5, breed.minWeight * 0.7),
      max: breed.minWeight * 0.95,
    };
  }

  if (conditionId === 'overweight') {
    return {
      min: breed.maxWeight * 1.05,
      max: breed.maxWeight * 1.35,
    };
  }

  return {
    min: breed.minWeight,
    max: breed.maxWeight,
  };
}

export function formatWeightRange(min: number, max: number) {
  return `${trimWeight(min)}-${trimWeight(max)}`;
}

function trimWeight(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function calculateDailyFood(
  weight: number,
  caloriesPerKilogram: number,
  ageId: AgeGroupId,
  activityId: ActivityLevelId,
): CalculationResult {
  const ageGroup = getAgeGroup(ageId);
  const activityLevel = getActivityLevel(activityId);
  const baseCalories = getBaseCalories(weight, ageGroup);
  const caloricNeeds = baseCalories * activityLevel.factor;
  const foodDensityPer100g = caloriesPerKilogram / 10;
  const dailyFoodGrams = (caloricNeeds * 1000) / caloriesPerKilogram;

  return {
    baseCalories,
    dailyFoodGrams,
    caloricNeeds,
    foodDensityPer100g,
    formulaKey: ageGroup.usesPuppyFormula ? 'puppy' : 'adult',
  };
}

export function isPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
}
