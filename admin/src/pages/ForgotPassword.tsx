import { useState } from "react";
import { Link } from "react-router";
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
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

const forgotPasswordSchema = z.object({
    email: z.string().email("Dirección de correo electrónico no válida"),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: FormData) {
        setIsLoading(true);
        try {
            await adminApi.post("/auth/forgot-password", { email: data.email });
            setEmailSent(true);
            toast.success("Correo enviado. Revisa tu bandeja de entrada.");
        } catch (error: any) {
            console.error("Error al solicitar recuperación:", error);
            toast.error(
                error.response?.data?.message ||
                "Error al enviar el correo. Por favor, intenta de nuevo."
            );
        } finally {
            setIsLoading(false);
        }
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
                                ¿Olvidaste tu contraseña?
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                {emailSent
                                    ? "Revisa tu correo electrónico"
                                    : "Ingresa tu correo para recibir un enlace de recuperación"}
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        {emailSent ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-gray-600">
                                    Hemos enviado un enlace de recuperación a{" "}
                                    <span className="font-semibold">{form.watch("email")}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    El enlace expirará en 1 hora. Si no recibes el correo, revisa tu carpeta de spam.
                                </p>
                                <Link to="/login">
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Volver al inicio de sesión
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Correo Electrónico
                                                </FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input
                                                            placeholder="admin@ejemplo.com"
                                                            type="email"
                                                            disabled={isLoading}
                                                            className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                            {...field}
                                                        />
                                                    </motion.div>
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
                                                    Enviando...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Mail size={16} />
                                                    Enviar enlace de recuperación
                                                </span>
                                            )}
                                        </Button>
                                    </motion.div>
                                    <Link to="/login">
                                        <Button
                                            variant="ghost"
                                            className="w-full"
                                            type="button"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Volver al inicio de sesión
                                        </Button>
                                    </Link>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
