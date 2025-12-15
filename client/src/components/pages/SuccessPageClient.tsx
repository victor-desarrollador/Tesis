"use client";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Home, Package, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

const SuccessPageClient = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("external_reference");
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart on successful payment
    if (status === "approved") {
      clearCart();
    }
  }, [status, clearCart]);

  const renderContent = () => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="w-20 h-20 text-green-500" />,
          title: "¡Pago Exitoso!",
          message: "Tu pedido ha sido procesado correctamente. Te hemos enviado un email con los detalles.",
          color: "bg-green-50 border-green-200",
          textColor: "text-green-800"
        };
      case "in_process":
      case "pending":
        return {
          icon: <Clock className="w-20 h-20 text-amber-500" />,
          title: "Pago Pendiente",
          message: "Tu pago está siendo procesado. Te avisaremos cuando se confirme.",
          color: "bg-amber-50 border-amber-200",
          textColor: "text-amber-800"
        };
      case "rejected":
      case "failure":
        return {
          icon: <XCircle className="w-20 h-20 text-red-500" />,
          title: "Pago Rechazado",
          message: "Hubo un problema con tu pago. Por favor, intenta nuevamente.",
          color: "bg-red-50 border-red-200",
          textColor: "text-red-800"
        };
      default:
        return {
          icon: <CheckCircle className="w-20 h-20 text-blue-500" />,
          title: "¡Gracias por tu compra!",
          message: "Tu pedido ha sido recibido. Revisa tu email para más detalles.",
          color: "bg-blue-50 border-blue-200",
          textColor: "text-blue-800"
        };
    }
  };

  const content = renderContent();

  return (
    <Container className="min-h-[70vh] flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        <div className={`rounded-3xl p-8 md:p-12 text-center border ${content.color} shadow-sm`}>
          <div className="flex justify-center mb-6 bg-white w-fit mx-auto p-4 rounded-full shadow-sm">
            {content.icon}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {content.message}
          </p>

          <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100 shadow-sm text-left">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Detalles de la Transacción</h3>
            <div className="space-y-3">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Orden:</span>
                  <span className="font-medium text-gray-900 font-mono">#{orderId.slice(-6)}</span>
                </div>
              )}
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Pago:</span>
                  <span className="font-medium text-gray-900 font-mono">{paymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-sm ${content.color} ${content.textColor} capitalize`}>
                  {status === 'approved' ? 'Aprobado' : status === 'pending' ? 'Pendiente' : 'Rechazado'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user/orders" className="w-full sm:w-auto">
              <Button className="w-full h-12 rounded-xl bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Package className="w-5 h-5 mr-2" />
                Ver Mis Pedidos
              </Button>
            </Link>
            <Link href="/shop" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 rounded-xl border-gray-300 hover:bg-gray-50 text-gray-700">
                <Home className="w-5 h-5 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default SuccessPageClient;
