/**
 * Interface for password entries from the CSV file
 * Represents a single row of data with date and password
 */
export interface PasswordEntry {
  /** Date in DD/MM/YYYY format */
  date: string;
  /** WiFi password for the specified date */
  password: string;
}

/**
 * Props interface for the WiFi password display component
 */
export interface WiFiDisplayProps {
  /** The current password to display, null if not found */
  currentPassword: string | null;
  /** The network name to display */
  networkName: string;
  /** Optional error message to display */
  error?: string;
}

/**
 * Error states for the application
 */
export type ErrorState =
  | "file-not-found"
  | "invalid-csv-format"
  | "no-password-for-date"
  | "parsing-error"
  | "configuration-error"
  | null;

/**
 * Interface for error handling states and messages
 */
export interface ErrorHandling {
  /** Current error state */
  state: ErrorState;
  /** Human-readable error message */
  message?: string;
}

/**
 * Interface for the CSV parsing result
 */
export interface CSVParseResult {
  /** Array of parsed password entries */
  entries: PasswordEntry[];
  /** Any error that occurred during parsing */
  error?: ErrorHandling;
}

/**
 * Interface for the password lookup result
 */
export interface PasswordLookupResult {
  /** The found password, null if not found */
  password: string | null;
  /** The network name */
  networkName: string;
  /** Any error that occurred during lookup */
  error?: string;
}

/**
 * Interface for loading states
 */
export interface LoadingState {
  /** Whether data is currently being loaded */
  isLoading: boolean;
  /** Optional loading message to display */
  message?: string;
}

/**
 * Interface for retry functionality
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Delay between retries in milliseconds */
  retryDelay?: number;
  /** Whether to use exponential backoff */
  exponentialBackoff?: boolean;
}
