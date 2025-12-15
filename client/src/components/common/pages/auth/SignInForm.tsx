"use client";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { toast } from "sonner";
import authApi from "@/lib/authApi";

// Define the schema for the login form
const loginSchema = z.object({
  email: z.string().email("Dirección de correo electrónico no válida"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y la política de privacidad",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { setAuthToken, updateUser } = useUserStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: true,
    },
  });

  const login = async (data: LoginFormData): Promise<boolean> => {
    try {
      const response = await authApi.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        setAuthToken(token);
        updateUser(userData);
        return true;
      } else {
        toast.error(
          "Error al iniciar sesión. Comprueba tus credenciales e inténtalo de nuevo"
        );
        return false;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
      return false;
    }
  };

  const onSubmit: (data: LoginFormData) => Promise<void> = async (data) => {
    setIsLoading(true);
    const success = await login(data);
    if (success) {
      toast.success("Inicio de sesión exitoso");
      // Use window.location.href to force a full reload and ensure auth state is picked up
      window.location.href = "/";
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full px-4"
    >
      <Card className="w-full shadow-none border-0">
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            className="border-gray-300 focus:ring-2 focus:ring-tiendaLVSecondary focus:border-tiendaLVSecondary transition-all duration-200 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-tiendaLVSecondary"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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
                        className="border-gray-300 data-[state=checked]:bg-tiendaLVSecondary data-[state=checked]:border-tiendaLVSecondary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-500 font-normal">
                      Acepto la{" "}
                      <Link
                        href="/privacy"
                        className="text-tiendaLVSecondary hover:text-tiendaLVSecondary/80 hover:underline"
                      >
                        Política de Privacidad
                      </Link>{" "}
                      y los{" "}
                      <Link
                        href="/terms"
                        className="text-tiendaLVSecondary hover:text-tiendaLVSecondary/80 hover:underline"
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
                  className="w-full bg-tiendaLVAccent hover:bg-tiendaLVAccent/90 text-tiendaLVLight font-semibold h-12 rounded-lg transition-all duration-200"
                  disabled={isLoading || !form.watch("termsAccepted")}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Iniciando sesión
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn /> Iniciar sesión
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center flex flex-col gap-5">
          <p className="text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200"
            >
              Regístrate
            </Link>
          </p>
          <CardDescription className="text-sm text-gray-600 text-center flex flex-col items-center space-y-4">
            <h3 className="font-semibold mb-2">Sobre Nosotros</h3>
            <p>
              Bienvenido a nuestra plataforma, donde puedes explorar una amplia
              variedad de productos, gestionar tu carrito y rastrear tus
              pedidos de manera fluida. Nos esforzamos por proporcionar una
              experiencia de compra agradable con transacciones seguras y
              características personalizadas.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Protección de Datos</h3>
            <p>
              Tu privacidad es nuestra prioridad. Recopilamos solo datos
              necesarios (por ejemplo, nombre, correo electrónico) para procesar
              pedidos y mejorar tu experiencia. Todos los datos se cifran y se
              almacenan de manera segura, y nunca los compartimos con terceros
              sin consentimiento. Para más detalles, consulta nuestra{" "}
              <Link
                href="/privacy"
                className="text-tiendaLVSecondary hover:text-tiendaLVSecondary/80 hover:underline"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </CardDescription>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignInForm;
