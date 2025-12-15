import { Banknote, Building2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodStepProps {
    selectedMethod: string;
    onMethodSelect: (method: string) => void;
    onNext: () => void;
    onBack: () => void;
    deliveryMethod: "shipping" | "pickup";
}

const PaymentMethodStep = ({
    selectedMethod,
    onMethodSelect,
    onNext,
    onBack,
    deliveryMethod,
}: PaymentMethodStepProps) => {

    const paymentMethods = [
        {
            id: "mercadopago",
            label: "Mercado Pago",
            icon: CreditCard,
            description: "Tarjetas de crédito, débito y dinero en cuenta.",
            available: true,
            color: "bg-blue-500",
        },
        {
            id: "transferencia",
            label: "Transferencia Bancaria",
            icon: Building2,
            description: "10% de descuento abonando por transferencia.",
            available: true,
            color: "bg-green-600",
            badge: "-10% OFF"
        },
        {
            id: "efectivo",
            label: "Efectivo",
            icon: Banknote,
            description: deliveryMethod === "pickup"
                ? "Pagas al retirar en nuestro local."
                : "Pagas al recibir el pedido (solo zonas habilitadas).",
            available: true, // Could condition this on address location later
            color: "bg-emerald-500",
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Elige cómo pagar</h2>
                <p className="text-gray-500 mt-1">Todas las transacciones son seguras y encriptadas</p>
            </div>

            <div className="grid gap-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => method.available && onMethodSelect(method.id)}
                        className={cn(
                            "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 group",
                            selectedMethod === method.id
                                ? "border-black bg-gray-50/50 shadow-md"
                                : "border-gray-100 bg-white hover:border-gray-200",
                            !method.available && "opacity-50 cursor-not-allowed grayscale"
                        )}
                    >
                        <div
                            className={cn(
                                "p-3 rounded-xl transition-colors duration-300",
                                selectedMethod === method.id
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            )}
                        >
                            <method.icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">{method.label}</h3>
                                {method.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                        {method.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
                        </div>

                        {selectedMethod === method.id && (
                            <div className="w-4 h-4 bg-black rounded-full shadow-lg shadow-black/20 shrink-0" />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-black font-medium transition-colors px-4 py-2"
                >
                    Volver
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedMethod}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-black/20 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default PaymentMethodStep;
