import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // Registrar presencia del token para depuración
  console.log("Middleware: Token encontrado:", !!token, { pathname });

  // Verificar token usando /api/auth/profile
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de espera

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Coincidir con la configuración de authApi
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      console.log("Middleware: Estado de respuesta del perfil:", response.status);
      return response.ok;
    } catch (error) {
      console.error("Middleware: Falló la verificación del token:", error);
      // Si es un error de red o tiempo de espera, asumir que el token es válido para evitar redirecciones innecesarias
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("fetch"))
      ) {
        console.log(
          "Middleware: Error de red, permitiendo acceso con token existente"
        );
        return true; // Permitir acceso si hay un problema de red
      }
      return false;
    }
  };

  // Para la página de éxito, permitir acceso si el token existe (omitir verificación para evitar problemas de redirección de pasarelas de pago)
  if (pathname === "/success") {
    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
    // Siempre permitir acceso a la página de éxito si el token existe
    return NextResponse.next();
  }

  const isAuthenticated = token ? await verifyToken(token) : false;
  console.log("Middleware: Autenticado:", isAuthenticated);

  // Proteger rutas /user
  if (pathname.startsWith("/user")) {
    if (!isAuthenticated) {
      console.log(
        "Middleware: Redirigiendo usuario no autenticado a /auth/signin"
      );
      const signInUrl = new URL("/auth/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Restringir rutas /auth para usuarios autenticados
  if (pathname.startsWith("/auth")) {
    if (isAuthenticated) {
      console.log("Middleware: Redirigiendo usuario autenticado a /user");
      const userUrl = new URL("/user/profile", request.url);
      return NextResponse.redirect(userUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/auth/:path*", "/success"],
};
