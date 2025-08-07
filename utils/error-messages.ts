import { ErrorState } from "@/lib/types";

/**
 * User-friendly error messages for different error states
 */
export const ERROR_MESSAGES: Record<NonNullable<ErrorState>, string> = {
  "file-not-found":
    "Unable to load password file. Please contact staff for assistance.",
  "invalid-csv-format":
    "Password file format is invalid. Please contact staff for assistance.",
  "no-password-for-date":
    "No password available for today. Please check with staff for the current password.",
  "parsing-error":
    "Unable to read password file. Please contact staff for assistance.",
  "configuration-error":
    "System configuration error. Please contact staff for assistance.",
};

/**
 * Gets a user-friendly error message for a given error state
 * @param errorState - The error state to get a message for
 * @param customMessage - Optional custom message to use instead
 * @returns User-friendly error message
 */
export function getErrorMessage(
  errorState: ErrorState,
  customMessage?: string
): string {
  if (customMessage) {
    return customMessage;
  }

  if (!errorState) {
    return "An unexpected error occurred. Please try again.";
  }

  return (
    ERROR_MESSAGES[errorState] ||
    "An unexpected error occurred. Please try again."
  );
}

/**
 * Determines if an error is recoverable (user can retry)
 * @param errorState - The error state to check
 * @returns True if the error might be recoverable with a retry
 */
export function isRecoverableError(errorState: ErrorState): boolean {
  if (!errorState) return false;

  const recoverableErrors: ErrorState[] = [
    "parsing-error",
    "configuration-error",
  ];
  return recoverableErrors.includes(errorState);
}

/**
 * Gets appropriate action text for an error state
 * @param errorState - The error state to get action text for
 * @returns Action text for the user
 */
export function getErrorActionText(errorState: ErrorState): string {
  if (!errorState) return "Try Again";

  switch (errorState) {
    case "file-not-found":
    case "invalid-csv-format":
    case "no-password-for-date":
      return "Contact Staff";
    case "parsing-error":
    case "configuration-error":
      return "Try Again";
    default:
      return "Try Again";
  }
}

/**
 * Creates a detailed error report for debugging purposes
 * @param errorState - The error state
 * @param originalError - The original error object if available
 * @param context - Additional context about where the error occurred
 * @returns Detailed error report
 */
export function createErrorReport(
  errorState: ErrorState,
  originalError?: Error,
  context?: string
): string {
  const timestamp = new Date().toISOString();
  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";

  let report = `Error Report - ${timestamp}\n`;
  report += `Error State: ${errorState || "unknown"}\n`;
  report += `Context: ${context || "unknown"}\n`;
  report += `User Agent: ${userAgent}\n`;

  if (originalError) {
    report += `Original Error: ${originalError.message}\n`;
    if (originalError.stack) {
      report += `Stack Trace:\n${originalError.stack}\n`;
    }
  }

  return report;
}
