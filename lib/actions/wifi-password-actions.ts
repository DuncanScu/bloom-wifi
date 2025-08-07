import {
  parseWiFiPasswordsCSV,
  getCurrentDateFormatted,
  findPasswordForDate,
} from "@/utils/csv-parser";
import { PasswordLookupResult } from "@/lib/types";

/**
 * Server action to get the current WiFi password
 * @returns Promise resolving to PasswordLookupResult
 */
export async function getCurrentWiFiPassword(): Promise<PasswordLookupResult> {
  const networkName = "Bloom Guest";

  try {
    // Log environment info for debugging
    console.log("Environment info:", {
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
    });

    // Parse the CSV file
    const parseResult = await parseWiFiPasswordsCSV();

    // If there was an error parsing the CSV
    if (parseResult.error) {
      console.error("CSV parsing error:", parseResult.error);
      return {
        password: null,
        networkName,
        error: parseResult.error.message,
      };
    }

    // Get current date and find matching password
    const currentDate = getCurrentDateFormatted();
    console.log("Looking for password for date:", currentDate);
    console.log("Available entries:", parseResult.entries.length);

    const password = findPasswordForDate(parseResult.entries, currentDate);

    // If no password found for current date
    if (!password) {
      console.error("No password found for date:", currentDate);
      console.log(
        "Available dates:",
        parseResult.entries.map((e) => e.date).slice(0, 5)
      );
      return {
        password: null,
        networkName,
        error: `No password available for today (${currentDate}). Please check with staff for the current password.`,
      };
    }

    console.log("Successfully found password for:", currentDate);
    return {
      password,
      networkName,
    };
  } catch (error) {
    console.error("Unexpected error in getCurrentWiFiPassword:", error);
    return {
      password: null,
      networkName,
      error:
        "An unexpected error occurred while loading the password. Please contact staff for assistance.",
    };
  }
}
