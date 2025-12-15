import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuthStore from "@/store/useAuthStore";
import { loginSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("¡Bienvenido al panel de control!");
      // Delay navigation to avoid conflict with framer-motion
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      console.log("Error al iniciar sesión", error);
      // @ts-ignore
      const errorMessage = error.message || "Credenciales inválidas. Por favor, intente nuevamente.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md px-4"
      >
        <Card className="w-full bg-white shadow-2xl rounded-2xl border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 w-full" />
          <CardHeader className="text-center space-y-4 pt-8 pb-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <div className="p-3 bg-indigo-50 rounded-full">
                <LogIn className="w-8 h-8 text-indigo-600" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Acceso exclusivo para administradores
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@ejemplo.com"
                          type="email"
                          disabled={isLoading}
                          className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1.5" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          disabled={isLoading}
                          className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1.5" />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Verificando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Ingresar al Panel
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center bg-gray-50 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} Sistema de Gestión
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}