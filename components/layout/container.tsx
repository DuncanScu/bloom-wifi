import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        // Full height layout with proper background
        "min-h-screen bg-background",
        // Centered flex layout with proper spacing
        "flex flex-col items-center justify-center",
        // Responsive padding - more on larger screens
        "px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12",
        // Responsive max width - starts narrow, grows on larger screens
        "w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl",
        // Ensure proper spacing and typography
        "text-center",
        className
      )}
    >
      {children}
    </div>
  );
}
