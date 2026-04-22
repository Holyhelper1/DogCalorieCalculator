export type SupportedLanguage = 'ru' | 'en';
export type ThemeMode = 'system' | 'light' | 'dark';

export type AgeGroupId = 'puppy_0_3' | 'puppy_3_6' | 'junior_6_12' | 'adult_1_2' | 'senior_2_plus';
export type ActivityLevelId =
  | 'light_hour'
  | 'light_day'
  | 'heavy_work'
  | 'couch'
  | 'outdoor_cool'
  | 'outdoor_freezing'
  | 'outdoor_hot'
  | 'puppy_small_3_9'
  | 'puppy_small_9_24'
  | 'puppy_large_3_9'
  | 'puppy_large_9_24'
  | 'nursing';
export type BreedId =
  | 'akita_inu'
  | 'amstaff'
  | 'australian_shepherd'

  | 'beagle'
  | 'border_collie'
  | 'boxer'

  | 'cardigan_corgi'
  | 'chihuahua'
  | 'corgi'

  | 'dachshund'
  | 'dalmatian'
  | 'doberman'

  | 'french_bulldog'
  | 'german_shepherd'
  | 'golden_retriever'

  | 'husky'
  | 'jack_russell'
  | 'labrador'

  | 'pomeranian'
  | 'pug'
  | 'rottweiler'

  | 'russian_greyhound'
  | 'samoyed'
  | 'shiba_inu'
  | 'yorkshire_terrier';
export type BodyConditionId = 'underweight' | 'ideal' | 'overweight';
export type BreedImageId = 'small' | 'medium' | 'large';

export type AgeGroup = {
  id: AgeGroupId;
  usesPuppyFormula: boolean;
};

export type ActivityLevel = {
  id: ActivityLevelId;
  factor: number;
  descriptionKey: string;
};

export type BreedProfile = {
  id: BreedId;
  minWeight: number;
  maxWeight: number;
  image: string;
  imageType: BreedImageId;
};

export type CalculatorFormState = {
  breed: BreedId;
  bodyCondition: BodyConditionId;
  age: AgeGroupId;
  activity: ActivityLevelId;
  weight: string;
  caloriesPerKilogram: string;
  gender: 'male' | 'female';
};

export type CalculationResult = {
  baseCalories: number;
  calculationWeight: number;
  dailyFoodGrams: number;
  caloricNeeds: number;
  foodDensityPer100g: number;
  formulaKey: 'puppy' | 'adult';
};
