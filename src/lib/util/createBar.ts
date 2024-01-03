import {
  Empty_InnerG,
  Empty_LeftG,
  Empty_RightG,
  Full_InnerG,
  Full_LeftG,
  Full_RightG,
} from '@/lib/util/emojis';

export const createBar = (currentValue: number, maxValue: number) => {
  const barLength = 14;

  const unitValue = maxValue / barLength;

  const filledSections = Math.floor(currentValue / unitValue);
  const emptySections = barLength - filledSections;

  const leftMarker = currentValue >= unitValue ? Full_LeftG : Empty_LeftG;
  const middleMarker = Full_InnerG;
  const rightMarker = filledSections === barLength ? Full_RightG : Empty_RightG;

  return `${leftMarker}${middleMarker.repeat(
    filledSections
  )}${Empty_InnerG.repeat(emptySections)}${rightMarker}`;
};
