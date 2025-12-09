"use client";
import { useRouter } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Heart,
  Search,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  Baby,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFoundPageClient = () => {
  const router = useRouter();

  const quickLinks = [
    { href: "/shop", label: "Ver todos los productos", icon: ShoppingBag },
    { href: "/user/wishlist", label: "Favoritos", icon: Heart },
    { href: "/search", label: "Buscar productos", icon: Search },
    { href: "/help/contact", label: "Contactar soporte", icon: Phone },
  ];

const popularCategories = [
  { href: "/shop?category=cosmetica", label: "Cosmética y cuidado personal" },
  { href: "/shop?category=maquillaje", label: "Maquillaje" },
  { href: "/shop?category=accesorios", label: "Accesorios para dama" },
  { href: "/shop?category=joyeria", label: "Aros, pulseras y cadenas" },
  { href: "/shop?category=relojes", label: "Relojes para mujer" },
  { href: "/shop?category=carteras", label: "Carteras y bolsos" },
];


  const helpfulPages = [
    { href: "/track-order", label: "Rastrear tu pedido" },
    { href: "/returns", label: "Devoluciones y cambios" },
    { href: "/help/shipping", label: "Información de envío" },
    { href: "/testimonials", label: "Opiniones de clientes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden py-0">
            <CardHeader className="text-center space-y-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-8">
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto"
              >
                <div className="relative">
                  <Baby className="mx-auto h-20 w-20 text-white drop-shadow-lg" />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    ?
                  </div>
                </div>
              </motion.div>

              <div>
                <CardTitle className="text-4xl font-bold mb-2">
                  ¡Ups! Página no encontrada
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Parece que este pequeño se fue a jugar.
                  <br />
                  No te preocupes, te ayudamos a encontrar lo que buscas.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Main Navigation */}
              <div className="text-center space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow-lg transition-all duration-300"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Volver al inicio
                  </Button>
                </motion.div>
                <p className="text-gray-600">
                  O explorá nuestros productos destacados a continuación
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Accesos rápidos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={link.href}
                        className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
                      >
                        <link.icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600 mb-2 transition-colors" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 text-center transition-colors">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Categorías populares
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {popularCategories.map((category, index) => (
                    <motion.div
                      key={category.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link
                        href={category.href}
                        className="block p-3 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 group"
                      >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                          {category.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Helpful Pages */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  ¿Necesitás ayuda?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {helpfulPages.map((page, index) => (
                    <motion.div
                      key={page.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link
                        href={page.href}
                        className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 group"
                      >
                        <ArrowLeft className="h-4 w-4 text-green-600 mr-3 transform group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-medium text-green-700">
                          {page.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 p-6">
              <div className="w-full space-y-4">
                {/* Store Info */}
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-gray-800">
                    Bienvenido a L&V — Tu tienda de confianza para Cosmética, Accesorios y Carteras
                  </h4>
                  <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                    Somos tu destino para todo lo que tu necesitas:
                    Cosmética, Accesorios y Carteras y más.
                    Comprá de forma segura, fácil y cómoda.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    <Link
                      href="/help/contact"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Atención al cliente
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>Disponible 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                    <Link
                      href="/help/shipping"
                      className="hover:text-purple-600 transition-colors"
                    >
                      Envío gratis
                    </Link>
                  </div>
                </div>

                {/* Privacy */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Tu privacidad es importante para nosotros.
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Política de Privacidad
                    </Link>
                    {" • "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Términos del Servicio
                    </Link>
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPageClient;
