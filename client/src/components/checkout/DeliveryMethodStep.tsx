import { Store, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryMethodStepProps {
    selectedMethod: "shipping" | "pickup";
    onMethodSelect: (method: "shipping" | "pickup") => void;
    onNext: () => void;
    onBack: () => void;
}

const DeliveryMethodStep = ({
    selectedMethod,
    onMethodSelect,
    onNext,
    onBack,
}: DeliveryMethodStepProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">¿Cómo quieres recibir tu compra?</h2>
                <p className="text-gray-500 mt-1">Selecciona la opción que mejor te convenga</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Shipping */}
                <div
                    onClick={() => onMethodSelect("shipping")}
                    className={cn(
                        "relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl group",
                        selectedMethod === "shipping"
                            ? "border-black bg-gray-50/50 shadow-lg"
                            : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "p-4 rounded-2xl transition-colors duration-300",
                                selectedMethod === "shipping"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            )}
                        >
                            <Truck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Envío a Domicilio</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Recíbelo en la comodidad de tu casa. Envíos gratis en compras superiores a $100.
                            </p>
                        </div>
                    </div>
                    {selectedMethod === "shipping" && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-black rounded-full shadow-lg shadow-black/20" />
                    )}
                </div>

                {/* Option 2: Pickup */}
                <div
                    onClick={() => onMethodSelect("pickup")}
                    className={cn(
                        "relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl group",
                        selectedMethod === "pickup"
                            ? "border-black bg-gray-50/50 shadow-lg"
                            : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "p-4 rounded-2xl transition-colors duration-300",
                                selectedMethod === "pickup"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            )}
                        >
                            <Store className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Retiro en Local</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Pasa a buscarlo por nuestra sucursal. ¡Listo en 2 horas!
                            </p>
                        </div>
                    </div>
                    {selectedMethod === "pickup" && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-black rounded-full shadow-lg shadow-black/20" />
                    )}
                </div>
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
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-black/20"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default DeliveryMethodStep;
