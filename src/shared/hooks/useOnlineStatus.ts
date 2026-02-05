"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { UseOnlineStatusReturn } from "@/entities/types";

/**
 * Hook para detectar status online/offline
 * Dispara toast quando perde/recupera conexão
 * 
 * @returns {UseOnlineStatusReturn} isOnline e wasOffline flags
 * 
 * @example
 * ```tsx
 * const { isOnline, wasOffline } = useOnlineStatus();
 * 
 * if (!isOnline) {
 *   return <OfflineBanner />;
 * }
 * ```
 */
export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log("[Network] Connection restored");
      setIsOnline(true);

      // Se estava offline antes, mostrar toast de reconexão
      if (wasOffline) {
        toast.success("Back online", {
          description: "Connection restored",
          duration: 3000,
        });
      }

      setWasOffline(false);
    };

    const handleOffline = () => {
      console.log("[Network] Connection lost");
      setIsOnline(false);
      setWasOffline(true);

      toast.warning("Offline mode", {
        description: "Some features may be limited",
        duration: 5000,
      });
    };

    // Adicionar listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
  };
}
