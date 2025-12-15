"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Building2, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    totalAmount: number;
}

const TransferModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    totalAmount
}: TransferModalProps) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const bankInfo = {
        bank: "Banco Nación",
        holder: "Tienda L&V Belleza y Accesorio",
        alias: "TIENDA.LV.OFICIAL",
        cbu: "0110432940000000345678",
        cuit: "30-12345678-9"
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`${field} copiado al portapapeles`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-tiendaLVSoft flex items-center justify-center mb-4">
                        <Building2 className="h-6 w-6 text-tiendaLVSecondary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Datos de Transferencia</DialogTitle>
                    <DialogDescription className="text-center">
                        Realiza la transferencia al siguiente CBU para completar tu compra.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-tiendaLVSoft/50 p-4 rounded-lg border border-tiendaLVSecondary/20 text-center">
                        <span className="text-sm text-gray-500 uppercase tracking-wider font-medium">Total a Pagar</span>
                        <p className="text-2xl font-bold text-tiendaLVAccent mt-1">
                            ${totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            <span>10% OFF APLICADO</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500 font-normal uppercase">Banco</Label>
                            <div className="font-medium text-gray-900 border-b border-gray-100 pb-1">{bankInfo.bank}</div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500 font-normal uppercase">Titular</Label>
                            <div className="font-medium text-gray-900 border-b border-gray-100 pb-1">{bankInfo.holder}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 font-normal uppercase">CBU</Label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-gray-50 px-2 py-1.5 rounded text-sm font-mono text-gray-700 border border-gray-200">
                                        {bankInfo.cbu}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-gray-100"
                                        onClick={() => copyToClipboard(bankInfo.cbu, "CBU")}
                                    >
                                        {copiedField === "CBU" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 font-normal uppercase">Alias</Label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-gray-50 px-2 py-1.5 rounded text-sm font-mono text-gray-700 border border-gray-200">
                                        {bankInfo.alias}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-gray-100"
                                        onClick={() => copyToClipboard(bankInfo.alias, "Alias")}
                                    >
                                        {copiedField === "Alias" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-800 flex gap-2">
                        <div className="mt-0.5 font-bold">⚠️</div>
                        <p>
                            Por favor envíanos el comprobante por WhatsApp (381-4224495) para agilizar el envío de tu pedido.
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:justify-between gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading} className="w-full sm:w-auto bg-tiendaLVSecondary hover:bg-tiendaLVSecondary/90 text-white">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                Confirmar Pago <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransferModal;
