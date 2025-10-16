export const formatHeight = (cm: number): string => {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  return `${feet}'${inches}" (${cm}cm)`;
};

export const formatWeight = (kg: number): string => {
  const lbs = Math.round(kg * 2.20462);
  return `${kg}kg (${lbs}lbs)`;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isValidImageUri = (uri: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some((ext) => uri.toLowerCase().endsWith(ext));
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
