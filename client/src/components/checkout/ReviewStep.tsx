import { Order } from "@/lib/orderApi";
import { Address } from "@/types/type";
import PriceFormatter from "../common/PriceFormatter";
import Image from "next/image";
import { Button } from "../ui/button";
import { MapPin, Truck, Store, CreditCard, Banknote } from "lucide-react";

interface ReviewStepProps {
    order: Order | any; // Using any for tempOrder structure flexibility
    deliveryMethod: "shipping" | "pickup";
    paymentMethod: string;
    shippingAddress: Address | null;
    onConfirm: () => void;
    onBack: () => void;
    processing: boolean;
}

const ReviewStep = ({
    order,
    deliveryMethod,
    paymentMethod,
    shippingAddress,
    onConfirm,
    onBack,
    processing
}: ReviewStepProps) => {

    const calculateTotal = () => {
        // Logic duplicated from CheckoutPage for display
        // In a real app, this should be consistent or passed as prop
        const subtotal = order.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
        const shipping = deliveryMethod === "pickup" ? 0 : (subtotal > 100 ? 0 : 15); // Mock logic
        const tax = subtotal * 0.08;

        // Apply discount for transfer
        let discount = 0;
        if (paymentMethod === "transferencia") {
            discount = (subtotal + tax + shipping) * 0.10;
        }

        return (subtotal + shipping + tax) - discount;
    };

    const getPaymentLabel = (method: string) => {
        switch (method) {
            case "mercadopago": return "Mercado Pago";
            case "transferencia": return "Transferencia Bancaria";
            case "efectivo": return "Efectivo";
            default: return method;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Revisa tu compra</h2>
                <p className="text-gray-500 mt-1">Ya casi es tuyo. Verifica que todo esté correcto.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/50">
                    {/* Section 1: Delivery */}
                    <div className="p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Entrega</h3>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-xl border border-gray-100 text-gray-700">
                                {deliveryMethod === "shipping" ? <Truck className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                    {deliveryMethod === "shipping" ? "Envío a Domicilio" : "Retiro en Local"}
                                </h4>
                                <p className="text-gray-600 mt-1 leading-relaxed">
                                    {deliveryMethod === "shipping" && shippingAddress
                                        ? `${shippingAddress.street}, ${shippingAddress.city}`
                                        : "Local Comercial - Corrientes"}
                                </p>
                                {deliveryMethod === "shipping" && (
                                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md mt-2 inline-block">
                                        Llega en 3-5 días hábiles
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Payment */}
                    <div className="p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Pago</h3>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-xl border border-gray-100 text-gray-700">
                                {paymentMethod === "efectivo" ? <Banknote className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                    {getPaymentLabel(paymentMethod)}
                                </h4>
                                <p className="text-gray-600 mt-1">
                                    {paymentMethod === "efectivo"
                                        ? "Pagas al momento de la entrega/retiro."
                                        : paymentMethod === "transferencia"
                                            ? "Te enviaremos los datos bancarios por email."
                                            : "Procesado de forma segura por Mercado Pago."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="p-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Productos</h3>
                    <div className="divide-y divide-gray-50">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                        {item.image && <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain p-1" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                                    </div>
                                </div>
                                <PriceFormatter amount={item.price * item.quantity} className="font-bold text-gray-900" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="bg-gray-900 text-white p-6 md:p-8 flex justify-between items-center mt-auto">
                    <div>
                        <p className="text-gray-400 text-sm">Total a Pagar</p>
                        {paymentMethod === "transferencia" && <span className="text-xs text-green-400 font-medium">Incluye 10% OFF</span>}
                    </div>
                    <PriceFormatter amount={calculateTotal()} className="text-3xl font-bold" />
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <button onClick={onBack} disabled={processing} className="text-gray-500 hover:text-black font-medium transition-colors px-4 py-2">Volver</button>
                <Button
                    onClick={onConfirm}
                    disabled={processing}
                    size="lg"
                    className="bg-black text-white px-10 py-6 rounded-xl text-lg font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-xl shadow-black/20"
                >
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Procesando...
                        </span>
                    ) : "Confirmar Compra"}
                </Button>
            </div>
        </div>
    );
};

export default ReviewStep;
