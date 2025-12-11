import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import authApi from "@/lib/authApi";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .optional()
        .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    avatar: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileEditForm = () => {
    const { authUser, verifyAuth } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: authUser?.name || "",
            password: "",
            confirmPassword: "",
            avatar: authUser?.avatar || "",
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true);
        try {
            const updateData: any = {
                name: data.name,
            };

            if (data.password) {
                updateData.password = data.password;
            }

            // Only include avatar if it changed (optimization needed in future)
            if (data.avatar && data.avatar !== authUser?.avatar) {
                updateData.avatar = data.avatar;
            }

            const response = await authApi.put(`/users/${authUser?._id}`, updateData);

            if (response.success) {
                toast.success("Perfil actualizado correctamente");
                await verifyAuth(); // Refresh user data
                form.reset({
                    name: data.name,
                    password: "",
                    confirmPassword: "",
                    avatar: data.avatar || authUser?.avatar,
                });
            } else {
                toast.error(response.error?.message || "Error al actualizar perfil");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Tu nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500">Cambiar Contraseña (Opcional)</h3>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nueva Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando cambios...
                        </>
                    ) : (
                        "Guardar Cambios"
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default ProfileEditForm;
