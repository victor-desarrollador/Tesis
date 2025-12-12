"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

const formSchema = z.object({
    email: z.string().email("Ingresa un email válido"),
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                toast.success("Email enviado correctamente");
            } else {
                toast.error(data.message || "Error al enviar solicitud");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="w-full max-w-md shadow-lg border-0">
                        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
                            <div className="bg-green-100 p-3 rounded-full">
                                <Mail className="h-10 w-10 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">¡Revisa tu correo!</h3>
                                <p className="text-gray-500 mt-2">
                                    Hemos enviado un enlace de recuperación a <strong>{form.getValues("email")}</strong>
                                </p>
                            </div>
                            <div className="w-full space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full h-11"
                                    asChild
                                >
                                    <Link href="/auth/signin">
                                        Volver al inicio de sesión
                                    </Link>
                                </Button>
                                <p className="text-sm text-gray-500">
                                    ¿No recibiste el email? <button onClick={() => onSubmit(form.getValues())} className="text-blue-600 hover:underline font-medium">Reenviar</button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1">
                    <Link href="/auth/signin" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4 w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Link>
                    <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
                    <CardDescription>
                        Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ejemplo@correo.com" {...field} className="h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando link...
                                    </>
                                ) : (
                                    "Enviar link de recuperación"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
