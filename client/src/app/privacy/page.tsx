"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, UserCheck, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    const sections = [
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Información que Recopilamos",
            content: [
                "Información personal: nombre, correo electrónico, dirección de envío",
                "Información de pago: procesada de forma segura a través de Mercado Pago",
                "Información de navegación: cookies, dirección IP, tipo de navegador",
                "Historial de compras y preferencias de productos"
            ]
        },
        {
            icon: <UserCheck className="w-6 h-6" />,
            title: "Cómo Usamos tu Información",
            content: [
                "Procesar y gestionar tus pedidos",
                "Mejorar tu experiencia de compra",
                "Enviar actualizaciones sobre tus pedidos",
                "Personalizar recomendaciones de productos",
                "Cumplir con obligaciones legales"
            ]
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Seguridad de Datos",
            content: [
                "Utilizamos encriptación SSL para proteger tus datos",
                "Los datos de pago son procesados por Mercado Pago (certificado PCI DSS)",
                "Acceso restringido a información personal",
                "Copias de seguridad regulares de la base de datos",
                "Monitoreo constante de seguridad"
            ]
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Tus Derechos",
            content: [
                "Acceder a tu información personal",
                "Corregir datos incorrectos",
                "Solicitar la eliminación de tu cuenta",
                "Optar por no recibir comunicaciones de marketing",
                "Exportar tus datos personales"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <Shield className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Política de Privacidad
                        </h1>
                        <p className="text-xl text-indigo-100">
                            Tu privacidad es nuestra prioridad. Conoce cómo protegemos tus datos.
                        </p>
                        <p className="text-sm text-indigo-200 mt-4">
                            Última actualización: {new Date().toLocaleDateString('es-AR')}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Compromiso con tu Privacidad
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            En <strong>Tienda L&V</strong>, nos comprometemos a proteger tu privacidad y
                            garantizar la seguridad de tu información personal. Esta política explica cómo
                            recopilamos, usamos y protegemos tus datos cuando utilizas nuestro sitio web.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 3) }}
                            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {section.title}
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {section.content.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-600">
                                        <span className="text-indigo-600 mt-1">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Cookies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Uso de Cookies
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Utilizamos cookies para mejorar tu experiencia en nuestro sitio web.
                            Las cookies nos ayudan a:
                        </p>
                        <ul className="space-y-2 text-gray-600 mb-4">
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600">•</span>
                                <span>Recordar tus preferencias y configuración</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600">•</span>
                                <span>Mantener tu sesión activa</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-indigo-600">•</span>
                                <span>Analizar el tráfico del sitio</span>
                            </li>
                        </ul>
                        <p className="text-gray-600">
                            Puedes configurar tu navegador para rechazar cookies, pero esto puede
                            afectar algunas funcionalidades del sitio.
                        </p>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <Mail className="w-8 h-8 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                ¿Preguntas sobre tu Privacidad?
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Si tienes alguna pregunta sobre esta política de privacidad o sobre
                            cómo manejamos tus datos, no dudes en contactarnos.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/help"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Contactar Soporte
                            </Link>
                            <Link
                                href="/terms"
                                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                Ver Términos de Servicio
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
