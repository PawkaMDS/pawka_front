import React from 'react';
import HierarchyIcon from '@/assets/icons/hierarchy.svg';
import PawIcon from '@/assets/icons/paw.svg';
import PawsIcon from '@/assets/icons/paws.svg';
import MedalIcon from '@/assets/icons/medal.svg';
import HeartIcon from '@/assets/icons/heart.svg';
import CompositionIcon from '@/assets/icons/composition.svg';
import HouseIcon from '@/assets/icons/house.svg';
import CheckIcon from '@/assets/icons/check.svg';
import InfoIcon from '@/assets/icons/info.svg';
import DetailsIcon from '@/assets/icons/details.svg';

/**
 * Mapping des icon_name des ProductType vers leurs composants SVG
 * Si une icône spécifique n'existe pas encore, on utilise l'icône par défaut
 */
export const CATEGORY_ICONS: Record<string, React.FC<any>> = {
  food: CompositionIcon,
  treats: HeartIcon,
  supplements: MedalIcon,
  toys: PawsIcon,
  bed: HouseIcon,
  leash: DetailsIcon,
  clothing: HierarchyIcon,
  vitamins: MedalIcon,
  medication: InfoIcon,
  hygiene: CheckIcon,
  cleaning: CheckIcon,
  litter: HouseIcon,
  bowls: CompositionIcon,
};

/**
 * Récupère l'icône correspondant à un icon_name
 * Retourne l'icône par défaut si non trouvée
 */
export const getCategoryIcon = (iconName: string | null | undefined): React.FC<any> => {
  if (!iconName) return HierarchyIcon;
  return CATEGORY_ICONS[iconName] || HierarchyIcon;
};
