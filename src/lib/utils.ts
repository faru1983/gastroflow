import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  let rawValue = value.replace(/\D/g, '');

  if (!rawValue.startsWith('569')) {
    if (rawValue.length > 9) {
      rawValue = '569' + rawValue.substring(rawValue.length - 8);
    } else {
      rawValue = '569' + rawValue;
    }
  }
  
  if (rawValue.length > 11) {
    rawValue = rawValue.substring(0, 11);
  }

  let formatted = '+';
  if (rawValue.length > 3) {
    formatted += `${rawValue.substring(0, 3)}-${rawValue.substring(3)}`;
  } else {
    formatted += rawValue;
  }
  
  return formatted;
};

export const formatDateInput = (value: string): string => {
  let rawValue = value.replace(/\D/g, '');
  
  if (rawValue.length > 8) {
    rawValue = rawValue.substring(0, 8);
  }

  let formattedValue = '';
  if (rawValue.length > 4) {
    formattedValue = `${rawValue.substring(0, 2)}-${rawValue.substring(2, 4)}-${rawValue.substring(4)}`;
  } else if (rawValue.length > 2) {
    formattedValue = `${rawValue.substring(0, 2)}-${rawValue.substring(2)}`;
  } else {
    formattedValue = rawValue;
  }
  
  return formattedValue;
};
