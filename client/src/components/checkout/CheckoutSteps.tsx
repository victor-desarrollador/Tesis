import { Check } from "lucide-react";

interface CheckoutStepsProps {
    currentStep: number;
    steps: { id: number; label: string }[];
}

const CheckoutSteps = ({ currentStep, steps }: CheckoutStepsProps) => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-10">
            <div className="relative flex justify-between items-center w-full">
                {/* Absolute Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />

                {/* Dynamic Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-black z-0 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                    }}
                />

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 
                  ${isCompleted
                                        ? "bg-black border-black text-white"
                                        : isActive
                                            ? "bg-white border-black text-black shadow-lg scale-110"
                                            : "bg-white border-gray-200 text-gray-300"
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className={`text-sm font-bold ${isActive ? "text-black" : "text-gray-400"}`}>
                                        {step.id}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 hidden md:block
                  ${isActive || isCompleted ? "text-black" : "text-gray-300"
                                    }
                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutSteps;
