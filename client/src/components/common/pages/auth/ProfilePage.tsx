"use client";

import { Button } from "@/components/ui/button";
import authApi from "@/lib/authApi";
import { useUserStore } from "@/lib/store";
import { Loader2, Package, UserCircle, MapPin, Heart, LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditForm from "./ProfileEditForm";
import AddressManager from "./AddressManager";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { authUser, logoutUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  // Handle logout
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
      toast.error("Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (val: string) => {
    // Update URL without refresh
    const url = new URL(window.location.href);
    url.searchParams.set("tab", val);
    window.history.pushState({}, "", url);
  };

  if (!authUser) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tu información personal, direcciones y pedidos.
          </p>
        </div>
        <Button onClick={handleLogout} variant={"outline"} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <LogOut className="mr-2 h-4 w-4" />}
          Cerrar Sesión
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="addresses">Direcciones</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer onClick={() => handleTabChange('orders')}">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-blue-50 text-blue-600">
                  <Package size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Pedidos Recientes</h3>
                  <Link href="/user/orders" className="text-sm text-blue-600 hover:underline mt-2 block">
                    Ver historial completo
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-pink-50 text-pink-600">
                  <Heart size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lista de Deseos</h3>
                  <Link href="/user/wishlist" className="text-sm text-pink-600 hover:underline mt-2 block">
                    Ver tus favoritos
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-green-50 text-green-600">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dirección Principal</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {authUser.addresses?.find(a => a.isDefault)?.street || "No definida"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {authUser.avatar ? (
                  <img src={authUser.avatar} alt={authUser.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <UserCircle size={40} />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{authUser.name}</h3>
                  <p className="text-gray-500">{authUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs rounded-full capitalize text-gray-600">
                    {authUser.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROFILE EDIT TAB */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal y contraseña.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADDRESSES TAB */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Libreta de Direcciones</CardTitle>
              <CardDescription>
                Gestiona tus direcciones de envío y facturación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDERS TAB (Placeholder/Redirect) */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mis Pedidos</CardTitle>
              <CardDescription>
                Historial de todas tus compras.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <Package size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Visualiza el estado y detalle de tus pedidos.</p>
              <Link href="/user/orders">
                <Button>Ir a Mis Pedidos</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ProfilePage;
