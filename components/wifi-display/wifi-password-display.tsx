"use client";

import { Wifi, AlertCircle, Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WiFiDisplayProps } from "@/lib/types";
import { WiFiQRCode } from "./wifi-qr-code";
/**
 * WiFi Password Display Component
 *
 * Displays the current WiFi network name and password in a card format.
 * Handles error states and provides copy-to-clipboard functionality.
 */
export function WiFiPasswordDisplay({
  currentPassword,
  yesterdayPassword,
  networkName,
  error,
}: WiFiDisplayProps) {
  const [copiedToday, setCopiedToday] = useState(false);
  const [copiedYesterday, setCopiedYesterday] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopyPassword = async (
    password: string,
    isToday: boolean = true
  ) => {
    if (!password) return;

    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error("Clipboard API not available");
      }

      await navigator.clipboard.writeText(password);
      if (isToday) {
        setCopiedToday(true);
        setTimeout(() => setCopiedToday(false), 2000);
      } else {
        setCopiedYesterday(true);
        setTimeout(() => setCopiedYesterday(false), 2000);
      }
      setCopyError(null);
    } catch (err) {
      console.error("Failed to copy password:", err);
      setCopyError("Failed to copy password. Please copy manually.");

      // Try fallback method for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = password;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        // Use deprecated execCommand as fallback for older browsers
        const success = document.execCommand("copy");
        if (success) {
          if (isToday) {
            setCopiedToday(true);
            setTimeout(() => setCopiedToday(false), 2000);
          } else {
            setCopiedYesterday(true);
            setTimeout(() => setCopiedYesterday(false), 2000);
          }
          setCopyError(null);
        }

        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.error("Fallback copy method also failed:", fallbackErr);
        // Don't throw here, just show the error message
      }
    }
  };

  const handleRetry = () => {
    // This would typically trigger a refetch of data
    // For now, we'll just reload the page as a simple retry mechanism
    window.location.reload();
  };

  const getCurrentDate = () => {
    // Use the same timezone as the server - adjust this to match your location
    const timezone = "Europe/London"; // Change this to your timezone

    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: timezone,
    });
  };

  const getYesterdayDate = () => {
    // Use the same timezone as the server - adjust this to match your location
    const timezone = "Europe/London"; // Change this to your timezone

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: timezone,
    });
  };

  // Error state display
  if (error) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-destructive text-lg sm:text-xl">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            Connection Issue
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Unable to retrieve WiFi password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              {error}
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="gap-2"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No password available state
  if (!currentPassword) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
            <Wifi className="h-5 w-5 sm:h-6 sm:w-6" />
            {networkName}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            WiFi password for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4 sm:space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm sm:text-base">
                No password available for today ({getCurrentDate()})
              </AlertDescription>
            </Alert>
            <p className="text-sm sm:text-base text-muted-foreground">
              Please check with staff for the current password.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state with password display
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        {/* Current Date */}
        <p className="text-sm sm:text-base text-muted-foreground mb-2">
          {getCurrentDate()}
        </p>
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Wifi className="h-5 w-5 sm:h-6 sm:w-6" />
          {networkName}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          WiFi password for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {/* Password Display with Copy Button */}
          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-4 sm:p-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-wider break-all">
                {currentPassword}
              </p>
            </div>

            {/* Copy Buttons */}
            <div className="space-y-2">
              {/* Today's Password Copy Button */}
              <Button
                onClick={() => handleCopyPassword(currentPassword, true)}
                variant="outline"
                className="w-full py-2 sm:py-3 text-sm sm:text-base"
                disabled={copiedToday}
              >
                {copiedToday ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Password
                  </>
                )}
              </Button>

              {/* Yesterday's Password Copy Button - only show if available */}
              {yesterdayPassword && (
                <Button
                  onClick={() => handleCopyPassword(yesterdayPassword, false)}
                  variant="outline"
                  className="w-full py-2 sm:py-3 text-sm sm:text-base"
                  disabled={copiedYesterday}
                >
                  {copiedYesterday ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied Yesterday&apos;s!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Yesterday&apos;s Password
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* QR Code Component */}
          <WiFiQRCode
            networkName={networkName}
            password={currentPassword}
            security="WPA"
          />

          {/* Copy Error Message */}
          {copyError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {copyError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
