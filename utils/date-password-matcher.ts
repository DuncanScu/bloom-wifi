import { PasswordEntry } from "@/lib/types";

/**
 * Gets the current date in DD/MM/YYYY format
 * @returns Current date formatted as DD/MM/YYYY
 */
export function getCurrentDate(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

/**
 * Finds the password for the current date from an array of password entries
 * @param entries - Array of password entries from CSV
 * @returns The password for today's date, or null if not found
 */
export function getCurrentPassword(entries: PasswordEntry[]): string | null {
  const currentDate = getCurrentDate();
  return findPasswordForDate(entries, currentDate);
}

/**
 * Finds the password for a specific date from password entries
 * @param entries - Array of password entries
 * @param targetDate - Date string in DD/MM/YYYY format
 * @returns The password for the specified date, or null if not found
 */
export function findPasswordForDate(
  entries: PasswordEntry[],
  targetDate: string
): string | null {
  if (!isValidDateFormat(targetDate)) {
    return null;
  }

  const matchingEntry = entries.find((entry) => entry.date === targetDate);
  return matchingEntry ? matchingEntry.password : null;
}

/**
 * Validates if a date string is in DD/MM/YYYY format
 * @param dateString - Date string to validate
 * @returns True if valid format, false otherwise
 */
export function isValidDateFormat(dateString: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const [day, month, year] = dateString.split("/").map(Number);

  // Basic validation for reasonable date ranges
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  ) {
    return false;
  }

  // Create date object and verify it matches the input
  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
}

/**
 * Checks if a password exists for the current date
 * @param entries - Array of password entries
 * @returns True if password exists for today, false otherwise
 */
export function hasPasswordForToday(entries: PasswordEntry[]): boolean {
  return getCurrentPassword(entries) !== null;
}

/**
 * Gets all available dates from password entries
 * @param entries - Array of password entries
 * @returns Array of date strings in DD/MM/YYYY format
 */
export function getAvailableDates(entries: PasswordEntry[]): string[] {
  return entries.map((entry) => entry.date).sort();
}
