import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { smallLogo } from "@/assets/image";
import { useOutsideClick } from "@/hooks";
import {
  Baby,
  Heart,
  HelpCircle,
  Home,
  Package,
  Phone,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Truck,
  User,
  UserCircle,
} from "lucide-react";
import { useUserStore } from "@/lib/store";
import { Button } from "../ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeaderLeftSideBar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { isAuthenticated, authUser, logoutUser } = useUserStore();

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out duration-300`}
    >
      <motion.div
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-white text-black z-50 h-screen border-r flex flex-col gap-6 relative"
      >
        {/* LOGO */}
        <div className="flex items-center justify-baseline border-b p-5">
          <Link href={"/"} className="flex items-end gap-2">
            <Image src={smallLogo} alt="smallLogo" className="w-8" />
            <p className="text-base font-medium">Listo para Entregar</p>
          </Link>
        </div>

        <div className="flex flex-col justify-between flex-1 px-5 overflow-hidden">
          <div className="overflow-y-auto flex-1 pr-2">
            {/* -------------------------- */}
            {/* ENLACES RÁPIDOS */}
            {/* -------------------------- */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Enlaces Rápidos
              </h3>

              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Home size={18} />
                  <span>Inicio</span>
                </Link>

                <Link
                  href="/shop"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Store size={18} />
                  <span>Ver Todo</span>
                </Link>

                <Link
                  href="/shop?sortOrder=desc"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Star size={18} />
                  <span>Nuevos Ingresos</span>
                </Link>

                <Link
                  href="/shop?priceRange=0-50"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Tag size={18} />
                  <span>Ofertas por Menos de $50</span>
                </Link>
              </div>
            </div>

            {/* -------------------------- */}
            {/* COMPRAR POR EDAD */}
            {/* -------------------------- */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Comprar por Edad
              </h3>

              <div className="space-y-2">
                <Link
                  href="/shop?search=newborn"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Baby size={18} />
                  <span>Recién Nacido (0-6 meses)</span>
                </Link>

                <Link
                  href="/shop?search=infant"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Baby size={18} />
                  <span>Bebé (6-12 meses)</span>
                </Link>

                <Link
                  href="/shop?search=toddler"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Baby size={18} />
                  <span>Niño Pequeño (1-2 años)</span>
                </Link>

                <Link
                  href="/shop?search=kids"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Baby size={18} />
                  <span>Niños (2+ años)</span>
                </Link>
              </div>
            </div>

            {/* -------------------------- */}
            {/* CUENTA DEL USUARIO */}
            {/* -------------------------- */}
            {isAuthenticated && authUser ? (
              <div className="space-y-4 mb-6">
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600">Bienvenido/a,</p>
                  <p className="font-semibold text-lg">{authUser.name}</p>
                </div>

                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Mi Cuenta
                </h3>

                <div className="space-y-2">
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <UserCircle size={18} />
                    <span>Mi Perfil</span>
                  </Link>

                  <Link
                    href="/user/orders"
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <Package size={18} />
                    <span>Mis Pedidos</span>
                  </Link>

                  <Link
                    href="/user/wishlist"
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <Heart size={18} />
                    <span>Mi Lista de Deseos</span>
                  </Link>

                  <Link
                    href="/user/cart"
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <ShoppingBag size={18} />
                    <span>Mi Carrito</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-4">
                  Iniciá sesión para ver tus pedidos y lista de deseos.
                </p>
              </div>
            )}

            {/* -------------------------- */}
            {/* AYUDA & SOPORTE */}
            {/* -------------------------- */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Ayuda y Soporte
              </h3>

              <div className="space-y-2">
                <Link
                  href="/help"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <HelpCircle size={18} />
                  <span>Centro de Ayuda</span>
                </Link>

                <Link
                  href="/help/shipping"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Truck size={18} />
                  <span>Información de Envíos</span>
                </Link>

                <Link
                  href="/help/contact"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <Phone size={18} />
                  <span>Contáctanos</span>
                </Link>
              </div>
            </div>
          </div>

          {/* -------------------------- */}
          {/* FOOTER FIJO (LOGIN / LOGOUT) */}
          {/* -------------------------- */}
          <div className="py-4 border-t bg-white">
            <div>
              {isAuthenticated && authUser ? (
                <Button
                  variant={"outline"}
                  className="w-full py-5.5 text-base font-semibold"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <p className="flex items-center gap-1 font-medium mb-2">
                    <User /> Mi Cuenta
                  </p>

                  <Link href="/auth/signin" onClick={onClose}>
                    <Button className="w-full py-5.5 text-base font-semibold">
                      Iniciar Sesión
                    </Button>
                  </Link>

                  <Link href="/auth/signup" onClick={onClose}>
                    <Button
                      className="w-full py-5.5 text-base font-semibold mt-2"
                      variant="outline"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeaderLeftSideBar;
