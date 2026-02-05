"use client";

import { useEffect } from "react";
import { usePWA } from "@/shared/hooks/usePWA";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";
import { InstallPrompt } from "@/features/pwa/ui/InstallPrompt";

/**
 * Provider PWA para gerenciar instalação e status de rede
 * Exibe InstallPrompt e detecta offline automaticamente
 */
export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { showPrompt, install, dismissPrompt } = usePWA();
  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    console.log("[PWA] Provider initialized");
    console.log("[PWA] Online:", isOnline);
  }, [isOnline]);

  return (
    <>
      {children}
      {showPrompt && <InstallPrompt onInstall={install} onDismiss={dismissPrompt} />}
    </>
  );
}
