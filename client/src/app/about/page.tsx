"use client";

import { motion } from "framer-motion";
import { Heart, Target, Award, MapPin, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const values = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Pasión por la Calidad",
            description: "Seleccionamos cuidadosamente cada producto para garantizar la mejor calidad para nuestros clientes."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Compromiso",
            description: "Nos comprometemos a ofrecer un servicio excepcional y productos que superen tus expectativas."
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Confianza",
            description: "Construimos relaciones duraderas basadas en la transparencia y la honestidad con cada cliente."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <ShoppingBag className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Sobre Tienda L&V
                        </h1>
                        <p className="text-xl text-pink-100">
                            Tu destino de confianza para cosmética, accesorios y carteras de calidad
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Our Story */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Nuestra Historia
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                <strong>Tienda L&V</strong> nació con la visión de ofrecer productos de belleza
                                y accesorios de alta calidad a precios accesibles. Desde nuestros inicios, nos
                                hemos dedicado a seleccionar cuidadosamente cada artículo que ofrecemos,
                                asegurándonos de que cumpla con nuestros estándares de calidad.
                            </p>
                            <p>
                                Con años de experiencia en el mercado, hemos construido una comunidad de clientes
                                satisfechos que confían en nosotros para sus necesidades de belleza y estilo.
                                Nuestro compromiso es seguir creciendo y mejorando para ofrecerte siempre lo mejor.
                            </p>
                            <p>
                                Hoy, somos más que una tienda: somos tu aliado en la búsqueda de productos que
                                realcen tu belleza natural y complementen tu estilo personal.
                            </p>
                        </div>
                    </motion.div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100"
                        >
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Nuestra Misión
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Proporcionar productos de belleza y accesorios de calidad excepcional,
                                ofreciendo una experiencia de compra única que inspire confianza y satisfacción
                                en cada cliente.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Nuestra Visión
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Ser la tienda de referencia en cosmética y accesorios, reconocida por nuestra
                                calidad, servicio al cliente excepcional y compromiso con la satisfacción de
                                nuestros clientes.
                            </p>
                        </motion.div>
                    </div>

                    {/* Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Nuestros Valores
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 text-pink-600">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-12"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-pink-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Visítanos
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Tienda Física</h3>
                                <p className="text-gray-600 mb-4">
                                    Av. Principal 1234<br />
                                    Buenos Aires, Argentina<br />
                                    C1234ABC
                                </p>
                                <h3 className="font-semibold text-gray-900 mb-2">Horarios</h3>
                                <p className="text-gray-600">
                                    Lunes a Viernes: 9:00 - 20:00<br />
                                    Sábados: 10:00 - 18:00<br />
                                    Domingos: Cerrado
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
                                <p className="text-gray-600 mb-2">
                                    📧 info@tiendalv.com<br />
                                    📱 +54 9 11 2345-6789<br />
                                    ☎️ (011) 1234-5678
                                </p>
                                <div className="mt-4">
                                    <Link
                                        href="/help"
                                        className="inline-block px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors"
                                    >
                                        Contáctanos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-center text-white"
                    >
                        <Users className="w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">
                            Únete a Nuestra Comunidad
                        </h2>
                        <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
                            Miles de clientes satisfechos ya confían en nosotros.
                            Descubre por qué somos su tienda favorita.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-8 py-4 bg-white text-pink-600 rounded-xl font-bold hover:bg-pink-50 transition-colors shadow-lg"
                        >
                            Explorar Productos
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
