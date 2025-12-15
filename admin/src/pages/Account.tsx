import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Save, User, Lock, KeyRound, Mail, ShieldCheck, CheckCircle2, Camera, AlertTriangle } from "lucide-react";
import ImageUpload from "@/components/ui/image.upload";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Schema for Profile Update
const profileSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    avatar: z.any().optional(),
});

// Schema for Password Update
const passwordSchema = z.object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Account = () => {
    const { user, setUser } = useAuthStore();
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

    const formProfile = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            avatar: "",
        },
    });

    const formPassword = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (user) {
            formProfile.reset({
                name: user.name,
                email: user.email,
                avatar: user.avatar || "",
            });
        }
    }, [user, formProfile]);

    const onProfileSubmit = async (data: ProfileFormValues) => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const { data: updatedUser } = await axiosPrivate.put(`/users/${user._id}`, {
                name: data.name,
                avatar: data.avatar,
                email: data.email,
            });

            setUser({
                ...user,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
            });

            toast.success("Perfil actualizado correctamente");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        if (!user?._id) return;
        setLoading(true);
        try {
            await axiosPrivate.put(`/users/${user._id}`, {
                password: data.password,
            });
            toast.success("Contraseña actualizada correctamente");
            formPassword.reset();
        } catch (error: any) {
            console.error("Error updating password:", error);
            toast.error(error.response?.data?.message || "Error al actualizar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Professional Header Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sidebar to-sidebar-accent border border-sidebar-border shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/5 mask-image-gradient-b"></div>

                <div className="relative z-10 px-8 py-10 md:py-14 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-sidebar bg-sidebar overflow-hidden shadow-xl">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-sidebar-accent text-sidebar-foreground">
                                    <User size={64} />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-sidebar cursor-pointer hover:bg-primary/90 transition-colors">
                            <Camera size={16} />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1 mb-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                        >
                            {user?.name}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-center md:justify-start gap-3 mt-2 text-sidebar-foreground"
                        >
                            <Mail size={16} />
                            <span className="text-lg">{user?.email}</span>
                            <span className="hidden md:inline-block mx-2 text-sidebar-border">|</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20 capitalize">
                                {user?.role}
                            </span>
                        </motion.div>
                    </div>

                    <div className="flex bg-sidebar-accent/50 p-1 rounded-xl border border-sidebar-border/50 backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                activeTab === "profile"
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <User size={16} />
                            <span>Perfil</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                activeTab === "security"
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <ShieldCheck size={16} />
                            <span>Seguridad</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="border-border/50 shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border/50 pb-8 pt-8 px-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-bold">Información Personal</CardTitle>
                                            <CardDescription className="text-base mt-2">
                                                Actualiza tu imagen de perfil y detalles de la cuenta.
                                            </CardDescription>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={24} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10">
                                    <form onSubmit={formProfile.handleSubmit(onProfileSubmit)} className="space-y-8">
                                        <div className="flex flex-col md:flex-row gap-10">
                                            <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
                                                <div className="relative group cursor-pointer w-full">
                                                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors bg-muted/10 flex flex-col items-center justify-center">
                                                        <Controller
                                                            control={formProfile.control}
                                                            name="avatar"
                                                            render={({ field }) => (
                                                                <ImageUpload
                                                                    value={field.value}
                                                                    onChange={(val) => field.onChange(val)}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Formatos permitidos: JPG, PNG. <br /> Máximo 5MB.
                                                </p>
                                            </div>

                                            <div className="w-full md:w-2/3 space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-foreground/80">Nombre Completo</Label>
                                                    <div className="relative group">
                                                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            className="pl-10 h-11 bg-background/50 border-input group-focus-within:ring-2 group-focus-within:ring-primary/20 group-focus-within:border-primary transition-all duration-300"
                                                            {...formProfile.register("name")}
                                                        />
                                                    </div>
                                                    {formProfile.formState.errors.name && (
                                                        <p className="text-sm text-destructive font-medium">{formProfile.formState.errors.name.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-foreground/80">Correo Electrónico</Label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            className="pl-10 h-11 bg-background/50 border-input group-focus-within:ring-2 group-focus-within:ring-primary/20 group-focus-within:border-primary transition-all duration-300"
                                                            {...formProfile.register("email")}
                                                        />
                                                    </div>
                                                    {formProfile.formState.errors.email && (
                                                        <p className="text-sm text-destructive font-medium">{formProfile.formState.errors.email.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="bg-border/60" />

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-8 h-11 rounded-xl font-medium transition-all hover:-translate-y-0.5"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-5 w-5" />
                                                        Guardar Cambios
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="border-border/50 shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border/50 pb-8 pt-8 px-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-bold">Seguridad de la Cuenta</CardTitle>
                                            <CardDescription className="text-base mt-2">
                                                Protege tu cuenta con una contraseña segura.
                                            </CardDescription>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                            <Lock size={24} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10">
                                    <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex items-start gap-3">
                                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600 mt-0.5">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-amber-900">Recomendación de Seguridad</h4>
                                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                                Para mayor seguridad, utiliza una contraseña de al menos 12 caracteres que incluya mayúsculas, minúsculas, números y símbolos especiales.
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={formPassword.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-2xl mx-auto">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground/80">Nueva Contraseña</Label>
                                            <div className="relative group">
                                                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 h-11 bg-background/50 border-input group-focus-within:ring-2 group-focus-within:ring-primary/20 group-focus-within:border-primary transition-all duration-300"
                                                    {...formPassword.register("password")}
                                                />
                                            </div>
                                            {formPassword.formState.errors.password && (
                                                <p className="text-sm text-destructive font-medium">{formPassword.formState.errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground/80">Confirmar Contraseña</Label>
                                            <div className="relative group">
                                                <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 h-11 bg-background/50 border-input group-focus-within:ring-2 group-focus-within:ring-primary/20 group-focus-within:border-primary transition-all duration-300"
                                                    {...formPassword.register("confirmPassword")}
                                                />
                                            </div>
                                            {formPassword.formState.errors.confirmPassword && (
                                                <p className="text-sm text-destructive font-medium">{formPassword.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <Separator className="bg-border/60 my-6" />

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-8 h-11 rounded-xl font-medium transition-all hover:-translate-y-0.5 w-full md:w-auto"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Actualizando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="mr-2 h-5 w-5" />
                                                        Actualizar Contraseña
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Account;