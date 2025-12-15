import { api } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "cliente";
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  checkIsAdmin: () => boolean;
  setUser: (user: User) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (credentials) => {
        try {
          const response = await api.post("/auth/login", credentials);
          console.log("Login response:", response.data); // Debug

          // El backend devuelve los datos del usuario directamente en el root
          // { _id, name, email, avatar, role, addresses, token }
          if (response.data.token) {
            const { token, ...userData } = response.data;
            if (userData.role !== "admin") {
              throw new Error("Acceso denegado: Solo administradores pueden ingresar.");
            }
            set({
              user: userData,
              token: token,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error("Error de inicio de sesión:", error);
          throw error;
        }
      },
      register: async (userData) => {
        try {
          await api.post("/auth/register", userData);
        } catch (error) {
          console.error("Error de registro:", error);
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      setUser: (user) => {
        set({ user });
      },
      checkIsAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;