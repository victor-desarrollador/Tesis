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
import { registerSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStone";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

type FormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "cliente",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await register(data);
      navigate("/login");
      toast.success("¡Se registro correctamente!");
    } catch (error) {
      console.error("¡No se pudo registrar!", error);
      toast.error("¡No se pudo registrar!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md px-4"
      >
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-gray-800">
                Crear una cuenta
              </CardTitle>
              <CardDescription className="text-gray-500">
                Ingrese sus datos para registrarse
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre"
                          type="text"
                          disabled={isLoading}
                          className="border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-sm hoverEffect"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Correo Electronico
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ejemplo@correo.com"
                          type="email"
                          disabled={isLoading}
                          className="border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-sm hoverEffect"
                          {...field}
                        />
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
                        <Input
                          placeholder="********"
                          type="password"
                          disabled={isLoading}
                          className="border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-sm hoverEffect"
                          {...field}
                        />
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
                          placeholder="Cliente"
                          type="text"
                          disabled={true}
                          className="border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 hoverEffect text-white font-semibold py-2 rounded-lg"
                >
                  <UserPlus /> Registrarse
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Ya tienes una cuenta?{" "}
              <Link
                to={"/login"}
                className="text-indigo-600 hover:text-indigo-800 hoverEffect hover:underline"
              >
                Iniciar Sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;