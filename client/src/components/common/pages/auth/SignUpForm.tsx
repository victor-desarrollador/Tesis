"use client";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import z from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { DoorOpen, LoaderCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define the schema for the form, including terms acceptance
const registerSchema = z
  .object({
    firstName: z.string().min(1, "Nombre es requerido"),
    lastName: z.string().min(1, "Apellido es requerido"),
    email: z.string().email("Correo electrónico es requerido"),
    password: z.string().min(8, "Contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirmar contraseña es requerido"),
    role: z.literal("cliente"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar la Politica de Privacidad y los Términos de Uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof registerSchema>;

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { register } = useUserStore();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "cliente",
      termsAccepted: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Cobine firstName and lastName into fullName
      const registerData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      await register(registerData);
      toast.success("¡Cuenta creada con éxito!");

      // Mostrar mensaje de verificación en lugar de redirigir inmediatamente
      toast.info("Te hemos enviado un email de verificación. Por favor revisa tu bandeja de entrada.", {
        duration: 5000,
      });

      // Opcional: Redirigir a una página de "Revisa tu email" o al login
      setTimeout(() => router.push("/auth/signin"), 3000);

    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error("Error en el registro. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full px-4"
      >
        <Card className="w-full shadow-none border-0">
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Nombre
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              placeholder="Nombre"
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
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Apellido
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              placeholder="Apellido"
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
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Correo electrónico
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="tu@email.com"
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="••••••••"
                            type="password"
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Confirmar Contraseña
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="••••••••"
                            type="password"
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
                <FormField
                  control={form.control}
                  name="role"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Rol
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Usuario"
                          type="text"
                          disabled
                          className="border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                          value="Cliente"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-gray-500 font-normal">
                        Estoy de acuerdo con la{" "}
                        <Link
                          href="/privacy"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Política de Privacidad
                        </Link>{" "}
                        y los{" "}
                        <Link
                          href="/terms"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Términos de Uso
                        </Link>
                      </FormLabel>
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
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 rounded-lg transition-all duration-200"
                    disabled={isLoading || !form.watch("termsAccepted")}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin" /> Creando
                        cuenta...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus /> Registrarse
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200"
              >
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpForm;
