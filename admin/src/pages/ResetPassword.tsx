import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Debe contener al menos una mayúscula, una minúscula y un número"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const token = searchParams.get("token");

    const form = useForm<FormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setValidatingToken(false);
                setTokenValid(false);
                return;
            }

            try {
                await adminApi.get(`/auth/reset-password/${token}`);
                setTokenValid(true);
            } catch (error) {
                console.error("Token inválido:", error);
                setTokenValid(false);
                toast.error("El enlace de recuperación no es válido o ha expirado");
            } finally {
                setValidatingToken(false);
            }
        };

        validateToken();
    }, [token]);

    async function onSubmit(data: FormData) {
        if (!token) return;

        setIsLoading(true);
        try {
            await adminApi.post(`/auth/reset-password/${token}`, {
                password: data.password,
            });
            setResetSuccess(true);
            toast.success("Contraseña actualizada exitosamente");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            console.error("Error al restablecer contraseña:", error);
            toast.error(
                error.response?.data?.message ||
                "Error al restablecer la contraseña. Intenta de nuevo."
            );
        } finally {
            setIsLoading(false);
        }
    }

    if (validatingToken) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-600">Validando enlace...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md px-4"
                >
                    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                Enlace Inválido
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Este enlace de recuperación no es válido o ha expirado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/forgot-password">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Solicitar nuevo enlace
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md px-4"
                >
                    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                ¡Contraseña Actualizada!
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Tu contraseña ha sido restablecida exitosamente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-sm text-gray-600 mb-4">
                                Serás redirigido al inicio de sesión en unos segundos...
                            </p>
                            <Link to="/login">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Ir a Iniciar Sesión
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md px-4"
            >
                <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border border-gray-200">
                    <CardHeader className="text-center space-y-2">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardTitle className="text-3xl font-bold text-gray-800">
                                Restablecer Contraseña
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Ingresa tu nueva contraseña
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Nueva Contraseña
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="••••••••"
                                                        type={showPassword ? "text" : "password"}
                                                        disabled={isLoading}
                                                        className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                                                        disabled={isLoading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Confirmar Contraseña
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="••••••••"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        disabled={isLoading}
                                                        className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                                                        disabled={isLoading}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="animate-spin h-5 w-5" />
                                                Actualizando...
                                            </span>
                                        ) : (
                                            "Restablecer Contraseña"
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
