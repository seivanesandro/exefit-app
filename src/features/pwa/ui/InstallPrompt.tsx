"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import type { InstallPromptProps } from "@/entities/types";

/**
 * Banner/Toast para instalar PWA
 * Aparece apenas em mobile e quando a app é instalável
 * Permite instalar ou dispensar permanentemente
 * 
 * @param {InstallPromptProps} props - Callbacks de instalação e dismiss
 * 
 * @example
 * ```tsx
 * <InstallPrompt 
 *   onInstall={handleInstall} 
 *   onDismiss={handleDismiss} 
 * />
 * ```
 */
export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Mostrar após 2 segundos (dar tempo do usuário ver a página)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    await onInstall();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    onDismiss();
    setIsVisible(false);
  };

  // Não mostrar em desktop ou se já foi dismissed
  if (!isMobile || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <Card className="bg-white border-2 border-black shadow-2xl p-4">
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className="shrink-0 bg-black text-white rounded-full p-2">
            <Download className="h-5 w-5" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm mb-1 text-gray-900">
              Install ExeFit
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Add to your home screen for quick access and offline use.
            </p>

            {/* Botões */}
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-black text-white hover:bg-gray-800 font-semibold cursor-pointer"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="font-semibold cursor-pointer"
              >
                Not now
              </Button>
            </div>
          </div>

          {/* Botão fechar */}
          <button
            onClick={handleDismiss}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}
