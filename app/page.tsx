import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { WiFiPasswordDisplay } from "@/components/wifi-display";
import { BuyMeCoffee } from "@/components/ui/buy-me-coffee";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Loading } from "@/components/ui/loading";
import { getCurrentWiFiPassword } from "@/lib/actions/wifi-password-actions";

// Force dynamic rendering and disable caching to ensure fresh password calculation on every request
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * WiFi Password Page Component
 *
 * Server component that fetches the current WiFi password and displays it
 * Recalculates on every page refresh
 */
async function WiFiPasswordContent() {
  // Fetch the current WiFi password on the server
  const passwordData = await getCurrentWiFiPassword();

  return (
    <WiFiPasswordDisplay
      currentPassword={passwordData.password}
      networkName={passwordData.networkName}
      error={passwordData.error}
    />
  );
}

/**
 * Home Page Component
 *
 * Main page that displays the WiFi password with proper error boundaries and loading states
 */
export default function Home() {
  return (
    <Container className="max-w-lg">
      <div className="w-full h-full flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 md:space-y-10">
          {/* WiFi Password Display Component with Error Boundary and Loading */}
          <div className="w-full">
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <WiFiPasswordContent />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>

        {/* Buy Me Coffee Component - Positioned at bottom */}
        <footer className="w-full flex justify-center pt-8 pb-4">
          <ErrorBoundary>
            <BuyMeCoffee />
          </ErrorBoundary>
        </footer>
      </div>
    </Container>
  );
}
