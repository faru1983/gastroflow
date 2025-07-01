import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
