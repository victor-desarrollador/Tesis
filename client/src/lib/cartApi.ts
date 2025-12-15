import authApi from "./authApi";

export interface CartItem {
  productId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: Array<{
      url: string;
      publicId: string;
    }>;
    category: string;
    brand: string;
    stock: number;
    rating: number;
    reviews: number;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  cart: CartItem[];
  message: string;
}

export const getUserCart = async (): Promise<CartResponse> => {
  try {
    const response = await authApi.get("/cart");
    if (response.success && response.data) {
      return {
        success: true,
        cart: response.data.cart || [],
        message: response.data.message || "Carrito recuperado exitosamente",
      };
    } else {
      return {
        success: false,
        cart: [],
        message: response.error?.message || "Error al obtener el carrito",
      };
    }
  } catch (error) {
    console.error("Get cart error:", error);
    return {
      success: false,
      cart: [],
      message: "Error al obtener el carrito",
    };
  }
};

export const addToCart = async (
  token: string,
  productId: string,
  quantity: number = 1
): Promise<CartResponse> => {
  try {
    const response = await authApi.post("/cart", { productId, quantity });
    if (response.success && response.data) {
      return {
        success: true,
        cart: response.data.cart || [],
        message: response.data.message || "Producto agregado al carrito",
      };
    } else {
      return {
        success: false,
        cart: [],
        message: response.error?.message || "Error al agregar al carrito",
      };
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      cart: [],
      message: "Error al agregar al carrito",
    };
  }
};

export const updateCartItem = async (
  token: string,
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  try {
    const response = await authApi.put("/cart/update", { productId, quantity });
    if (response.success && response.data) {
      return {
        success: true,
        cart: response.data.cart || [],
        message: response.data.message || "Carrito actualizado correctamente",
      };
    } else {
      return {
        success: false,
        cart: [],
        message: response.error?.message || "Error al actualizar el carrito",
      };
    }
  } catch (error) {
    console.error("Update cart item error:", error);
    return {
      success: false,
      cart: [],
      message: "Error al actualizar el carrito",
    };
  }
};

export const removeFromCart = async (
  token: string,
  productId: string
): Promise<CartResponse> => {
  try {
    const response = await authApi.delete(`/cart/${productId}`);
    if (response.success && response.data) {
      return {
        success: true,
        cart: response.data.cart || [],
        message: response.data.message || "Producto eliminado del carrito",
      };
    } else {
      return {
        success: false,
        cart: [],
        message: response.error?.message || "Error al eliminar del carrito",
      };
    }
  } catch (error) {
    console.error("Remove from cart error:", error);
    return {
      success: false,
      cart: [],
      message: "Error al eliminar del carrito",
    };
  }
};

export const clearCart = async (): Promise<CartResponse> => {
  try {
    const response = await authApi.delete("/cart");
    if (response.success && response.data) {
      return {
        success: true,
        cart: [],
        message: response.data.message || "Carrito vaciado exitosamente",
      };
    } else {
      return {
        success: false,
        cart: [],
        message: response.error?.message || "Error al vaciar el carrito",
      };
    }
  } catch (error) {
    console.error("Clear cart error:", error);
    return {
      success: false,
      cart: [],
      message: "Error al vaciar el carrito",
    };
  }
};
