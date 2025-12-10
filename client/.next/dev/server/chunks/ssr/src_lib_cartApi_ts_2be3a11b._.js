module.exports = [
"[project]/src/lib/cartApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToCart",
    ()=>addToCart,
    "clearCart",
    ()=>clearCart,
    "getUserCart",
    ()=>getUserCart,
    "removeFromCart",
    ()=>removeFromCart,
    "updateCartItem",
    ()=>updateCartItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/authApi.ts [app-ssr] (ecmascript)");
;
const getUserCart = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/cart");
        if (response.success && response.data) {
            return {
                success: true,
                cart: response.data.cart || [],
                message: response.data.message || "Cart retrieved successfully"
            };
        } else {
            return {
                success: false,
                cart: [],
                message: response.error?.message || "Failed to get cart"
            };
        }
    } catch (error) {
        console.error("Get cart error:", error);
        return {
            success: false,
            cart: [],
            message: "Failed to get cart"
        };
    }
};
const addToCart = async (token, productId, quantity = 1)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/cart", {
            productId,
            quantity
        });
        if (response.success && response.data) {
            return {
                success: true,
                cart: response.data.cart || [],
                message: response.data.message || "Item added to cart successfully"
            };
        } else {
            return {
                success: false,
                cart: [],
                message: response.error?.message || "Failed to add to cart"
            };
        }
    } catch (error) {
        console.error("Add to cart error:", error);
        return {
            success: false,
            cart: [],
            message: "Failed to add to cart"
        };
    }
};
const updateCartItem = async (token, productId, quantity)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put("/cart/update", {
            productId,
            quantity
        });
        if (response.success && response.data) {
            return {
                success: true,
                cart: response.data.cart || [],
                message: response.data.message || "Cart item updated successfully"
            };
        } else {
            return {
                success: false,
                cart: [],
                message: response.error?.message || "Failed to update cart item"
            };
        }
    } catch (error) {
        console.error("Update cart item error:", error);
        return {
            success: false,
            cart: [],
            message: "Failed to update cart item"
        };
    }
};
const removeFromCart = async (token, productId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/cart/${productId}`);
        if (response.success && response.data) {
            return {
                success: true,
                cart: response.data.cart || [],
                message: response.data.message || "Item removed from cart successfully"
            };
        } else {
            return {
                success: false,
                cart: [],
                message: response.error?.message || "Failed to remove from cart"
            };
        }
    } catch (error) {
        console.error("Remove from cart error:", error);
        return {
            success: false,
            cart: [],
            message: "Failed to remove from cart"
        };
    }
};
const clearCart = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete("/cart");
        if (response.success && response.data) {
            return {
                success: true,
                cart: [],
                message: response.data.message || "Cart cleared successfully"
            };
        } else {
            return {
                success: false,
                cart: [],
                message: response.error?.message || "Failed to clear cart"
            };
        }
    } catch (error) {
        console.error("Clear cart error:", error);
        return {
            success: false,
            cart: [],
            message: "Failed to clear cart"
        };
    }
};
}),
];

//# sourceMappingURL=src_lib_cartApi_ts_2be3a11b._.js.map