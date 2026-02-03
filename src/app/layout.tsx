import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { AuthProvider } from "@/shared/hooks/useAuth";
import { FilterProvider } from "@/shared/hooks/useFilters";
import { Navbar } from "@/widgets/navbar/Navbar";

export const metadata: Metadata = {
  title: "ExeFit - Pilates & Fitness Exercises",
  description: "Progressive Web App to browse and favorite exercises",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ExeFit",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <FilterProvider>
            <Navbar />
            {children}
            <Toaster position="bottom-right" />
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
