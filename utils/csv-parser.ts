import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { PasswordEntry, CSVParseResult, ErrorHandling } from "@/lib/types";

// Cache for parsed CSV data to avoid re-parsing on every request
let csvCache: {
  data: PasswordEntry[];
  lastModified: number;
  filePath: string;
} | null = null;

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
 * Compares two date strings in DD/MM/YYYY format
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns True if dates are equal, false otherwise
 */
export function compareDates(date1: string, date2: string): boolean {
  // Quick string comparison first (most common case)
  if (date1 === date2) {
    return true;
  }

  // Only validate format if strings don't match exactly
  if (!isValidDateFormat(date1) || !isValidDateFormat(date2)) {
    return false;
  }

  return false; // Already checked equality above
}

/**
 * Reads and parses the CSV file containing WiFi passwords with caching
 * @param filePath - Path to the CSV file (optional, defaults to wifi-passwords.csv in project root)
 * @returns Promise resolving to CSVParseResult with entries and potential errors
 */
export async function parseWiFiPasswordsCSV(
  filePath?: string
): Promise<CSVParseResult> {
  // Try multiple possible paths for the CSV file
  const possiblePaths = [
    filePath,
    path.join(process.cwd(), "public", "wifi-passwords.csv"),
    path.join(process.cwd(), "wifi-passwords.csv"),
    path.join(__dirname, "..", "..", "public", "wifi-passwords.csv"),
    "./public/wifi-passwords.csv",
  ].filter(Boolean) as string[];

  let csvPath: string | null = null;

  // Find the first existing path
  for (const testPath of possiblePaths) {
    try {
      if (fs.existsSync(testPath)) {
        csvPath = testPath;
        break;
      }
    } catch (e) {
      // Continue to next path
      console.warn(`Could not check path ${testPath}:`, e);
    }
  }

  if (!csvPath) {
    console.error("CSV file not found in any of these paths:", possiblePaths);
    return {
      entries: [],
      error: {
        state: "file-not-found",
        message:
          "Unable to load password file. Please contact staff for assistance.",
      },
    };
  }

  console.log("Using CSV file at:", csvPath);

  try {
    // Check cache validity
    const stats = fs.statSync(csvPath);
    const lastModified = stats.mtime.getTime();

    if (
      csvCache &&
      csvCache.filePath === csvPath &&
      csvCache.lastModified === lastModified
    ) {
      // Return cached data if file hasn't been modified
      return { entries: csvCache.data };
    }

    // Read file content
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(csvPath, "utf-8");
    } catch (readError) {
      return {
        entries: [],
        error: {
          state: "configuration-error",
          message:
            "Unable to read password file. Please contact staff for assistance.",
        },
      };
    }

    if (!fileContent.trim()) {
      return {
        entries: [],
        error: {
          state: "invalid-csv-format",
          message:
            "Password file is empty. Please contact staff for assistance.",
        },
      };
    }

    // Parse CSV using Papa Parse
    const parseResult = Papa.parse<{ Date: string; Password: string }>(
      fileContent,
      {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => value.trim(),
      }
    );

    if (parseResult.errors.length > 0) {
      console.error("CSV parsing errors:", parseResult.errors);
      return {
        entries: [],
        error: {
          state: "parsing-error",
          message:
            "Password file format is invalid. Please contact staff for assistance.",
        },
      };
    }

    // Check if required headers exist
    if (parseResult.data.length > 0) {
      const firstRow = parseResult.data[0];
      if (!("Date" in firstRow) || !("Password" in firstRow)) {
        return {
          entries: [],
          error: {
            state: "invalid-csv-format",
            message:
              "Password file is missing required columns. Please contact staff for assistance.",
          },
        };
      }
    }

    // Validate and transform data
    const entries: PasswordEntry[] = [];
    const invalidEntries: string[] = [];

    for (const [index, row] of parseResult.data.entries()) {
      if (!row.Date || !row.Password) {
        invalidEntries.push(`Row ${index + 2}: Missing date or password`);
        continue;
      }

      if (!isValidDateFormat(row.Date)) {
        invalidEntries.push(
          `Row ${index + 2}: Invalid date format "${
            row.Date
          }" (expected DD/MM/YYYY)`
        );
        continue;
      }

      entries.push({
        date: row.Date,
        password: row.Password,
      });
    }

    // If no valid entries found
    if (entries.length === 0) {
      return {
        entries: [],
        error: {
          state: "invalid-csv-format",
          message:
            "No valid password entries found in file. Please contact staff for assistance.",
        },
      };
    }

    // Log warnings about invalid entries for debugging
    if (invalidEntries.length > 0) {
      console.warn(`CSV parsing warnings: ${invalidEntries.join(", ")}`);
    }

    // Update cache with parsed data
    csvCache = {
      data: entries,
      lastModified,
      filePath: csvPath,
    };

    return { entries };
  } catch (error) {
    console.error("Unexpected error parsing CSV:", error);
    return {
      entries: [],
      error: {
        state: "configuration-error",
        message:
          "An unexpected error occurred while loading passwords. Please contact staff for assistance.",
      },
    };
  }
}

/**
 * Finds the password for a specific date from parsed CSV entries
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

/**
 * Clears the CSV cache - useful for testing or when file changes are expected
 */
export function clearCSVCache(): void {
  csvCache = null;
}
