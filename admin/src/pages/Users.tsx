import type { User } from "@/lib/type";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { Edit, Trash, Plus, Users, Search, Eye, RefreshCw, Mail, Calendar, User as UserIcon } from "lucide-react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/validation";
import type z from "zod";
import ImageUpload from "@/components/ui/image.upload";
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
import { motion } from "framer-motion";

type FormData = z.infer<typeof userSchema>;

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");



    const axiosPrivate = useAxiosPrivate();
    const { checkIsAdmin } = useAuthStore();
    const isAdmin = checkIsAdmin();

    const formAdd = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "cliente",
            avatar: "",
        },
    });

    const formEdit = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "cliente",
            avatar: "",
        },
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get("/users");

            if (response?.data) {
                setUsers(response?.data?.users);
            }
        } catch (error) {
            console.log("Error al cargar usuarios", error);
            toast.error("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await axiosPrivate.get("/users");

            if (response?.data) {
                setUsers(response?.data?.users);
            }
            toast.success("Usuarios actualizados");
        } catch (error) {
            toast.error("Error al cargar usuarios");
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (data: FormData) => {
        setFormLoading(true);
        try {
            await axiosPrivate.post("/users", data);
            toast.success("¡Usuario creado exitosamente!");
            formAdd.reset();
            setIsAddModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error("Error al crear usuario");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        formEdit.reset({
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        });
        setIsEditModalOpen(true);
    };
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateUser = async (data: FormData) => {
        if (!selectedUser) return;
        setFormLoading(true);
        try {
            await axiosPrivate.put(`/users/${selectedUser._id}`, data);
            toast.success("Usuario actualizado exitosamente");
            setIsEditModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.log("Error al actualizar usuario", error);
            toast.error("Error al actualizar usuario");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await axiosPrivate.delete(`/users/${selectedUser._id}`);
            toast.success("Usuario eliminado exitosamente");
            setIsDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.log("Error al eliminar usuario", error);
            toast.error("Error al eliminar usuario");
        }
    };
    const handleView = (user: User) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "deliveryman":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "cliente":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "admin":
                return "Administrador";
            case "deliveryman":
                return "Repartidor";
            case "cliente":
                return "Cliente";
            default:
                return role;
        }
    };

    // Helper para evitar cache de imágenes
    const getAvatarUrl = (url: string | undefined, updatedAt?: string) => {
        if (!url) return "";
        // No agregar timestamp a imágenes base
        if (url.startsWith("data:")) return url;
        // Usa updatedAt si está disponible, sino usa un timestamp fijo por sesión
        const timestamp = updatedAt ? new Date(updatedAt).getTime() : Date.now();
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}v=${timestamp}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Usuarios</h1>
                        <p className="mt-1 text-muted-foreground">
                            Ver y administrar todos los usuarios registrados en el sistema.
                        </p>
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
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Usuario
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
                        />
                    </div>
                    <div className="w-full sm:w-[200px]">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                                <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Roles</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="cliente">Cliente</SelectItem>
                                <SelectItem value="deliveryman">Repartidor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando usuarios...</p>
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
                                    <TableHead className="w-[80px] font-semibold text-gray-700 pl-6">Avatar</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Correo Electrónico</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Rol</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Creado el</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700 pr-6">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers?.length > 0 ? (
                                    filteredUsers?.map((user) => (
                                        <TableRow key={user?._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shadow-sm overflow-hidden ring-2 ring-white">
                                                    {user.avatar ? (
                                                        <img
                                                            src={getAvatarUrl(user.avatar, user.updatedAt)}
                                                            alt={user.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-bold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                                            <TableCell className="text-gray-600">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn("capitalize shadow-none font-medium px-2.5 py-0.5 rounded-full", getRoleColor(user.role))}
                                                    variant="outline"
                                                >
                                                    {getRoleLabel(user.role)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleView(user)}
                                                        title="Ver detalles del usuario"
                                                        className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(user)}
                                                                title="Editar usuario"
                                                                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(user)}
                                                                title="Eliminar usuario"
                                                                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Users className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">
                                                    No se encontraron usuarios
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {searchTerm || roleFilter !== "all"
                                                        ? "Intenta ajustar tu búsqueda o filtros"
                                                        : "Los usuarios aparecerán aquí cuando se registren"}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}

                {/* Add user Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                            <DialogTitle className="text-xl font-bold text-gray-900">Agregar Usuario</DialogTitle>
                            <DialogDescription className="text-gray-500">Crear una nueva cuenta de usuario en el sistema.</DialogDescription>
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto">
                            <Form {...formAdd}>
                                <form
                                    onSubmit={formAdd.handleSubmit(handleAddUser)}
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
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        disabled={formLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                                                                <SelectValue placeholder="Selecciona un rol" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="cliente">Cliente</SelectItem>
                                                            <SelectItem value="admin">Administrador</SelectItem>
                                                            <SelectItem value="deliveryman">Repartidor</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={formAdd.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formAdd.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formAdd.control}
                                        name="avatar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Avatar</FormLabel>
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
                                    <DialogFooter className="pt-4 flex-shrink-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddModalOpen(false)}
                                            disabled={formLoading}
                                            className="h-11 border-gray-200 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={formLoading} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                                            {formLoading ? (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                    Creando...
                                                </>
                                            ) : (
                                                "Crear Usuario"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit user modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                            <DialogTitle className="text-xl font-bold text-gray-900">Editar Usuario</DialogTitle>
                            <DialogDescription className="text-gray-500">Actualizar información de la cuenta.</DialogDescription>
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto">
                            <Form {...formEdit}>
                                <form
                                    onSubmit={formEdit.handleSubmit(handleUpdateUser)}
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
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        disabled={formLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                                                                <SelectValue placeholder="Selecciona un rol" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="cliente">Cliente</SelectItem>
                                                            <SelectItem value="admin">Administrador</SelectItem>
                                                            <SelectItem value="deliveryman">Repartidor</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={formEdit.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} disabled={formLoading} className="bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formEdit.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        placeholder="Dejar vacío para mantener la actual"
                                                        disabled={formLoading}
                                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formEdit.control}
                                        name="avatar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Avatar</FormLabel>
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
                                    <DialogFooter className="pt-4 flex-shrink-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditModalOpen(false)}
                                            disabled={formLoading}
                                            className="h-11 border-gray-200 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={formLoading} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]">
                                            {formLoading ? (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                    Actualizando...
                                                </>
                                            ) : (
                                                "Actualizar Usuario"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete user modal */}
                <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <AlertDialogContent className="bg-white rounded-xl p-0 gap-0 overflow-hidden sm:max-w-[450px]">
                        <AlertDialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">¿Estás seguro?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="p-6">
                            <AlertDialogDescription className="text-gray-600 text-base">
                                Esta acción no puede ser deshecha. Esta acción eliminará permanentemente la cuenta de{" "}
                                <span className="font-semibold text-gray-900">{selectedUser?.name}</span> y eliminará sus datos de nuestros servidores.
                            </AlertDialogDescription>
                        </div>
                        <AlertDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                            <AlertDialogCancel className="h-11 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 mt-0">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteUser}
                                className="h-11 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar cuenta
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* View User Dialog */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="sm:max-w-[450px] bg-white rounded-xl p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-900">Detalles del Usuario</DialogTitle>
                            <DialogDescription className="text-gray-500">Información completa de la cuenta.</DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                            <div className="p-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="h-24 w-24 rounded-full bg-indigo-50 border-4 border-white shadow-lg overflow-hidden mb-4 flex items-center justify-center">
                                        {selectedUser.avatar ? (
                                            <img
                                                src={getAvatarUrl(selectedUser.avatar, selectedUser.updatedAt)}
                                                alt={selectedUser.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-indigo-600">
                                                {selectedUser.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 text-center">{selectedUser.name}</h3>
                                    <div className="mt-1">
                                        <Badge className={cn("capitalize px-3 py-0.5", getRoleColor(selectedUser.role))} variant="outline">
                                            {getRoleLabel(selectedUser.role)}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Correo Electrónico</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">ID de Usuario</p>
                                            <p className="text-sm font-mono text-gray-600 truncate max-w-[280px]">{selectedUser._id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Fecha de Registro</p>
                                            <p className="text-sm font-medium text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full">
                                        Cerrar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default UsersPage;
