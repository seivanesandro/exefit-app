import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { AuthProvider } from "@/shared/hooks/useAuth";
import { FilterProvider } from "@/shared/hooks/useFilters";
import { CategoriesProvider } from "@/shared/hooks/useCategoriesContext";
import { Navbar } from "@/widgets/navbar/Navbar";
import { PWAProvider } from "./providers/PWAProvider";

export const metadata: Metadata = {
  title: "ExeFit - Pilates & Fitness Exercises",
  description: "Progressive Web App to browse and favorite exercises. Offline ready with 2000+ exercises from Wger API.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ExeFit",
    startupImage: [
      {
        url: "/icons/icon-512x512.svg",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "ExeFit",
    "apple-mobile-web-app-title": "ExeFit",
    "msapplication-TileColor": "#000000",
    "msapplication-tap-highlight": "no",
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
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CategoriesProvider>
            <FilterProvider>
              <PWAProvider>
                <Navbar />
                {children}
                <Toaster position="bottom-right" richColors expand={true} />
              </PWAProvider>
            </FilterProvider>
          </CategoriesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
