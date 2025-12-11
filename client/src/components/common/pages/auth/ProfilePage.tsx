"use client";

import { Button } from "@/components/ui/button";
import authApi from "@/lib/authApi";
import { useUserStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logoutUser } = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.post("/auth/logout", {});
      if (response?.success) {
        logoutUser();
        toast.success("Sesión cerrada exitosamente");
        router.push("/");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-10">
      <Button onClick={handleLogout} variant={"destructive"}>
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="animate-spin" /> Cerrando sesión...
          </span>
        ) : (
          "Cerrar sesión"
        )}
      </Button>
    </div>
  );
};

export default ProfilePage;
