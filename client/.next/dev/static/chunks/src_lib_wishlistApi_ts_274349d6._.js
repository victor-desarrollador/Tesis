(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/wishlistApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToWishlist",
    ()=>addToWishlist,
    "clearWishlist",
    ()=>clearWishlist,
    "getUserWishlist",
    ()=>getUserWishlist,
    "getWishlistProducts",
    ()=>getWishlistProducts,
    "removeFromWishlist",
    ()=>removeFromWishlist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || "http://localhost:8000/api";
const addToWishlist = async (productId, token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al agregar a favoritos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
};
const removeFromWishlist = async (productId, token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar de favoritos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
    }
};
const getUserWishlist = async (token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al obtener favoritos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting wishlist:", error);
        throw error;
    }
};
const getWishlistProducts = async (productIds, token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productIds
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al obtener productos favoritos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting wishlist products:", error);
        throw error;
    }
};
const clearWishlist = async (token)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/clear`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al vaciar favoritos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_wishlistApi_ts_274349d6._.js.map