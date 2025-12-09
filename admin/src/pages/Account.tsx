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
import { Loader2, Save, User, Lock, KeyRound, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import ImageUpload from "@/components/ui/image.upload";
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
    const [activeSection, setActiveSection] = useState<"profile" | "security">("profile");

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-16">
            {/* Header / Cover con diseño mejorado */}
            <div className="h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Efectos visuales de fondo */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Elementos decorativos */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8 relative z-10">
                    <div className="flex items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative group">
                            {/* Avatar con efectos mejorados */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white relative z-10 transform transition-transform group-hover:scale-105">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-400">
                                        <User size={56} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pb-3 text-white z-10 flex-1">
                            <h1 className="text-4xl font-bold mb-1 tracking-tight">{user?.name}</h1>
                            <p className="text-indigo-100 flex items-center gap-2 mb-3 text-sm">
                                <Mail size={16} strokeWidth={2} /> 
                                <span>{user?.email}</span>
                            </p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-lg">
                                <CheckCircle2 size={14} className="mr-1.5" />
                                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Nav mejorado */}
                    <div className="lg:col-span-3">
                        <nav className="space-y-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-3">
                            <button
                                onClick={() => setActiveSection("profile")}
                                className={cn(
                                    "w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200",
                                    activeSection === "profile"
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-lg",
                                    activeSection === "profile" ? "bg-white/20" : "bg-slate-100"
                                )}>
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                Información Personal
                            </button>
                            <button
                                onClick={() => setActiveSection("security")}
                                className={cn(
                                    "w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200",
                                    activeSection === "security"
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-lg",
                                    activeSection === "security" ? "bg-white/20" : "bg-slate-100"
                                )}>
                                    <ShieldCheck size={18} strokeWidth={2.5} />
                                </div>
                                Seguridad y Contraseña
                            </button>
                        </nav>

                        {/* Info Card adicional */}
                        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <ShieldCheck size={20} className="text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-slate-800">Cuenta Verificada</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Tu cuenta está protegida y verificada. Mantén tu información actualizada.
                            </p>
                        </div>
                    </div>

                    {/* Content Area mejorado */}
                    <div className="lg:col-span-9 space-y-6">
                        {activeSection === "profile" && (
                            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                                            <User size={24} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">Editar Perfil</CardTitle>
                                            <CardDescription className="text-base">Actualiza tu foto y datos personales</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={formProfile.handleSubmit(onProfileSubmit)} className="space-y-8">
                                        <div className="flex flex-col md:flex-row gap-10 items-start">
                                            <div className="space-y-4">
                                                <Label className="text-base font-semibold text-slate-700">Foto de Perfil</Label>
                                                <div className="w-44">
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
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    JPG, PNG o GIF. Máx 5MB.
                                                </p>
                                            </div>

                                            <div className="flex-1 space-y-6 w-full">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="name" className="text-base font-semibold text-slate-700">
                                                        Nombre Completo
                                                    </Label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-3.5 h-5 w-5 text-indigo-400" strokeWidth={2} />
                                                        <Input 
                                                            id="name" 
                                                            className="pl-12 h-12 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl text-base" 
                                                            {...formProfile.register("name")} 
                                                        />
                                                    </div>
                                                    {formProfile.formState.errors.name && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1.5">
                                                            <span className="text-xs">⚠</span>
                                                            {formProfile.formState.errors.name.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid gap-3">
                                                    <Label htmlFor="email" className="text-base font-semibold text-slate-700">
                                                        Correo Electrónico
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-indigo-400" strokeWidth={2} />
                                                        <Input 
                                                            id="email" 
                                                            className="pl-12 h-12 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl text-base" 
                                                            {...formProfile.register("email")} 
                                                        />
                                                    </div>
                                                    {formProfile.formState.errors.email && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1.5">
                                                            <span className="text-xs">⚠</span>
                                                            {formProfile.formState.errors.email.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6 border-t border-slate-100">
                                            <Button 
                                                type="submit" 
                                                disabled={loading} 
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/30 h-12 px-8 rounded-xl font-semibold transition-all hover:scale-105"
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
                        )}

                        {activeSection === "security" && (
                            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                                            <ShieldCheck size={24} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">Seguridad</CardTitle>
                                            <CardDescription className="text-base">Gestiona tu contraseña y acceso a la cuenta</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={formPassword.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-2xl">
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0">
                                                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-amber-900 mb-1">Recomendación de Seguridad</h4>
                                                    <p className="text-sm text-amber-800">
                                                        Usa una contraseña fuerte con al menos 8 caracteres, mayúsculas, minúsculas y números.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="password" className="text-base font-semibold text-slate-700">
                                                Nueva Contraseña
                                            </Label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-indigo-400" strokeWidth={2} />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    className="pl-12 h-12 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl text-base"
                                                    placeholder="••••••••"
                                                    {...formPassword.register("password")}
                                                />
                                            </div>
                                            {formPassword.formState.errors.password && (
                                                <p className="text-sm text-red-500 flex items-center gap-1.5">
                                                    <span className="text-xs">⚠</span>
                                                    {formPassword.formState.errors.password.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="confirmPassword" className="text-base font-semibold text-slate-700">
                                                Confirmar Contraseña
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-indigo-400" strokeWidth={2} />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    className="pl-12 h-12 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl text-base"
                                                    placeholder="••••••••"
                                                    {...formPassword.register("confirmPassword")}
                                                />
                                            </div>
                                            {formPassword.formState.errors.confirmPassword && (
                                                <p className="text-sm text-red-500 flex items-center gap-1.5">
                                                    <span className="text-xs">⚠</span>
                                                    {formPassword.formState.errors.confirmPassword.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-end pt-6 border-t border-slate-100">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/30 h-12 px-8 rounded-xl font-semibold transition-all hover:scale-105"
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;