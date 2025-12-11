import authApi from "./authApi";

export interface PaymentPreference {
    success: boolean;
    preferenceId: string;
    initPoint: string;
    sandboxInitPoint: string;
    message: string;
}

export interface PaymentInfo {
    success: boolean;
    payment: any; // Mercado Pago payment object
}

export const createPaymentPreference = async (
    orderId: string
): Promise<PaymentPreference> => {
    try {
        const response = await authApi.post("/payments/create-preference", {
            orderId,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Error al crear preferencia de pago"
        );
    }
};

export const getPaymentInfo = async (
    paymentId: string
): Promise<PaymentInfo> => {
    try {
        const response = await authApi.get(`/payments/${paymentId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Error al obtener información del pago"
        );
    }
};

export const verifyPaymentStatus = async (orderId: string): Promise<any> => {
    try {
        const response = await authApi.post("/payments/verify", { orderId });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Error al verificar estado del pago"
        );
    }
};
