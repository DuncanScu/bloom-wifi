"use client";

import { Wifi, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  message?: string;
  networkName?: string;
}

/**
 * Loading Component
 *
 * Displays a loading state with skeleton UI while data is being fetched
 */
export function Loading({
  message = "Loading WiFi password...",
  networkName = "Bloom Guest",
}: LoadingProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Wifi className="h-5 w-5 sm:h-6 sm:w-6" />
          {networkName}
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {message}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Password Display Skeleton */}
          <div className="bg-muted rounded-lg p-4 sm:p-6">
            <Skeleton className="h-8 sm:h-10 md:h-12 w-full max-w-xs mx-auto" />
          </div>

          {/* Date Skeleton */}
          <Skeleton className="h-4 w-24 mx-auto" />

          {/* Button Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline Loading Spinner
 *
 * Small loading spinner for inline use
 */
export function LoadingSpinner({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}
