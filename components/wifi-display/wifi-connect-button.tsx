"use client";

import { useState } from "react";
import { Wifi, Smartphone, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WiFiConnectButtonProps {
  networkName: string;
  password: string;
}

export function WiFiConnectButton({
  networkName,
  password,
}: WiFiConnectButtonProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConnect = async () => {
    setConnectionStatus("connecting");
    setErrorMessage("");

    try {
      // Check if we're on a mobile device
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobile) {
        // For mobile devices, try to open WiFi settings with network info
        const wifiUrl = `wifi://connect?ssid=${encodeURIComponent(
          networkName
        )}&password=${encodeURIComponent(password)}`;

        // Try the custom URL scheme first
        window.location.href = wifiUrl;

        // Fallback: show instructions for manual connection
        setTimeout(() => {
          setConnectionStatus("success");
        }, 1000);
      } else {
        // For desktop, show instructions or try to open network settings
        if (navigator.platform.toLowerCase().includes("win")) {
          // Windows - open network settings
          window.open("ms-settings:network-wifi", "_blank");
        } else if (navigator.platform.toLowerCase().includes("mac")) {
          // macOS - show instructions (can't directly open WiFi settings)
          setConnectionStatus("success");
        } else {
          // Linux or other - show instructions
          setConnectionStatus("success");
        }
      }
    } catch (error) {
      console.error("Failed to initiate WiFi connection:", error);
      setErrorMessage(
        "Unable to connect automatically. Please connect manually using the password above."
      );
      setConnectionStatus("error");
    }
  };

  const getButtonContent = () => {
    switch (connectionStatus) {
      case "connecting":
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            Connecting...
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Connection Initiated
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            Try Manual Connection
          </>
        );
      default:
        return (
          <>
            <Wifi className="h-4 w-4" />
            Connect to WiFi
          </>
        );
    }
  };

  const getInstructions = () => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (connectionStatus === "success") {
      if (isMobile) {
        return "If the automatic connection didn't work, go to WiFi settings and select the network manually.";
      } else {
        return "Please go to your WiFi settings and connect to the network manually using the password above.";
      }
    }

    return null;
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleConnect}
        className="w-full gap-2"
        disabled={connectionStatus === "connecting"}
        variant={connectionStatus === "error" ? "destructive" : "default"}
      >
        {getButtonContent()}
      </Button>

      {connectionStatus === "success" && (
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {getInstructions()}
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === "error" && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Works best on mobile devices. Desktop users may need to connect
        manually.
      </p>
    </div>
  );
}
