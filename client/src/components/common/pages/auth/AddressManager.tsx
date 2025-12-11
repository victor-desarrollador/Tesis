import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import authApi from "@/lib/authApi";
import { useUserStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, MapPin, Plus, Trash2, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema validation
const addressSchema = z.object({
    street: z.string().min(3, "La dirección debe tener al menos 3 caracteres"),
    city: z.string().min(2, "La ciudad es requerida"),
    country: z.string().min(2, "El país es requerido"),
    postalCode: z.string().min(2, "El código postal es requerido"),
    isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface Address {
    _id: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}

const AddressManager = () => {
    const { authUser, verifyAuth, updateUser } = useUserStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            city: "",
            country: "",
            postalCode: "",
            isDefault: false,
        },
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Force fetch profile
            const response = await authApi.get("/auth/profile");
            if (response.success && response.data) {
                updateUser(response.data);
                toast.success("Información actualizada");
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
            toast.error("No se pudo actualizar la información");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleOpenModal = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            form.reset({
                street: address.street || "",
                city: address.city || "",
                country: address.country || "",
                postalCode: address.postalCode || "",
                isDefault: address.isDefault || false,
            });
        } else {
            setEditingAddress(null);
            form.reset({
                street: "",
                city: "",
                country: "",
                postalCode: "",
                isDefault: false,
            });
        }
        setIsModalOpen(true);
    };

    const onSubmit = async (data: AddressFormValues) => {
        setIsLoading(true);
        try {
            if (editingAddress) {
                // Update existing
                const response = await authApi.put(
                    `/users/${authUser?._id}/addresses/${editingAddress._id}`,
                    data
                );
                if (response.success && response.data) {
                    toast.success("Dirección actualizada exitosamente");
                    // Update local store directly with returned addresses
                    if (authUser && response.data.addresses) {
                        updateUser({ ...authUser, addresses: response.data.addresses });
                    }
                    setIsModalOpen(false);
                } else {
                    toast.error(response.error?.message || "Error al actualizar dirección");
                }
            } else {
                // Create new
                const response = await authApi.post(
                    `/users/${authUser?._id}/addresses`,
                    data
                );
                if (response.success && response.data) {
                    toast.success("Dirección agregada exitosamente");
                    // Update local store directly with returned addresses
                    if (authUser && response.data.addresses) {
                        updateUser({ ...authUser, addresses: response.data.addresses });
                    }
                    setIsModalOpen(false);
                } else {
                    toast.error(response.error?.message || "Error al agregar dirección");
                }
            }
        } catch (error) {
            console.error("Error submitting address:", error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (addressId: string) => {
        setDeletingId(addressId);
        try {
            const response = await authApi.delete(
                `/users/${authUser?._id}/addresses/${addressId}`
            );
            if (response.success && response.data) {
                toast.success("Dirección eliminada");
                // Update local store directly with returned addresses
                if (authUser && response.data.addresses) {
                    updateUser({ ...authUser, addresses: response.data.addresses });
                }
            } else {
                toast.error("Error al eliminar la dirección");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Error al eliminar la dirección");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mis Direcciones</h2>
                <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus size={16} /> Agregar Nueva
                </Button>
            </div>

            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="text-gray-500">
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Actualizar Lista
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {authUser?.addresses && authUser.addresses.length > 0 ? (
                    authUser.addresses.map((addr) => (
                        <Card key={addr._id} className="relative group">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-gray-500" />
                                        {addr.isDefault && (
                                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                                                Predeterminada
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                            onClick={() => handleOpenModal(addr)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                                            onClick={() => handleDelete(addr._id)}
                                            disabled={deletingId === addr._id}
                                        >
                                            {deletingId === addr._id ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-gray-800">{addr.street}</p>
                                <p className="text-gray-500 text-sm">
                                    {addr.city}, {addr.postalCode}
                                </p>
                                <p className="text-gray-500 text-sm">{addr.country}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <MapPin className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-500">No tienes direcciones guardadas.</p>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? "Editar Dirección" : "Agregar Dirección"}
                        </DialogTitle>
                        <DialogDescription>
                            Asegúrate de que la información sea correcta para el envío.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Calle y Número</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Av. Principal 123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ciudad</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Buenos Aires" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código Postal</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 1414" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>País</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Argentina" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isDefault"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Usar como predeterminada</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        "Guardar Dirección"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddressManager;
