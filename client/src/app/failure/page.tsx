"use client";

import { motion } from "framer-motion";
import { XCircle, RefreshCw, CreditCard, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FailurePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-8"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-white rounded-full p-6 shadow-2xl">
                            <XCircle className="w-24 h-24 text-red-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pago No Procesado
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cargo.
                    </p>

                    {/* Possible Reasons */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-left">
                        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-red-600" />
                            Posibles causas:
                        </h2>
                        <ul className="space-y-2 text-gray-700 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span>Fondos insuficientes en la tarjeta</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span>Datos de pago incorrectos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span>Tarjeta vencida o bloqueada</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span>Límite de compra excedido</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span>Problema de conexión durante el proceso</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.back()}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Reintentar Pago
                        </motion.button>

                        <Link
                            href="/user/cart"
                            className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver al Carrito
                        </Link>
                    </div>

                    {/* Alternative Payment Methods */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Métodos de Pago Alternativos
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-900 mb-1">Transferencia Bancaria</p>
                                <p className="text-gray-600">Paga directamente desde tu banco</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-900 mb-1">Efectivo en Tienda</p>
                                <p className="text-gray-600">Retira y paga en nuestra tienda</p>
                            </div>
                        </div>
                    </div>

                    {/* Help Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">
                            ¿Necesitas ayuda con tu pago?
                        </p>
                        <Link
                            href="/help"
                            className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                        >
                            Contactar Soporte →
                        </Link>
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-center text-sm text-gray-500"
                >
                    <p>
                        Si el problema persiste, por favor{" "}
                        <Link href="/help" className="text-indigo-600 hover:underline">
                            contáctanos
                        </Link>
                        {" "}y te ayudaremos a completar tu compra.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
