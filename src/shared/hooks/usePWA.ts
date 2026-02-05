"use client";

import { useState, useEffect, useCallback } from "react";
import type { InstallPromptEvent, PWAState } from "@/entities/types";

/**
 * Hook para gerenciar a instalação do PWA
 * Detecta se a app é instalável e captura o prompt de instalação
 * 
 * @returns {PWAState & { install: () => Promise<void> }} Estado PWA e função de instalação
 * 
 * @example
 * ```tsx
 * const { isInstallable, install, showPrompt } = usePWA();
 * 
 * if (isInstallable && showPrompt) {
 *   return <InstallPrompt onInstall={install} />;
 * }
 * ```
 */
export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    showPrompt: false,
    deferredPrompt: null,
  });

  // Verificar se já foi instalado
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detectar se está rodando como PWA instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      
      interface NavigatorWithStandalone extends Navigator {
        standalone?: boolean;
      }
      
      const isIOSStandalone = (navigator as NavigatorWithStandalone).standalone === true;

      if (isStandalone || isIOSStandalone) {
        setPwaState((prev) => ({ ...prev, isInstalled: true, showPrompt: false }));
      }

      // Verificar se o usuário já dispensou o prompt antes
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (dismissed === "true") {
        setPwaState((prev) => ({ ...prev, showPrompt: false }));
      }
    };

    checkInstalled();
  }, []);

  // Capturar evento beforeinstallprompt
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir o prompt automático do Chrome
      e.preventDefault();

      const installEvent = e as InstallPromptEvent;

      setPwaState((prev) => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: installEvent,
        showPrompt: !prev.isInstalled && localStorage.getItem("pwa-install-dismissed") !== "true",
      }));

      console.log("[PWA] Install prompt captured");
    };

    const handleAppInstalled = () => {
      console.log("[PWA] App installed successfully");
      
      setPwaState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        showPrompt: false,
        deferredPrompt: null,
      }));

      // Limpar flag de dismissed
      localStorage.removeItem("pwa-install-dismissed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  /**
   * Dispara o prompt de instalação
   */
  const install = useCallback(async () => {
    if (!pwaState.deferredPrompt) {
      console.warn("[PWA] No deferred prompt available");
      return;
    }

    try {
      // Mostrar o prompt nativo
      await pwaState.deferredPrompt.prompt();

      // Aguardar escolha do usuário
      const { outcome } = await pwaState.deferredPrompt.userChoice;

      console.log(`[PWA] User choice: ${outcome}`);

      if (outcome === "accepted") {
        setPwaState((prev) => ({
          ...prev,
          showPrompt: false,
          deferredPrompt: null,
        }));
      }
    } catch (error) {
      console.error("[PWA] Install error:", error);
    }
  }, [pwaState.deferredPrompt]);

  /**
   * Ocultar prompt e marcar como dismissed
   */
  const dismissPrompt = useCallback(() => {
    localStorage.setItem("pwa-install-dismissed", "true");
    setPwaState((prev) => ({ ...prev, showPrompt: false }));
    console.log("[PWA] Install prompt dismissed");
  }, []);

  return {
    ...pwaState,
    install,
    dismissPrompt,
  };
}
