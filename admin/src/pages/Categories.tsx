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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { Category } from "@/lib/type";
import { categorySchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Loader2,
    Plus,
    RefreshCw,
    Trash,
    FolderTree,
    ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type z from "zod";
import ImageUpload from "@/components/ui/image.upload";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

type FormData = z.infer<typeof categorySchema>;

const VALID_CATEGORIES = [
    "Perfumería",
    "Maquillaje",
    "Cuidado para el Hombre",
    "Cuidado Diario",
    "Cabello",
    "Accesorios de Damas",
    "Otros"
];

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const { checkIsAdmin } = useAuthStore();
    const isAdmin = checkIsAdmin();

    const formAdd = useForm<FormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
            categoryType: "" as any,
        },
    });

    const formEdit = useForm<FormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
            categoryType: "" as any,
        },
    });

    useEffect(() => {
        fetchCategories();
    }, [page, sortOrder]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get("/categories", {
                params: { page, perPage: 100, sortOrder },
            });
            setCategories(response?.data?.categories || []);
            setTotal(response?.data?.total || 0);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
        } catch (error) {
            console.log("Error al cargar categorías", error);
            toast.error("Error al cargar categorías");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string => {
        if (!image) return "";
        if (typeof image === "string") return image;
        return image.url;
    };

    const handleAddCategory = async (data: FormData) => {
        setFormLoading(true);
        try {
            await axiosPrivate.post("/categories", data);
            toast.success("Categoría creada exitosamente");
            formAdd.reset();
            setIsAddModalOpen(false);
            setPage(1);
            fetchCategories();
        } catch (error: unknown) {
            console.log("Error al crear categoría", error);
            let errorMessage = "Error al crear categoría";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            if (errorMessage.includes("Ya existe")) {
                formAdd.setError("name", { type: "manual", message: errorMessage });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        formEdit.reset({
            name: category.name,
            description: category.description || "",
            image: getImageUrl(category.image),
            categoryType: (category.categoryType as any) || "",
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = async (data: FormData) => {
        if (!selectedCategory) return;

        setFormLoading(true);
        try {
            await axiosPrivate.put(`/categories/${selectedCategory._id}`, data);
            toast.success("Categoría actualizada exitosamente");
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error: unknown) {
            console.log("Error al actualizar categoría", error);
            let errorMessage = "Error al actualizar categoría";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            if (errorMessage.includes("Ya existe")) {
                formEdit.setError("name", { type: "manual", message: errorMessage });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            await axiosPrivate.delete(`/categories/${selectedCategory._id}`);
            toast.success("Categoría eliminada exitosamente");
            setIsDeleteModalOpen(false);
            setPage(1);
            fetchCategories();
        } catch (error) {
            console.log("Error al eliminar categoría", error);
            toast.error("Error al eliminar categoría");
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axiosPrivate.get("/categories", {
                params: { page, perPage: 100, sortOrder },
            });
            setCategories(response?.data?.categories || []);
            setTotal(response?.data?.total || 0);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            toast.success("Categorías actualizadas exitosamente");
        } catch (error) {
            console.log("Error al actualizar categorías", error);
            toast.error("Error al actualizar categorías");
        } finally {
            setRefreshing(false);
        }
    };

    const handleSortChange = (newSortOrder: "asc" | "desc") => {
        setSortOrder(newSortOrder);
        setPage(1);
    };

    const getCategoryColor = (type: string) => {
        switch (type) {
            case "Perfumería": return "bg-purple-100 text-purple-800 border-purple-200";
            case "Maquillaje": return "bg-pink-100 text-pink-800 border-pink-200";
            case "Cuidado para el Hombre": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Cuidado Diario": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "Cabello": return "bg-amber-100 text-amber-800 border-amber-200";
            case "Accesorios de Damas": return "bg-rose-100 text-rose-800 border-rose-200";
            case "Otros": return "bg-slate-100 text-slate-800 border-slate-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorías</h1>
                        <p className="mt-1 text-muted-foreground">Gestiona y organiza el catálogo de categorías.</p>
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
                                <Plus className="mr-2 h-4 w-4" /> Agregar Categoría
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando categorías...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Ordenar:</span>
                                <Select value={sortOrder} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-[180px] bg-white border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">A - Z</SelectItem>
                                        <SelectItem value="desc">Z - A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-gray-100">
                                <TableRow>
                                    <TableHead className="w-[100px] font-semibold text-gray-700 pl-6">Imagen</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Descripción</TableHead>
                                    {isAdmin && (
                                        <TableHead className="text-right font-semibold text-gray-700 pr-6">Acciones</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <TableRow key={category._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                                    {category.image ? (
                                                        <img
                                                            src={getImageUrl(category.image)}
                                                            alt={category.name}
                                                            className="h-full w-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-300" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">{category.name}</TableCell>
                                            <TableCell className="text-gray-600">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(category.categoryType)}`}>
                                                    {category.categoryType}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-500 max-w-xs truncate">
                                                {category.description || "—"}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(category)}
                                                            className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(category)}
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
                                        <TableCell colSpan={isAdmin ? 5 : 4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <FolderTree className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">No se encontraron categorías</p>
                                                <p className="text-sm">Comienza agregando una nueva categoría.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {total > 0 && (
                            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                                <div className="text-sm text-gray-500">
                                    Mostrando {categories.length} de {total} categorías
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="bg-white hover:bg-gray-50"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page >= totalPages}
                                        className="bg-white hover:bg-gray-50"
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Add Category Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Agregar Categoría</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Crear una nueva categoría para organizar tus productos.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <Form {...formAdd}>
                                <form onSubmit={formAdd.handleSubmit(handleAddCategory)} className="space-y-6">
                                    <FormField
                                        control={formAdd.control}
                                        name="categoryType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Tipo de Categoría</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                                            <SelectValue placeholder="Selecciona el tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {VALID_CATEGORIES.map((type) => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formAdd.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Nombre</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={formLoading} className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors" placeholder="Ej. Labiales Mate" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formAdd.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Descripción (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none h-24" placeholder="Breve descripción de la categoría" />
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
                                                <FormLabel className="text-gray-700 font-medium">Imagen (Opcional)</FormLabel>
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
                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddModalOpen(false)}
                                            disabled={formLoading}
                                            className="flex-1 h-11 border-gray-200 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={formLoading} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white">
                                            {formLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creando...
                                                </>
                                            ) : (
                                                "Crear Categoría"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Category Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Editar Categoría</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Actualizar información de la categoría existente.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <Form {...formEdit}>
                                <form onSubmit={formEdit.handleSubmit(handleUpdateCategory)} className="space-y-6">
                                    <FormField
                                        control={formEdit.control}
                                        name="categoryType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Tipo de Categoría</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                                                            <SelectValue placeholder="Selecciona el tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {VALID_CATEGORIES.map((type) => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Descripción (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none h-24" />
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
                                                <FormLabel className="text-gray-700 font-medium">Imagen (Opcional)</FormLabel>
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
                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditModalOpen(false)}
                                            disabled={formLoading}
                                            className="flex-1 h-11 border-gray-200 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={formLoading} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white">
                                            {formLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Actualizando...
                                                </>
                                            ) : (
                                                "Guardar Cambios"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <AlertDialogContent className="bg-white rounded-xl p-0 gap-0 overflow-hidden sm:max-w-[450px]">
                        <AlertDialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">¿Estás seguro?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="p-6">
                            <AlertDialogDescription className="text-gray-600 text-base">
                                Esta acción no puede ser deshecha. Esto eliminará permanentemente la
                                categoría <span className="font-semibold text-gray-900">{selectedCategory?.name}</span>.
                            </AlertDialogDescription>
                        </div>
                        <AlertDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                            <AlertDialogCancel className="h-11 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 mt-0">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteCategory}
                                className="h-11 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar Categoría
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default Categories;
