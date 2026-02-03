"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "sonner";

export function LoginButton() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
      toast.success("Welcome to ExeFit!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={loading}
      className="bg-black text-white hover:bg-gray-800 border-2 border-black transition-colors cursor-pointer font-semibold cursor-pointer"
      size="lg"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Logging in..." : "Login with Google"}
    </Button>
  );
}
