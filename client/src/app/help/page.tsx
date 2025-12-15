"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { HelpCircle, Mail, MessageCircle, Phone, ChevronDown, Send } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            question: "¿Cómo realizo un pedido?",
            answer: "Para realizar un pedido, navega por nuestro catálogo, agrega productos al carrito y procede al checkout. Necesitarás crear una cuenta o iniciar sesión para completar la compra."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos Mercado Pago (tarjetas de crédito y débito), transferencia bancaria y efectivo (solo para retiro en tienda)."
        },
        {
            question: "¿Cuánto demora el envío?",
            answer: "Los envíos dentro de la ciudad se realizan en 24-48 horas. Para el interior del país, el tiempo estimado es de 3-7 días hábiles dependiendo de la ubicación."
        },
        {
            question: "¿Puedo devolver un producto?",
            answer: "Sí, aceptamos devoluciones dentro de los 30 días de la compra. El producto debe estar sin usar y en su empaque original. Los productos en oferta no admiten devolución."
        },
        {
            question: "¿Cómo hago seguimiento de mi pedido?",
            answer: "Puedes hacer seguimiento de tu pedido desde tu cuenta, en la sección 'Mis Órdenes'. Recibirás actualizaciones por correo electrónico sobre el estado de tu envío."
        },
        {
            question: "¿Tienen tienda física?",
            answer: "Sí, contamos con tienda física donde puedes retirar tus pedidos o comprar directamente. Consulta nuestros horarios de atención más abajo."
        },
        {
            question: "¿Los productos tienen garantía?",
            answer: "Todos nuestros productos cuentan con garantía del fabricante. El período de garantía varía según el producto. Consulta los detalles en la descripción de cada artículo."
        },
        {
            question: "¿Puedo modificar mi pedido después de realizarlo?",
            answer: "Si tu pedido aún está en estado 'Pendiente', puedes cancelarlo y realizar uno nuevo. Una vez que el pedido está en proceso, no se pueden hacer modificaciones."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <HelpCircle className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            ¿Cómo podemos ayudarte?
                        </h1>
                        <p className="text-xl text-blue-100">
                            Encuentra respuestas rápidas o contáctanos directamente
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Preguntas Frecuentes
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-white rounded-xl shadow-md overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 pr-4">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-blue-600 transition-transform flex-shrink-0 ${openFaq === index ? "transform rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-6 pb-4"
                                        >
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Options */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Canales de Contacto
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600 mb-4">
                                    Respuesta en 24-48 horas
                                </p>
                                <a
                                    href="mailto:soporte@tiendalv.com"
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    soporte@tiendalv.com
                                </a>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                                <p className="text-gray-600 mb-4">
                                    Respuesta inmediata
                                </p>
                                <a
                                    href="https://wa.me/5491234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:underline font-semibold"
                                >
                                    +54 9 11 2345-6789
                                </a>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Teléfono</h3>
                                <p className="text-gray-600 mb-4">
                                    Lun-Vie 9:00-18:00
                                </p>
                                <a
                                    href="tel:+541112345678"
                                    className="text-purple-600 hover:underline font-semibold"
                                >
                                    (011) 1234-5678
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Business Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-8 mb-12"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Horarios de Atención
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Tienda Física</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Lunes a Viernes: 9:00 - 20:00</p>
                                    <p>Sábados: 10:00 - 18:00</p>
                                    <p>Domingos: Cerrado</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Soporte Online</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Lunes a Viernes: 9:00 - 18:00</p>
                                    <p>Sábados: 10:00 - 14:00</p>
                                    <p>Domingos: Cerrado</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Enlaces Útiles
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Link
                                href="/user/orders"
                                className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <span>→</span>
                                <span>Rastrear mi pedido</span>
                            </Link>
                            <Link
                                href="/terms"
                                className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <span>→</span>
                                <span>Términos y Condiciones</span>
                            </Link>
                            <Link
                                href="/privacy"
                                className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <span>→</span>
                                <span>Política de Privacidad</span>
                            </Link>
                            <Link
                                href="/shop"
                                className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                <span>→</span>
                                <span>Ver Catálogo</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
