"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    toast.success(data.message);
                } else {
                    setStatus("error");
                    toast.error(data.message || "Error al verificar email");
                }
            } catch (error) {
                setStatus("error");
                toast.error("Error de conexión");
            }
        };

        verifyEmail();
    }, [token]);

    const handleLoginRedirect = () => {
        router.push("/auth/signin");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">Verificación de Email</CardTitle>
                    <CardDescription>Confirmando tu dirección de correo electrónico</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 py-6">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                            <p className="text-gray-600 font-medium">Verificando...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Email Verificado!</h3>
                                <p className="text-gray-600">Tu cuenta ha sido activada correctamente.</p>
                            </div>
                            <Button onClick={handleLoginRedirect} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                                Iniciar Sesión
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <XCircle className="h-16 w-16 text-red-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error de Verificación</h3>
                                <p className="text-gray-600">El token es inválido o ha expirado.</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/auth/signup")}
                                className="w-full mt-4"
                            >
                                Volver al Registro
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
