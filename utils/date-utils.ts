import { PasswordEntry } from "@/lib/types";

/**
 * Formats a date to DD/MM/YYYY format
 * @param date - Date object to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateToDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
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
  const date = new Date(year, month - 1, day);

  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
}

/**
 * Finds the password for a specific date from password entries
 * @param entries - Array of password entries
 * @param targetDate - Date string in DD/MM/YYYY format to search for
 * @returns The password for the date, or null if not found
 */
export function findPasswordForDate(
  entries: PasswordEntry[],
  targetDate: string
): string | null {
  if (!isValidDateFormat(targetDate)) {
    return null;
  }

  // Use Map for O(1) lookup performance
  const passwordMap = new Map(
    entries.map((entry) => [entry.date, entry.password])
  );
  return passwordMap.get(targetDate) || null;
}

/**
 * Gets the current date formatted as DD/MM/YYYY
 * @returns Current date in DD/MM/YYYY format
 */
export function getCurrentDateFormatted(): string {
  return formatDateToDDMMYYYY(new Date());
}
