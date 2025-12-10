import React from "react";
import TopFooter from "./TopFooter";
import HrLine from "../common/HrLine";
import Container from "../common/Container";
import { Title } from "../common/text";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import { payment } from "@/assets/image";

const informationTab = [
  { title: "Sobre Nosotros", href: "/about" },
  { title: "Nuestras Marcas", href: "/shop" },
  { title: "Política de Privacidad", href: "/privacy" },
  { title: "Términos y Condiciones", href: "/terms" },
  { title: "Blog de Belleza", href: "/blog" },
];

const CustomerTab = [
  { title: "Mi Cuenta", href: "/user/account" },
  { title: "Seguimiento de Pedido", href: "/user/orders" },
  { title: "Tienda", href: "/shop" },
  { title: "Lista de Deseos", href: "/user/wishlist" },
  { title: "Devoluciones/Cambios", href: "/returns" },
];

const CategoriesTab = [
  { title: "Cosmética", href: "/shop?search=cosmetica" },
  { title: "Perfumes", href: "/shop?search=perfumes" },
  { title: "Carteras", href: "/shop?search=carteras" },
  { title: "Accesorios", href: "/shop?search=accesorios" },
  { title: "Ofertas Especiales", href: "/shop?discount=true" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t">
      <TopFooter />
      <HrLine />
      <Container className="py-10 hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Información */}
        <div>
          <Title className="text-lg mb-4 text-gray-900">Información</Title>
          <div className="flex flex-col gap-2">
            {informationTab?.map((item) => (
              <Link
                key={item?.href}
                href={item?.href}
                className="text-gray-600 hover:text-pink-600 hoverEffect text-sm"
              >
                {item?.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Atención al Cliente */}
        <div>
          <Title className="text-lg mb-4 text-gray-900">Atención al Cliente</Title>
          <div className="flex flex-col gap-2">
            {CustomerTab?.map((item) => (
              <Link
                href={item?.href}
                key={item?.title}
                className="text-gray-600 hover:text-pink-600 hoverEffect text-sm"
              >
                {item?.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Categorías Populares */}
        <div>
          <Title className="text-lg mb-4 text-gray-900">Categorías Populares</Title>
          <div className="flex flex-col gap-2">
            {CategoriesTab?.map((item) => (
              <Link
                href={item?.href}
                key={item?.title}
                className="text-gray-600 hover:text-pink-600 hoverEffect text-sm"
              >
                {item?.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter y Redes Sociales */}
        <div>
          <Title className="text-lg mb-4 text-gray-900">Mantente Conectada</Title>
          <p className="text-sm text-gray-600 mb-4">
            Suscribite para recibir ofertas exclusivas y novedades
          </p>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="border border-gray-300 rounded-full pl-4 pr-14 h-12 w-full placeholder:text-gray-400 font-medium focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button className="bg-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center absolute top-0 right-0 hover:bg-pink-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3 mt-2">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <HrLine />

      {/* Abajo del footer */}
      <Container className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          © 2025 Tienda L&V - Cosmética & Accesorios. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">Pagos seguros con</p>
          <Image src={payment} alt="Métodos de pago" className="h-6 w-auto" />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
