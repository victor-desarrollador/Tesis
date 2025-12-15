import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Envío Gratis",
        description: "En compras superiores a $100.000",
    },
    {
        icon: ShieldCheck,
        title: "Compra Segura",
        description: "Protegemos tus datos personales",
    },
    {
        icon: CreditCard,
        title: "Medios de Pago",
        description: "Cuotas sin interés con tarjetas",
    },
    {
        icon: Headphones,
        title: "Soporte 24/7",
        description: "Atención al cliente personalizada",
    },
];

const FeaturesSection = () => {
    return (
        <div className="w-full bg-tiendaLVSoft/50 py-12 border-y border-tiendaLVSecondary/10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-full bg-white shadow-sm text-tiendaLVSecondary mb-1">
                            <feature.icon size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;
