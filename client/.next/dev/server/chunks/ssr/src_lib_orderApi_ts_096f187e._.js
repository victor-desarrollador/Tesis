module.exports = [
"[project]/src/lib/orderApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOrderFromCart",
    ()=>createOrderFromCart,
    "deleteOrder",
    ()=>deleteOrder,
    "getOrderById",
    ()=>getOrderById,
    "getUserOrders",
    ()=>getUserOrders,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || "http://localhost:8000/api";
const createOrderFromCart = async (token, cartItems, shippingAddress)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cartItems,
                shippingAddress
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create order");
        }
        const orderData = await response.json();
        console.log("Order created successfully:", orderData);
        return {
            success: true,
            order: orderData.order || orderData
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return {
            success: false,
            order: {},
            message: error instanceof Error ? error.message : "Failed to create order"
        };
    }
};
const getUserOrders = async (token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};
const getOrderById = async (orderId, token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch order");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
};
const deleteOrder = async (orderId, token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete order");
        }
        return {
            success: true,
            message: "Order deleted successfully"
        };
    } catch (error) {
        console.error("Error deleting order:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete order"
        };
    }
};
const updateOrderStatus = async (orderId, status, token, paymentIntentId, stripeSessionId)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status,
                paymentIntentId,
                stripeSessionId
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update order status");
        }
        const data = await response.json();
        return {
            success: true,
            order: data.order,
            message: data.message
        };
    } catch (error) {
        console.error("Error updating order status:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to update order status"
        };
    }
};
}),
];

//# sourceMappingURL=src_lib_orderApi_ts_096f187e._.js.map