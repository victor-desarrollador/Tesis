
import { useEffect, useState, useRef } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Printer, FileText, Receipt } from "lucide-react";
import type { Order } from "@/lib/type";
import { motion } from "framer-motion";

const Invoices = () => {
    const [invoices, setInvoices] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const printRef = useRef<HTMLDivElement>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // Fetch only paid or completed orders to serve as invoices
                const response = await axiosPrivate.get("/orders/admin", {
                    params: {
                        paymentStatus: "paid",
                        perPage: 100, // Fetch a good amount
                        sortOrder: "desc",
                    },
                });
                setInvoices(response.data.orders);
            } catch (error) {
                console.error("Error fetching invoices:", error);
                toast.error("No se pudieron cargar las facturas");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [axiosPrivate]);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const printContents = printContent.innerHTML;

            // Create a temporary iframe for printing to avoid messing with the current page
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0px";
            iframe.style.height = "0px";
            iframe.style.border = "none";
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
                    <html>
                    <head>
                        <title>Factura ${selectedInvoice?.orderId}</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                        <style>
                            @media print {
                                body { -webkit-print-color-adjust: exact; }
                                @page { margin: 0; }
                            }
                            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
                        </style>
                    </head>
                    <body>
                        ${printContents}
                    </body>
                    </html>
                `);
                doc.close();
                iframe.contentWindow?.focus();
                // Wait for styles/images to load slightly
                setTimeout(() => {
                    iframe.contentWindow?.print();
                    // Cleanup
                    document.body.removeChild(iframe);
                }, 500);
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-AR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Facturas</h1>
                        <p className="mt-1 text-muted-foreground">
                            Comprobantes de pedidos pagados y completados.
                        </p>
                    </div>
                    {/* Placeholder for potential export button or filters */}
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando facturas...</p>
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
                                    <TableHead className="font-semibold text-gray-700 w-[140px] pl-6">N° Factura</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Monto</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700 pr-6">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Receipt className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-gray-900">
                                                    No hay facturas disponibles
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Solo aparecerán pedidos que hayan sido pagados.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((invoice) => (
                                        <TableRow key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-mono font-medium text-indigo-600 pl-6">
                                                #{invoice.orderId}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{invoice.user.name}</span>
                                                    <span className="text-xs text-gray-500">{invoice.user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600 font-medium text-sm">
                                                {formatDate(invoice.createdAt)}
                                            </TableCell>
                                            <TableCell className="font-bold text-gray-900">
                                                {formatCurrency(invoice.totalAmount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium px-2.5 py-0.5 rounded-full shadow-none">
                                                    PAGADO
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedInvoice(invoice)}
                                                            className="h-8 border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                                                        >
                                                            <FileText className="h-3.5 w-3.5 mr-2" />
                                                            Ver Factura
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-xl p-0 gap-0">
                                                        {selectedInvoice && (
                                                            <div className="flex flex-col h-full">
                                                                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                                                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                                        <Receipt className="h-5 w-5 text-gray-500" />
                                                                        Vista Previa de Factura
                                                                    </div>
                                                                    <div className="flex gap-2 print:hidden">
                                                                        <Button onClick={handlePrint} variant="outline" className="bg-white hover:bg-gray-50">
                                                                            <Printer className="h-4 w-4 mr-2" />
                                                                            Imprimir
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                {/* Printable Area */}
                                                                <div className="p-8 bg-gray-100/50 flex justify-center">
                                                                    <div ref={printRef} className="bg-white p-12 shadow-lg max-w-[210mm] min-h-[297mm] mx-auto text-sm leading-relaxed text-gray-600 relative overflow-hidden print:shadow-none print:m-0 print:w-full print:h-full print:p-8">

                                                                        {/* Decorative bar */}
                                                                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 print:hidden"></div>

                                                                        {/* Header */}
                                                                        <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                                                                            <div>
                                                                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">FACTURA</h1>
                                                                                <p className="text-indigo-600 font-mono mt-1 font-medium">#{selectedInvoice.orderId}</p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <h2 className="text-xl font-bold text-gray-800">Tienda L&V</h2>
                                                                                <div className="text-gray-500 mt-2 space-y-0.5 text-xs">
                                                                                    <p>Calle Falsa 123</p>
                                                                                    <p>Buenos Aires, Argentina</p>
                                                                                    <p>contacto@tiendalv.com</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Info Grid */}
                                                                        <div className="grid grid-cols-2 gap-12 mb-12">
                                                                            <div>
                                                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Facturado a</h3>
                                                                                <div className="space-y-1">
                                                                                    <p className="font-bold text-gray-900 text-base">{selectedInvoice.user.name}</p>
                                                                                    <p className="text-gray-600">{selectedInvoice.user.email}</p>
                                                                                    <p className="text-gray-600 mt-2 block">
                                                                                        {selectedInvoice.shippingAddress.street}, {selectedInvoice.shippingAddress.city}
                                                                                    </p>
                                                                                    <p className="text-gray-600">
                                                                                        {selectedInvoice.shippingAddress.state}, {selectedInvoice.shippingAddress.country}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <div className="space-y-4">
                                                                                    <div>
                                                                                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fecha de Emisión</span>
                                                                                        <span className="font-mono text-gray-900 font-medium">{formatDate(selectedInvoice.createdAt)}</span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estado</span>
                                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                            PAGADO
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Items Table */}
                                                                        <div className="mb-12">
                                                                            <table className="w-full">
                                                                                <thead>
                                                                                    <tr className="border-b-2 border-gray-100">
                                                                                        <th className="text-left py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Descripción</th>
                                                                                        <th className="text-center py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Cant.</th>
                                                                                        <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Precio Unit.</th>
                                                                                        <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-gray-50">
                                                                                    {selectedInvoice.items.map((item, idx) => (
                                                                                        <tr key={idx}>
                                                                                            <td className="py-4 text-sm text-gray-800 font-medium">{item.product.name}</td>
                                                                                            <td className="py-4 text-center text-sm text-gray-600">{item.quantity}</td>
                                                                                            <td className="py-4 text-right text-sm text-gray-600">{formatCurrency(item.price)}</td>
                                                                                            <td className="py-4 text-right text-sm font-bold text-gray-900">
                                                                                                {formatCurrency(item.price * item.quantity)}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

                                                                        {/* Totals */}
                                                                        <div className="flex justify-end pt-6 border-t border-gray-100">
                                                                            <div className="w-72">
                                                                                <div className="flex justify-between py-2 items-center">
                                                                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                                                                    <span className="font-medium text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</span>
                                                                                </div>
                                                                                <div className="flex justify-between py-4 border-t-2 border-gray-100 mt-2 items-center">
                                                                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                                                                    <span className="text-xl font-bold text-indigo-600">{formatCurrency(selectedInvoice.totalAmount)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="mt-20 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
                                                                            <p className="mb-2 font-medium text-gray-500">¡Gracias por su compra en Tienda L&V!</p>
                                                                            <p>Si tiene alguna pregunta sobre esta factura, por favor contáctenos.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Invoices;