import React from "react";
import TopFooter from "./TopFooter";
import HrLine from "../common/HrLine";
import Container from "../common/Container";
import { Title } from "../common/text";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { payment } from "@/assets/image";

const informationTab = [
  { title: "Sobre Nosotros", href: "/about" },
  { title: "Búsquedas Populares", href: "/search" },
  { title: "Política de Privacidad", href: "/privacy" },
  { title: "Términos y Condiciones", href: "/terms" },
  { title: "Testimonios", href: "/testimonials" },
];

const CustomerTab = [
  { title: "Mi Cuenta", href: "/account" },
  { title: "Seguimiento de Pedido", href: "/track-order" },
  { title: "Tienda", href: "/shop" },
  { title: "Lista de Deseos", href: "/wishlist" },
  { title: "Devoluciones/Cambios", href: "/returns" },
];

const OthersTab = [
  { title: "Programas de Asociación", href: "/programs" },
  { title: "Programa de Afiliados", href: "/programs" },
  { title: "Venta Mayorista", href: "/programs" },
  { title: "Venta Mayorista de Productos", href: "/programs" },
  { title: "Otros", href: "/others" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-babyshopWhite">
      <TopFooter />
      <HrLine />
      <Container className="py-10 hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Información */}
        <div>
          <Title className="text-lg mb-4">Información</Title>
          <div className="flex flex-col gap-2">
            {informationTab?.map((item) => (
              <Link
                key={item?.href}
                href={item?.href}
                className="text-babyshopBlack hover:text-babyshopSky hoverEffect"
              >
                {item?.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Atención al Cliente */}
        <div>
          <Title className="text-lg mb-4">Atención al Cliente</Title>
          <div className="flex flex-col gap-2">
            {CustomerTab?.map((item) => (
              <Link
                href={item?.href}
                key={item?.title}
                className="text-babyshopBlack hover:text-babyshopSky hoverEffect"
              >
                {item?.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Otros Negocios */}
        <div>
          <Title className="text-lg mb-4">Otros Negocios</Title>
          <div className="flex flex-col gap-2">
            {OthersTab?.map((item) => (
              <Link
                href={item?.href}
                key={item?.title}
                className="text-babyshopBlack hover:text-babyshopSky hoverEffect"
              >
                {item?.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <Title className="text-lg mb-4">Boletín</Title>
          <div className="flex flex-col gap-2 relative">
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="border rounded-full pl-3 pr-16 h-14 placeholder:text-babyshopBlack/50 font-medium"
            />
            <button className="bg-babyshopSky text-babyshopWhite w-14 h-14 rounded-full flex items-center justify-center absolute top-0 right-0">
              <ArrowRight />
            </button>
          </div>
        </div>

      </Container>
      <HrLine />

      {/* Abajo del footer */}
      <Container className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-5">
        <p>© 2025 Tienda L&V. Todos los derechos reservados.</p>
        <div className="flex items-center gap-2">
          <p>Pagos seguros</p>
          <Image src={payment} alt="Métodos de pago" />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

