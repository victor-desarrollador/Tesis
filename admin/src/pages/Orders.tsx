
import { useState, useEffect } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import type { Order } from "@/lib/type";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Eye,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    ShoppingBag,
    Package,
    MapPin,
    User,
    Calendar,
    CreditCard,
    DollarSign,
    CheckCircle2,
    Clock,
    XCircle,
    Truck
} from "lucide-react";

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const { checkIsAdmin } = useAuthStore();
    const isAdmin = checkIsAdmin();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get("/orders/admin", {
                params: {
                    page,
                    perPage,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    sortOrder: "desc",
                },
            });
            setOrders(response.data.orders);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("No se pudieron cargar los pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
        toast.success("Lista de pedidos actualizada");
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!selectedOrder) return;

        setUpdateStatusLoading(true);
        try {
            await axiosPrivate.put(`/orders/${selectedOrder._id}/status`, {
                status: newStatus,
            });
            toast.success(`Pedido actualizado a ${newStatus}`);
            // Update local state for immediate feedback inside modal
            setSelectedOrder({ ...selectedOrder, status: newStatus as any });
            fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("No se pudo actualizar el estado del pedido");
        } finally {
            setUpdateStatusLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!isAdmin) return;

        try {
            await axiosPrivate.delete(`/orders/${orderId}`);
            toast.success("Pedido eliminado");
            setIsDetailsOpen(false);
            fetchOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error("No se pudo eliminar el pedido");
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
            case "delivered":
                return { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Completado" };
            case "paid":
                return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CreditCard, label: "Pagado" };
            case "processing":
            case "pending": // Mapping pending to processing style visuals or yellow
                return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, label: status === "pending" ? "Pendiente" : "Procesando" };
            case "cancelled":
                return { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Cancelado" };
            default:
                return { color: "bg-gray-100 text-gray-700 border-gray-200", icon: Package, label: status };
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pedidos</h1>
                        <p className="mt-1 text-muted-foreground">
                            Gestiona y monitorea los pedidos de los clientes.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Actualizar
                    </Button>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Filtrar por Estado:</span>
                        <Select value={statusFilter} onValueChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}>
                            <SelectTrigger className="w-[200px] h-9 bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="paid">Pagado</SelectItem>
                                <SelectItem value="processing">Procesando</SelectItem>
                                <SelectItem value="completed">Completado</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando pedidos...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50 border-b border-gray-100">
                                    <TableRow>
                                        <TableHead className="font-semibold text-gray-700 pl-6">Orden ID</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Total</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Pago</TableHead>
                                        <TableHead className="font-semibold text-gray-700 text-right pr-6">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length > 0 ? (
                                        orders.map((order) => {
                                            const statusConfig = getStatusConfig(order.status);
                                            const StatusIcon = statusConfig.icon;

                                            return (
                                                <TableRow key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                    <TableCell className="font-medium font-mono text-xs pl-6 text-gray-500">
                                                        #{order.orderId}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900">{order.user.name}</span>
                                                            <span className="text-xs text-gray-500">{order.user.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-gray-900">
                                                            {formatCurrency(order.totalAmount)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`gap-1 pr-3 ${statusConfig.color} border shadow-sm`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"} className="rounded-full px-2.5 py-0.5">
                                                            {order.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(order)}
                                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Ver Detalle
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                                                    <p className="text-lg font-medium text-gray-900">No se encontraron pedidos</p>
                                                    <p className="text-sm">Intenta ajustar los filtros de búsqueda.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {total > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                                    Mostrando <span className="font-medium text-gray-900">{(page - 1) * perPage + 1}</span> a{" "}
                                    <span className="font-medium text-gray-900">{Math.min(page * perPage, total)}</span> de{" "}
                                    <span className="font-medium text-gray-900">{total}</span> pedidos
                                </div>
                                <div className="flex items-center gap-2 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Anterior</span>
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum = i + 1;
                                            if (totalPages > 5 && page > 3) {
                                                pageNum = page - 2 + i;
                                                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                            }
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={page === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setPage(pageNum)}
                                                    className={`h-8 w-8 p-0 ${page === pageNum ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Siguiente</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Order Details Modal */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-[700px] bg-white rounded-xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
                        <DialogHeader className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-indigo-600" />
                                        Pedido #{selectedOrder?.orderId}
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 flex items-center gap-2 text-sm">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
                                    </DialogDescription>
                                </div>
                                <Badge className={selectedOrder ? getStatusConfig(selectedOrder.status).color : ""}>
                                    {selectedOrder ? getStatusConfig(selectedOrder.status).label.toUpperCase() : ""}
                                </Badge>
                            </div>
                        </DialogHeader>

                        {selectedOrder && (
                            <div className="p-6 overflow-y-auto flex-grow">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
                                            <User className="h-4 w-4 text-indigo-600" />
                                            Información del Cliente
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium text-gray-900">{selectedOrder.user.name}</p>
                                            <p className="text-gray-500">{selectedOrder.user.email}</p>
                                        </div>
                                        {/* Future: Phone number if available */}
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
                                            <MapPin className="h-4 w-4 text-indigo-600" />
                                            Dirección de Envío
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.street}</p>
                                            <p className="text-gray-500">
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                                            </p>
                                            <p className="text-gray-500">{selectedOrder.shippingAddress.country}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <ShoppingBag className="h-4 w-4 text-indigo-600" />
                                        Productos ({selectedOrder.items.length})
                                    </div>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                                        {item.product.image ? (
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => e.currentTarget.src = "/placeholder-image.jpg"}
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900">{item.product.name}</p>
                                                        <p className="text-xs text-gray-500">Cantidad: {item.quantity} x {formatCurrency(item.price)}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-100 flex items-center gap-4">
                                            <span className="text-gray-600 font-medium">Total del Pedido:</span>
                                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-200">
                                        Gestión de Estado
                                    </h3>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex-1 w-full">
                                            <Select
                                                disabled={updateStatusLoading || !isAdmin}
                                                onValueChange={(val) => handleUpdateStatus(val)}
                                                value={selectedOrder.status}
                                            >
                                                <SelectTrigger className="w-full h-11 bg-white border-gray-200 shadow-sm focus:ring-indigo-500">
                                                    <SelectValue placeholder="Cambiar estado del pedido" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-amber-500" /> Pendiente
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="paid">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-blue-500" /> Pagado
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="processing">
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="h-4 w-4 text-purple-500" /> Procesando
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="completed">
                                                        <div className="flex items-center gap-2">
                                                            <Truck className="h-4 w-4 text-green-500" /> Completado
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="cancelled">
                                                        <div className="flex items-center gap-2">
                                                            <XCircle className="h-4 w-4 text-red-500" /> Cancelado
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Actualizar el estado enviará una notificación al cliente.
                                            </p>
                                        </div>

                                        {isAdmin && (
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido permanentemente? Esta acción no se puede deshacer.")) {
                                                        handleDeleteOrder(selectedOrder._id);
                                                    }
                                                }}
                                                className="w-full sm:w-auto h-11 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 shadow-sm"
                                            >
                                                Eliminar Pedido
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100 gap-2 flex-shrink-0">
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="bg-white border-gray-200">
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Orders;