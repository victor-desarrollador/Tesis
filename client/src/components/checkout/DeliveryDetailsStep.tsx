import { Address } from "@/types/type";
import AddressSelection from "../pages/AddressSelection";
import { Clock, MapPin } from "lucide-react";

interface DeliveryDetailsStepProps {
    deliveryMethod: "shipping" | "pickup";
    selectedAddress: Address | null;
    onAddressSelect: (address: Address) => void;
    addresses: Address[];
    onAddressesUpdate: (addresses: Address[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const DeliveryDetailsStep = ({
    deliveryMethod,
    selectedAddress,
    onAddressSelect,
    addresses,
    onAddressesUpdate,
    onNext,
    onBack,
}: DeliveryDetailsStepProps) => {

    if (deliveryMethod === "pickup") {
        // Pickup View
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Retiro en Sucursal</h2>
                    <p className="text-gray-500 mt-1">Te esperamos en nuestro local</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Map Placeholder */}
                        <div className="w-full md:w-1/2 aspect-video bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
                            {/* Replace with actual map iframe or image later */}
                            <MapPin className="w-12 h-12 text-gray-400 group-hover:text-black transition-colors" />
                            <p className="sr-only">Mapa de ubicación</p>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">L&V Tienda Bebé</h3>
                                <p className="text-gray-600 flex items-start gap-2">
                                    <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>Av. Principal 1234, Centro<br />Ciudad de Corrientes, Corrientes</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Horarios de Atención
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
                                    <li>Lunes a Viernes: 09:00 - 20:00 hs</li>
                                    <li>Sábados: 09:00 - 13:00 hs</li>
                                    <li>Domingos y Feriados: Cerrado</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl">
                                💡 <strong>Importante:</strong> Podrás retirar tu pedido una vez que recibas la confirmación por email. Normalmente demora 2 horas hábiles.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <button onClick={onBack} className="text-gray-500 hover:text-black font-medium transition-colors px-4 py-2">Volver</button>
                    <button onClick={onNext} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg">Continuar</button>
                </div>
            </div>
        );
    }

    // Shipping View
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">¿A dónde lo enviamos?</h2>
                <p className="text-gray-500 mt-1">Selecciona una dirección guardada o agrega una nueva</p>
            </div>

            <AddressSelection
                selectedAddress={selectedAddress}
                onAddressSelect={onAddressSelect}
                addresses={addresses}
                onAddressesUpdate={onAddressesUpdate}
            />

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <button onClick={onBack} className="text-gray-500 hover:text-black font-medium transition-colors px-4 py-2">Volver</button>
                <button
                    onClick={onNext}
                    disabled={!selectedAddress}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    {selectedAddress ? "Continuar" : "Selecciona una dirección"}
                </button>
            </div>
        </div>
    );
};

export default DeliveryDetailsStep;
