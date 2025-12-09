/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Loader2, Plus, Trash, RefreshCw, ImageIcon, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/image.upload";
import { bannerSchema } from "@/lib/validation";
import type { Banner } from "@/lib/type";
import { motion } from "framer-motion";

type FormData = z.infer<typeof bannerSchema>;

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const { checkIsAdmin } = useAuthStore();
    const isAdmin = checkIsAdmin();

    const formAdd = useForm<FormData>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            name: "",
            title: "",
            startFrom: 0,
            image: "",
            bannerType: "",
        },
    });

    const formEdit = useForm<FormData>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            name: "",
            title: "",
            startFrom: 0,
            image: "",
            bannerType: "",
        },
    });

    const fetchBanners = async () => {
        try {
            const response = await axiosPrivate.get("/banners");
            setBanners(response.data);
        } catch (error) {
            console.log("No se pudieron cargar los publicidades", error);
            toast.error("No se pudieron cargar las publicidades");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axiosPrivate.get("/banners");
            setBanners(response.data);
            toast.success("Publicidades actualizadas correctamente");
        } catch (error) {
            console.log("No se pudieron cargar los publicidades", error);
            toast.error("No se pudieron cargar las publicidades");
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string => {
        if (!image) return "";
        if (typeof image === "string") return image;
        return image.url;
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        formEdit.reset({
            name: banner.name,
            title: banner.title,
            startFrom: banner.startFrom,
            image: getImageUrl(banner.image),
            bannerType: banner.bannerType,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsDeleteModalOpen(true);
    };

    const handleAddBanner = async (data: FormData) => {
        setFormLoading(true);
        try {
            await axiosPrivate.post("/banners", {
                ...data,
                startFrom: Number(data.startFrom),
            });
            toast.success("Publicidad creada correctamente");
            formAdd.reset();
            setIsAddModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.log("No se pudo crear la publicidad", error);
            toast.error("No se pudo crear la publicidad");
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateBanner = async (data: FormData) => {
        if (!selectedBanner) return;

        setFormLoading(true);
        try {
            await axiosPrivate.put(`/banners/${selectedBanner._id}`, {
                ...data,
                startFrom: Number(data.startFrom),
            });
            toast.success("Publicidad actualizada correctamente");
            setIsEditModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.log("No se pudo actualizar la publicidad", error);
            toast.error("No se pudo actualizar la publicidad");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteBanner = async () => {
        if (!selectedBanner) return;

        try {
            await axiosPrivate.delete(`/banners/${selectedBanner._id}`);
            toast.success("Publicidad eliminada correctamente");
            setIsDeleteModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.log("No se pudo eliminar la publicidad", error);
            toast.error("No se pudo eliminar la publicidad");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Publicidades</h1>
                        <p className="mt-1 text-muted-foreground">Gestiona los banners y anuncios de tu tienda.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                            />
                            Actualizar
                        </Button>
                        {isAdmin && (
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Agregar publicidad
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando publicidades...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-gray-100">
                                <TableRow>
                                    <TableHead className="w-[100px] font-semibold text-gray-700 pl-6">Imagen</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Título</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Fecha de inicio</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                                    {isAdmin && (
                                        <TableHead className="text-right font-semibold text-gray-700 pr-6">Acciones</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {banners.length > 0 ? (
                                    banners.map((banner) => (
                                        <TableRow key={banner._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="h-12 w-20 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                                    {banner.image ? (
                                                        <img
                                                            src={getImageUrl(banner.image)}
                                                            alt={banner.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-300" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {banner?.name?.length > 30 ? `${banner.name.substring(0, 30)}...` : banner.name}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {banner?.title?.length > 30 ? `${banner.title.substring(0, 30)}...` : banner.title}
                                            </TableCell>
                                            <TableCell className="text-gray-600">{banner.startFrom}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {banner.bannerType}
                                                </span>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(banner)}
                                                            className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(banner)}
                                                            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 6 : 5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <LayoutTemplate className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">No se encontraron publicidades</p>
                                                <p className="text-sm">Comienza agregando un nuevo banner.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}

                {/* Add Banner Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Agregar publicidad</DialogTitle>
                            <DialogDescription className="text-gray-500">Crear una nueva publicidad para mostrar en la tienda.</DialogDescription>
                        </DialogHeader>
                        <div className="p-6">
                            <Form {...formAdd}>
                                <form
                                    onSubmit={formAdd.handleSubmit(handleAddBanner)}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={formAdd.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Nombre</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formAdd.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Título</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={formAdd.control}
                                            name="startFrom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Fecha de inicio (Timestamp)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            min="0"
                                                            disabled={formLoading}
                                                            onChange={(e) =>
                                                                field.onChange(parseInt(e.target.value))
                                                            }
                                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formAdd.control}
                                            name="bannerType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Tipo</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={formLoading} placeholder="Ej. principal, secundario" className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={formAdd.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Imagen del Banner</FormLabel>
                                                <FormControl>
                                                    <div className="mt-2">
                                                        <ImageUpload
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            disabled={formLoading}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddModalOpen(false)}
                                            disabled={formLoading}
                                            className="h-11 border-gray-200 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={formLoading} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                                            {formLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creando...
                                                </>
                                            ) : (
                                                "Crear publicidad"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Banner Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Editar publicidad</DialogTitle>
                            <DialogDescription className="text-gray-500">Actualizar información de la publicidad existente.</DialogDescription>
                        </DialogHeader>
                        <div className="p-6">
                            <Form {...formEdit}>
                                <form
                                    onSubmit={formEdit.handleSubmit(handleUpdateBanner)}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={formEdit.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Nombre</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formEdit.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Título</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={formEdit.control}
                                            name="startFrom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Fecha de inicio (Timestamp)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            min="0"
                                                            disabled={formLoading}
                                                            onChange={(e) =>
                                                                field.onChange(parseInt(e.target.value))
                                                            }
                                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formEdit.control}
                                            name="bannerType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Tipo</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={formEdit.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Imagen del Banner</FormLabel>
                                                <FormControl>
                                                    <div className="mt-2">
                                                        <ImageUpload
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            disabled={formLoading}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditModalOpen(false)}
                                            disabled={formLoading}
                                            className="h-11 border-gray-200 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={formLoading} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                                            {formLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Actualizando...
                                                </>
                                            ) : (
                                                "Actualizar publicidad"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Banner Confirmation */}
                <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <AlertDialogContent className="bg-white rounded-xl p-0 gap-0 overflow-hidden sm:max-w-[450px]">
                        <AlertDialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">¿Estás seguro?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="p-6">
                            <AlertDialogDescription className="text-gray-600 text-base">
                                Esta acción no puede ser deshecha. Esta acción eliminará permanentemente la
                                publicidad{" "}
                                <span className="font-semibold text-gray-900">{selectedBanner?.name}</span>.
                            </AlertDialogDescription>
                        </div>
                        <AlertDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                            <AlertDialogCancel className="h-11 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 mt-0">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteBanner}
                                className="h-11 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
