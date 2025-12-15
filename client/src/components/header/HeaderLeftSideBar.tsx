"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import {
  Home,
  LayoutDashboard,
  Package,
  Phone,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  User,
  UserCircle,
  Heart,
  HelpCircle,
  Store,
  ChevronRight,
  LogOut,
  X,
  CreditCard,
} from "lucide-react";
import { useUserStore } from "@/lib/store";
import { Button } from "../ui/button";
import Logo from "../common/Logo";

interface Category {
  _id: string;
  name: string;
  categoryType: string;
  slug: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeaderLeftSideBar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { isAuthenticated, authUser, logoutUser } = useUserStore();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?perPage=100`);
        const data = await response.json();
        setCategories(data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  // Group categories by type
  const groupedCategories = categories.reduce((acc, cat) => {
    const type = cat.categoryType || "Otros";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  // Define icon colors mapping
  const typeColors: Record<string, string> = {
    "Perfumería": "text-purple-500 bg-purple-50",
    "Maquillaje": "text-pink-500 bg-pink-50",
    "Cuidado para el Hombre": "text-blue-500 bg-blue-50",
    "Cuidado Diario": "text-emerald-500 bg-emerald-50",
    "Cabello": "text-amber-500 bg-amber-50",
    "Accesorios de Damas": "text-rose-500 bg-rose-50",
    "Otros": "text-slate-500 bg-slate-50",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={sidebarRef}
            className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between mb-2">
                <div onClick={onClose} className="cursor-pointer">
                  <Logo />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-2">
                Tu tienda de belleza favorita
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">

              {/* Enlaces Rápidos */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Explorar
                </h3>
                <nav className="space-y-1">
                  {[
                    { href: "/", icon: Home, label: "Inicio" },
                    { href: "/shop", icon: Store, label: "Ver Tienda" },
                    { href: "/shop?sortOrder=desc", icon: Star, label: "Lo Nuevo", color: "text-amber-500" },
                    { href: "/shop?priceRange=0-50", icon: Tag, label: "Ofertas", color: "text-red-500" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group text-gray-700 font-medium"
                    >
                      <link.icon className={`w-5 h-5 ${link.color || "text-gray-400 group-hover:text-tiendaLVPrimary"} transition-colors`} />
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Categorías por Tipo */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Categorías
                </h3>
                <div className="space-y-6">
                  {Object.entries(groupedCategories).map(([type, cats]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center gap-2 px-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${typeColors[type]?.split(" ")[1] || "bg-gray-200"}`}></span>
                        <h4 className="text-sm font-semibold text-gray-800">{type}</h4>
                      </div>
                      <div className="pl-4 border-l-2 border-gray-100 space-y-1 ml-3">
                        {cats.map((category) => (
                          <Link
                            key={category._id}
                            href={{
                              pathname: "/shop",
                              query: { category: category.name }, // Frontend expects name for initial search in ShopPageClient
                            }}
                            onClick={onClose}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 hover:text-tiendaLVPrimary hover:bg-sky-50 transition-all text-sm group"
                          >
                            <span>{category.name}</span>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-tiendaLVPrimary" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Ayuda
                </h3>
                <nav className="space-y-1">
                  <Link href="/help" onClick={onClose} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors">
                    <HelpCircle size={16} /> Centro de Ayuda
                  </Link>
                  <Link href="/help/shipping" onClick={onClose} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors">
                    <Truck size={16} /> Información de Envíos
                  </Link>
                  <Link href="/help/contact" onClick={onClose} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors">
                    <Phone size={16} /> Contáctanos
                  </Link>
                </nav>
              </div>
            </div>

            {/* Footer / Auth */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              {isAuthenticated && authUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-tiendaLVPrimary/10 p-2 rounded-full text-tiendaLVPrimary">
                      <UserCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{authUser.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{authUser.email}</p>
                    </div>
                  </div>

                  <nav className="grid grid-cols-2 gap-2">
                    <Link href="/user/profile" onClick={onClose} className="flex flex-col items-center justify-center gap-1 p-2 bg-white rounded-lg border border-gray-100 hover:border-tiendaLVPrimary/50 hover:bg-sky-50/30 transition-all">
                      <User size={18} className="text-gray-600" />
                      <span className="text-[10px] font-medium text-gray-600">Perfil</span>
                    </Link>
                    <Link href="/user/orders" onClick={onClose} className="flex flex-col items-center justify-center gap-1 p-2 bg-white rounded-lg border border-gray-100 hover:border-tiendaLVPrimary/50 hover:bg-sky-50/30 transition-all">
                      <Package size={18} className="text-gray-600" />
                      <span className="text-[10px] font-medium text-gray-600">Pedidos</span>
                    </Link>
                    <Link href="/user/wishlist" onClick={onClose} className="flex flex-col items-center justify-center gap-1 p-2 bg-white rounded-lg border border-gray-100 hover:border-tiendaLVPrimary/50 hover:bg-sky-50/30 transition-all">
                      <Heart size={18} className="text-gray-600" />
                      <span className="text-[10px] font-medium text-gray-600">Deseos</span>
                    </Link>
                    <Link href="/user/cart" onClick={onClose} className="flex flex-col items-center justify-center gap-1 p-2 bg-white rounded-lg border border-gray-100 hover:border-tiendaLVPrimary/50 hover:bg-sky-50/30 transition-all">
                      <ShoppingBag size={18} className="text-gray-600" />
                      <span className="text-[10px] font-medium text-gray-600">Carrito</span>
                    </Link>
                  </nav>

                  {authUser.role === "admin" && (
                    <a
                      href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:5174"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-all"
                      onClick={onClose}
                    >
                      <LayoutDashboard size={16} /> Panel Admin
                    </a>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Inicia sesión para acceder a tu cuenta y pedidos.
                  </p>
                  <Link href="/auth/signin" onClick={onClose} className="block">
                    <Button className="w-full bg-tiendaLVAccent hover:bg-gray-800 text-white py-6 rounded-xl shadow-lg shadow-gray-200">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={onClose} className="block">
                    <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 py-6 rounded-xl">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HeaderLeftSideBar;
