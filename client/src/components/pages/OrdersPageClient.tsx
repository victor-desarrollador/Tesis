"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useOrderStore, useUserStore } from "@/lib/store";
import { Loader2, Package, Calendar, MapPin, ChevronRight, ShoppingBag } from "lucide-react";
import PriceFormatter from "@/components/common/PriceFormatter";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const OrdersPageClient = () => {
    const { orders, isLoading, loadOrders } = useOrderStore();
    const { auth_token, isAuthenticated } = useUserStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (auth_token) {
            loadOrders(auth_token);
        }
    }, [auth_token, loadOrders]);

    if (!mounted || isLoading) {
        return (
            <Container className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </Container>
        );
    }

    if (!isAuthenticated) {
        return (
            <Container className="py-16 text-center">
                <h2 className="text-2xl font-bold">Por favor inicia sesión</h2>
                <p className="text-gray-500 mt-2">Necesitas estar logueado para ver tus pedidos.</p>
                <Link href="/auth/signin">
                    <Button className="mt-4">Iniciar Sesión</Button>
                </Link>
            </Container>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pagado": return "bg-green-100 text-green-800 hover:bg-green-200";
            case "pendiente": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "cancelado": return "bg-red-100 text-red-800 hover:bg-red-200";
            case "completado": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Container className="py-8">
            <PageBreadcrumb
                items={[{ label: "Perfil", href: "/user/profile" }]}
                currentPage="Mis Pedidos"
            />

            <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>

            {orders && orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-sm transition-shadow">
                            {/* Order Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900 uppercase">Pedido #{order._id.slice(-6)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Total:</span>
                                        <PriceFormatter amount={order.total} className="text-lg" />
                                    </div>
                                    <Badge className={`${getStatusColor(order.status)} border-0 px-3 py-1 capitalize`}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4 md:p-6">
                                <div className="flex flex-col gap-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ShoppingBag size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">Cant: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <PriceFormatter amount={item.price * item.quantity} className="text-sm font-semibold" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Footer Actions (Optional) */}
                                {/* <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                                     <Button variant="outline" size="sm" className="gap-2 text-xs">
                                        Ver Detalles <ChevronRight size={14} />
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-md border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes pedidos aún</h3>
                    <p className="text-gray-500 mb-8 text-center max-w-sm">
                        Parece que no has realizado ninguna compra todavía. ¡Explora nuestra tienda!
                    </p>
                    <Link href="/shop">
                        <Button className="rounded-full px-8 bg-black hover:bg-gray-800">
                            Ir a la Tienda
                        </Button>
                    </Link>
                </div>
            )}
        </Container>
    );
};

export default OrdersPageClient;
