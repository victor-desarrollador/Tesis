import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import MultiImageUpload from "@/components/ui/multi-image.upload";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { Brand, Category, Product } from "@/lib/type";
import { productSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Loader2,
    Package,
    Plus,
    RefreshCw,
    Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

type FormData = z.infer<typeof productSchema>;

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    // @ts-ignore
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1); // Default page = 1
    const [perPage] = useState(10); // Default perPage = 10
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default to ascending
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuthStore();

    // Forms
    const formAdd = useForm<FormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            comparePrice: 0,
            discountPercentage: 0,
            stock: 0,
            category: "",
            brand: "",
            images: [],
        },
    });

    const formEdit = useForm<FormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            comparePrice: 0,
            discountPercentage: 0,
            stock: 0,
            category: "",
            brand: "",
            images: [],
        },
    });

    // Reset page to 1 on initial load
    useEffect(() => {
        setPage(1);
    }, []);

    // Fetch products whenever page or sortOrder changes
    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user, page, sortOrder]);

    // Fetch categories and brands on mount
    useEffect(() => {
        if (user) {
            fetchCategories();
            fetchBrands();
        }
    }, [user]);

    const fetchProducts = async (resetPage = false) => {
        setLoading(true);
        try {
            const currentPage = resetPage ? 1 : page;
            const response = await axiosPrivate.get("/products", {
                params: { page: currentPage, perPage, sortOrder },
            });

            // Backend devuelve: { success, data: [...], pagination: { total, pages } }
            setProducts(response.data.data || []);
            setTotal(response.data.pagination?.total || 0);
            setTotalPages(response.data.pagination?.pages || 1);

            // If we reset the page, update the page state
            if (resetPage) {
                setPage(1);
            }
        } catch (error) {
            console.log("No se pudo cargar los productos", error);
            toast("No se pudo cargar los productos");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosPrivate.get("/categories", {
                params: { page: 1, perPage: 100, sortOrder: "asc" },
            });
            setCategories(response.data.categories || []);
        } catch (error) {
            console.log("No se pudo cargar las categorías", error);
            toast("No se pudo cargar las categorías");
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axiosPrivate.get("/brands", {
                params: { page: 1, perPage: 100, sortOrder: "asc" },
            });
            setBrands(response.data.brands || response.data || []);
        } catch (error) {
            console.log("No se pudo cargar las marcas", error);
            toast("No se pudo cargar las marcas");
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axiosPrivate.get("/products", {
                params: { page, perPage, sortOrder },
            });
            setProducts(response?.data?.data || []);
            setTotal(response?.data?.pagination?.total || 0);
            setTotalPages(response?.data?.pagination?.pages || 1);
            toast("Productos actualizados exitosamente");
        } catch (error) {
            console.log("Failed to refresh products", error);
            toast("Error al actualizar productos");
        } finally {
            setRefreshing(false);
        }
    };

    const handleSortChange = (value: "asc" | "desc") => {
        setSortOrder(value);
        setPage(1); // Reset to page 1 when sort order changes
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleAddProduct = async (data: FormData) => {
        setFormLoading(true);
        try {
            // Transform form data to match backend expectation
            const productData = {
                ...data,
                price: Number(data.price),
                comparePrice: Number(data.comparePrice || 0),
                discountPercentage: Number(data.discountPercentage || 0),
                stock: Number(data.stock),
                // Map array of strings to array of objects { url, publicId }
                images: data.images ? data.images.map(url => ({ url, publicId: "" })) : [],
            };

            await axiosPrivate.post("/products", productData);
            toast("Producto creado exitosamente");
            formAdd.reset();
            setIsAddModalOpen(false);
            fetchProducts(true); // Reset to page 1 and refetch
        } catch (error: unknown) {
            console.log("Error al crear el producto", error);
            let errorMessage = "Error al crear el producto";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            if (errorMessage.includes("Ya existe")) {
                formAdd.setError("name", { type: "manual", message: errorMessage });
            } else {
                toast(errorMessage);
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        formEdit.reset({
            name: product.name,
            description: product.description,
            price: product.price,
            comparePrice: product.comparePrice || 0,
            discountPercentage: product.discountPercentage || 0,
            stock: product.stock,
            category: product.category._id,
            brand: product.brand._id,
            // Map array of objects to array of strings
            images: product.images ? product.images.map(img => img.url) : [],
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProduct = async (data: FormData) => {
        if (!selectedProduct) return;

        setFormLoading(true);
        try {
            // Transform form data with publicId preservation logic
            const processedImages = data.images.map(imgUrl => {
                // Find if this URL already exists in the original product images
                const existingImage = selectedProduct.images.find(
                    (originalImg) => originalImg.url === imgUrl
                );

                if (existingImage) {
                    return existingImage; // Keeps { url, publicId, _id }
                } else {
                    return { url: imgUrl, publicId: "" }; // New image
                }
            });

            const productData = {
                ...data,
                price: Number(data.price),
                comparePrice: Number(data.comparePrice || 0),
                discountPercentage: Number(data.discountPercentage || 0),
                stock: Number(data.stock),
                images: processedImages,
            };

            await axiosPrivate.put(`/products/${selectedProduct._id}`, productData);
            toast("Producto actualizado exitosamente");
            setIsEditModalOpen(false);
            fetchProducts();
        } catch (error: unknown) {
            console.log("No se pudo actualizar el producto", error);
            let errorMessage = "No se pudo actualizar el producto";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            if (errorMessage.includes("Ya existe")) {
                formEdit.setError("name", { type: "manual", message: errorMessage });
            } else {
                toast(errorMessage);
            }
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            await axiosPrivate.delete(`/products/${selectedProduct._id}`);
            toast("Producto eliminado exitosamente");
            setIsDeleteModalOpen(false);
            fetchProducts(true); // Reset to page 1 and refetch
        } catch (error) {
            console.log("Failed to delete product", error);
            toast("Failed to delete product");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(amount);
    };

    // Helper to render form fields
    const renderProductForm = (form: ReturnType<typeof useForm<FormData>>, onSubmit: (data: FormData) => void, submitLabel: string) => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imágenes del Producto</FormLabel>
                            <FormControl>
                                <MultiImageUpload
                                    value={field.value || []}
                                    disabled={formLoading}
                                    onChange={(urls) => field.onChange(urls)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input disabled={formLoading} placeholder="Nombre del producto" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <Select
                                    disabled={formLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca</FormLabel>
                                <Select
                                    disabled={formLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar marca" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand._id} value={brand._id}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={formLoading}
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? 0 : Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={formLoading}
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? 0 : Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="comparePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio Comparación</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={formLoading}
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? 0 : Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descuento (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        disabled={formLoading}
                                        placeholder="0"
                                        max={100}
                                        min={0}
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? 0 : Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    disabled={formLoading}
                                    placeholder="Descripción del producto"
                                    className="resize-none h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={formLoading}>
                    {formLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </form>
        </Form>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h1>
                        <p className="mt-1 text-muted-foreground">
                            Gestiona tu catálogo de productos.
                        </p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                    </Button>
                </div>

                {/* Table Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Ordenar por precio:</span>
                            <Select value={sortOrder} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[180px] bg-white border-gray-200">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Menor a Mayor</SelectItem>
                                    <SelectItem value="desc">Mayor a Menor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="bg-white hover:bg-gray-50">
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                            Actualizar
                        </Button>
                    </div>

                    <div className="relative overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-gray-100">
                                <TableRow>
                                    <TableHead className="w-[100px] text-gray-700 font-semibold pl-6">Imagen</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Nombre</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Categoría</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Marca</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Precio</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Stock</TableHead>
                                    <TableHead className="text-right text-gray-700 font-semibold pr-6">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
                                                <span className="text-gray-500 font-medium">Cargando productos...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Package className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">No hay productos</p>
                                                <p className="text-sm text-gray-500">Comienza agregando un nuevo producto.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                                            <TableCell className="text-gray-600">{product.category?.name || "Sin categoría"}</TableCell>
                                            <TableCell className="text-gray-600"> {product.brand?.name || "Sin marca"}</TableCell>
                                            <TableCell className="font-medium text-gray-900">{formatCurrency(product.price)}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.stock}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)} className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 border-gray-200">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleDelete(product)} className="h-8 w-8 hover:bg-red-50 hover:text-red-600 border-gray-200">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="text-sm text-gray-500">
                            Página {page} de {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className="bg-white hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={page >= totalPages}
                                className="bg-white hover:bg-gray-50"
                            >
                                Siguiente
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Add Product Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-2xl rounded-xl p-0 gap-0 overflow-hidden bg-white">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <DialogTitle className="text-xl font-bold text-gray-900">Agregar Producto</DialogTitle>
                        <DialogDescription className="text-gray-500 mt-1">
                            Complete los detalles para agregar un nuevo producto al catálogo.
                        </DialogDescription>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        {renderProductForm(formAdd, handleAddProduct, "Crear Producto")}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl rounded-xl p-0 gap-0 overflow-hidden bg-white">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <DialogTitle className="text-xl font-bold text-gray-900">Editar Producto</DialogTitle>
                        <DialogDescription className="text-gray-500 mt-1">
                            Modifique los detalles del producto existente.
                        </DialogDescription>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        {renderProductForm(formEdit, handleUpdateProduct, "Actualizar Producto")}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogContent className="rounded-xl p-0 gap-0 overflow-hidden bg-white">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <AlertDialogTitle className="text-xl font-bold text-gray-900">¿Estás seguro?</AlertDialogTitle>
                    </div>
                    <div className="p-6">
                        <AlertDialogDescription className="text-gray-600 text-base">
                            Esta acción eliminará permanentemente el producto <strong>{selectedProduct?.name}</strong>.
                            No se puede deshacer.
                        </AlertDialogDescription>
                    </div>
                    <AlertDialogFooter className="p-6 bg-gray-50 gap-3 border-t border-gray-100">
                        <AlertDialogCancel className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100 mt-0">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700 text-white shadow-sm border-0">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Products;
