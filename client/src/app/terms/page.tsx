"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingCart, Package, CreditCard, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    const sections = [
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Aceptación de Términos",
            content: `Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso. 
      Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio web.`
        },
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            title: "Condiciones de Compra",
            points: [
                "Todos los precios están expresados en pesos argentinos (ARS)",
                "Los precios pueden cambiar sin previo aviso",
                "Las ofertas y promociones son válidas hasta agotar stock",
                "Nos reservamos el derecho de limitar cantidades por cliente",
                "La confirmación de compra se enviará por correo electrónico"
            ]
        },
        {
            icon: <Package className="w-6 h-6" />,
            title: "Envíos y Entregas",
            points: [
                "Realizamos envíos a todo el país",
                "Los tiempos de entrega son estimados y pueden variar",
                "El cliente es responsable de proporcionar una dirección correcta",
                "Opción de retiro en tienda disponible",
                "Los costos de envío se calculan según destino y peso"
            ]
        },
        {
            icon: <RefreshCw className="w-6 h-6" />,
            title: "Devoluciones y Reembolsos",
            points: [
                "Aceptamos devoluciones dentro de los 30 días de la compra",
                "Los productos deben estar sin usar y en su empaque original",
                "Los productos en oferta no admiten devolución",
                "El reembolso se procesará dentro de 7-10 días hábiles",
                "Los costos de envío de devolución corren por cuenta del cliente"
            ]
        },
        {
            icon: <CreditCard className="w-6 h-6" />,
            title: "Métodos de Pago",
            points: [
                "Aceptamos Mercado Pago (tarjetas de crédito y débito)",
                "Transferencia bancaria",
                "Efectivo (solo retiro en tienda)",
                "Todas las transacciones son seguras y encriptadas",
                "No almacenamos información de tarjetas de crédito"
            ]
        },
        {
            icon: <AlertCircle className="w-6 h-6" />,
            title: "Limitación de Responsabilidad",
            content: `Tienda L&V no se hace responsable por daños indirectos, incidentales o consecuentes 
      que puedan surgir del uso de nuestros productos o servicios. Nuestra responsabilidad se limita 
      al valor del producto comprado.`
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <FileText className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Términos y Condiciones
                        </h1>
                        <p className="text-xl text-purple-100">
                            Conoce las condiciones de uso de nuestro sitio y servicios
                        </p>
                        <p className="text-sm text-purple-200 mt-4">
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
                            Bienvenido a Tienda L&V
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Estos términos y condiciones describen las reglas y regulaciones para el uso del
                            sitio web de <strong>Tienda L&V</strong>, ubicado en{" "}
                            <a href="http://localhost:3000" className="text-indigo-600 hover:underline">
                                www.tiendalv.com
                            </a>.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones.
                            No continúes usando Tienda L&V si no estás de acuerdo con todos los términos y
                            condiciones establecidos en esta página.
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
                                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {section.title}
                                </h2>
                            </div>

                            {section.content && (
                                <p className="text-gray-600 leading-relaxed">
                                    {section.content}
                                </p>
                            )}

                            {section.points && (
                                <ul className="space-y-3">
                                    {section.points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600">
                                            <span className="text-purple-600 mt-1">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}

                    {/* Additional Terms */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Propiedad Intelectual
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos,
                            imágenes y software, es propiedad de Tienda L&V y está protegido por las leyes
                            de derechos de autor.
                        </p>
                        <p className="text-gray-600">
                            No está permitido reproducir, distribuir o modificar ningún contenido sin
                            autorización previa por escrito.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Modificaciones de los Términos
                        </h2>
                        <p className="text-gray-600">
                            Nos reservamos el derecho de modificar estos términos en cualquier momento.
                            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
                            Es tu responsabilidad revisar estos términos periódicamente.
                        </p>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            ¿Tienes Preguntas?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Si tienes alguna pregunta sobre estos términos y condiciones, por favor contáctanos.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/help"
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Contactar Soporte
                            </Link>
                            <Link
                                href="/privacy"
                                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                            >
                                Ver Política de Privacidad
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
