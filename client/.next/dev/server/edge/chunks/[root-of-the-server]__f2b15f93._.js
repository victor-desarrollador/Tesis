(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth_token")?.value;
    // Registrar presencia del token para depuración
    console.log("Middleware: Token encontrado:", !!token, {
        pathname
    });
    // Verificar token usando /api/auth/profile
    const verifyToken = async (token)=>{
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), 5000); // 5 segundos de espera
            const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:8000/api")}/auth/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            console.log("Middleware: Estado de respuesta del perfil:", response.status);
            return response.ok;
        } catch (error) {
            console.error("Middleware: Falló la verificación del token:", error);
            // Si es un error de red o tiempo de espera, asumir que el token es válido para evitar redirecciones innecesarias
            if (error instanceof Error && (error.name === "AbortError" || error.message.includes("fetch"))) {
                console.log("Middleware: Error de red, permitiendo acceso con token existente");
                return true; // Permitir acceso si hay un problema de red
            }
            return false;
        }
    };
    // Para la página de éxito, permitir acceso si el token existe (omitir verificación para evitar problemas de redirección de pasarelas de pago)
    if (pathname === "/success") {
        if (!token) {
            const signInUrl = new URL("/auth/signin", request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(signInUrl);
        }
        // Siempre permitir acceso a la página de éxito si el token existe
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const isAuthenticated = token ? await verifyToken(token) : false;
    console.log("Middleware: Autenticado:", isAuthenticated);
    // Proteger rutas /user
    if (pathname.startsWith("/user")) {
        if (!isAuthenticated) {
            console.log("Middleware: Redirigiendo usuario no autenticado a /auth/signin");
            const signInUrl = new URL("/auth/signin", request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(signInUrl);
        }
    }
    // Restringir rutas /auth para usuarios autenticados
    if (pathname.startsWith("/auth")) {
        if (isAuthenticated) {
            console.log("Middleware: Redirigiendo usuario autenticado a /user");
            const userUrl = new URL("/user/profile", request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(userUrl);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/user/:path*",
        "/auth/:path*",
        "/success"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map