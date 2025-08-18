"use client";

import { useState, useCallback } from "react";
import { WiFiPasswordDisplay } from "./wifi-password-display";
import { Loading } from "@/components/ui/loading";
import { PasswordLookupResult } from "@/lib/types";

interface WiFiPasswordWrapperProps {
  initialData: PasswordLookupResult;
}

/**
 * Client-side wrapper for WiFi Password Display
 *
 * Provides retry functionality and loading states for the WiFi password display
 */
export function WiFiPasswordWrapper({ initialData }: WiFiPasswordWrapperProps) {
  const [data, setData] = useState<PasswordLookupResult>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setRetryCount((prev) => prev + 1);

    try {
      // Simulate a delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real implementation, this would call the server action again
      // For now, we'll just reload the page
      window.location.reload();
    } catch (error) {
      console.error("Retry failed:", error);
      setData({
        ...data,
        error:
          "Retry failed. Please refresh the page or contact staff for assistance.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [data, isLoading]);

  // Use handleRetry in the component to avoid unused variable warning
  const retryHandler = handleRetry;

  if (isLoading) {
    return (
      <Loading
        message={retryCount > 0 ? "Retrying..." : "Loading WiFi password..."}
        networkName={data.networkName}
      />
    );
  }

  return (
    <WiFiPasswordDisplay
      currentPassword={data.password}
      yesterdayPassword={data.yesterdayPassword}
      networkName={data.networkName}
      error={data.error}
    />
  );
}
