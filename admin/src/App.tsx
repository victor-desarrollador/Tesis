import { Navigate, Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Toaster } from "sonner";
import useAuthStore from "./store/useAuthStore";
import { useState } from "react";
import { cn } from "./lib/utils";

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Verificar que el usuario sea admin
  if (user && user.role !== "admin") {
    return <Navigate to={"/acceso-denegado"} />;
  }

  // Close sidebar on mobile route change
  if (window.innerWidth < 768 && sidebarOpen) {
    // Logic to close sidebar would go here but we need useEffect
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;