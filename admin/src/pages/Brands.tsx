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
import ImageUpload from "@/components/ui/image.upload";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { Brand } from "@/lib/type";
import { brandSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus, RefreshCw, Trash, Tag, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type z from "zod";

type FormData = z.infer<typeof brandSchema>;

const Brands = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const { checkIsAdmin } = useAuthStore();
    const isAdmin = checkIsAdmin();

    const formAdd = useForm<FormData>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            image: "",
        },
    });

    const formEdit = useForm<FormData>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            image: "",
        },
    });

    const fetchBrands = async () => {
        try {
            const response = await axiosPrivate.get("/brands");
            setBrands(response.data);
        } catch (error) {
            console.log("Error al cargar marcas", error);
            toast.error("Error al cargar marcas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleAddBrand = async (data: FormData) => {
        setFormLoading(true);
        try {
            await axiosPrivate.post("/brands", data);
            toast.success("Marca creada exitosamente");
            formAdd.reset();
            setIsAddModalOpen(false);
            fetchBrands();
        } catch (error) {
            console.log("Error al crear marca", error);
            toast.error("Error al crear marca");
        } finally {
            setFormLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axiosPrivate.get("/brands");
            setBrands(response.data);
            toast.success("Marcas actualizadas exitosamente");
        } catch (error) {
            console.log("Error al actualizar marcas", error);
            toast.error("Error al actualizar marcas");
        } finally {
            setRefreshing(false);
        }
    };

    const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string => {
        if (!image) return "";
        if (typeof image === "string") return image;
        return image.url;
    };

    const handleEdit = (brand: Brand) => {
        setSelectedBrand(brand);
        formEdit.reset({
            name: brand.name,
            image: getImageUrl(brand.image),
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (brand: Brand) => {
        setSelectedBrand(brand);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateBrand = async (data: FormData) => {
        if (!selectedBrand) return;

        setFormLoading(true);
        try {
            await axiosPrivate.put(`/brands/${selectedBrand._id}`, data);
            toast.success("Marca actualizada exitosamente");
            setIsEditModalOpen(false);
            fetchBrands();
        } catch (error) {
            console.log("Error al actualizar marca", error);
            toast.error("Error al actualizar marca");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteBrand = async () => {
        if (!selectedBrand) return;

        try {
            await axiosPrivate.delete(`/brands/${selectedBrand._id}`);
            toast.success("Marca eliminada exitosamente");
            setIsDeleteModalOpen(false);
            fetchBrands();
        } catch (error) {
            console.log("Error al eliminar marca", error);
            toast.error("Error al eliminar marca");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Marcas</h1>
                        <p className="mt-1 text-muted-foreground">Gestiona y administra las marcas de tus productos.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                            Actualizar
                        </Button>
                        {isAdmin && (
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Agregar Marca
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando marcas...</p>
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
                                    <TableHead className="font-semibold text-gray-700">Fecha de creación</TableHead>
                                    {isAdmin && (
                                        <TableHead className="text-right font-semibold text-gray-700 pr-6">Acciones</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <TableRow key={brand._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                                    {brand.image ? (
                                                        <img
                                                            src={getImageUrl(brand.image)}
                                                            alt={brand.name}
                                                            className="h-full w-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-300" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">{brand.name}</TableCell>
                                            <TableCell className="text-gray-500">
                                                {new Date(brand.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(brand)}
                                                            className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(brand)}
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
                                        <TableCell colSpan={isAdmin ? 4 : 3} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Tag className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">No se encontraron marcas</p>
                                                <p className="text-sm">Comienza agregando una nueva marca.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}

                {/* Add Brand Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Agregar Marca</DialogTitle>
                            <DialogDescription className="text-gray-500">Crear una nueva marca de producto para tu catálogo.</DialogDescription>
                        </DialogHeader>
                        <div className="p-6">
                            <Form {...formAdd}>
                                <form onSubmit={formAdd.handleSubmit(handleAddBrand)} className="space-y-6">
                                    <FormField
                                        control={formAdd.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Nombre</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={formLoading} className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors" placeholder="Ej. Nike, Adidas" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formAdd.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Logo de la Marca (Opcional)</FormLabel>
                                                <FormControl>
                                                    <div className="mt-2">
                                                        <ImageUpload
                                                            value={field.value ?? ""}
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
                                                "Crear Marca"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Brand Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Editar Marca</DialogTitle>
                            <DialogDescription className="text-gray-500">Actualizar información de la marca existente.</DialogDescription>
                        </DialogHeader>
                        <div className="p-6">
                            <Form {...formEdit}>
                                <form onSubmit={formEdit.handleSubmit(handleUpdateBrand)} className="space-y-6">
                                    <FormField
                                        control={formEdit.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Nombre</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={formLoading} className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formEdit.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Logo de la Marca (Opcional)</FormLabel>
                                                <FormControl>
                                                    <div className="mt-2">
                                                        <ImageUpload
                                                            value={field.value ?? ""}
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
                                                "Guardar Cambios"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Brand Confirmation */}
                <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <AlertDialogContent className="bg-white rounded-xl p-0 gap-0 overflow-hidden sm:max-w-[450px]">
                        <AlertDialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">¿Estás seguro?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="p-6">
                            <AlertDialogDescription className="text-gray-600 text-base">
                                Esta acción no puede ser deshecha. Esto eliminará permanentemente la
                                marca <span className="font-semibold text-gray-900">{selectedBrand?.name}</span> y la removerá de todos los productos asociados.
                            </AlertDialogDescription>
                        </div>
                        <AlertDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                            <AlertDialogCancel className="h-11 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 mt-0">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteBrand}
                                className="h-11 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar Marca
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default Brands;
