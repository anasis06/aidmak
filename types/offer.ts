import { ImageSourcePropType } from 'react-native';

export interface Offer {
  id: string;
  brand: string;
  discount: string;
  description: string;
  specialOffer?: string;
  image: ImageSourcePropType;
  validityTill: string;
  categories: string;
  terms: string;
  redemptionSteps: string[];
}
