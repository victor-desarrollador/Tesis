const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pendiente" | "pagado" | "completado" | "cancelado";
  shippingAddress: ShippingAddress;
  paymentIntentId?: string;
  stripeSessionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Create order from cart
export const createOrderFromCart = async (
  token: string,
  cartItems: CartItem[],
  shippingAddress: ShippingAddress
): Promise<CreateOrderResponse> => {
  try {
    const payload = {
      items: cartItems,
      shippingAddress,
    };
    console.log("Creating order with payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server returned error:", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.message || "Error al crear el pedido");
    }

    const orderData = await response.json();
    console.log("Order created successfully:", orderData);

    return {
      success: true,
      order: orderData.order || orderData,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      order: {} as Order,
      message:
        error instanceof Error ? error.message : "Error al crear el pedido",
    };
  }
};

// Get user orders
export const getUserOrders = async (token: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los pedidos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (
  orderId: string,
  token: string
): Promise<Order | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

// Delete order
export const deleteOrder = async (
  orderId: string,
  token: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar el pedido");
    }

    return {
      success: true,
      message: "Pedido eliminado correctamente",
    };
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al eliminar el pedido",
    };
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: "pendiente" | "pagado" | "completado" | "cancelado",
  token: string,
  paymentIntentId?: string,
  stripeSessionId?: string
): Promise<{ success: boolean; order?: Order; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        paymentIntentId,
        stripeSessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar estado del pedido");
    }

    const data = await response.json();
    return {
      success: true,
      order: data.order,
      message: data.message,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar estado del pedido",
    };
  }
};
