import { Navigate, Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";
import useAuthStore from "./store/useAuthStone";


function App() {

  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
    
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 max-w-[--breakpoint-2xl] ml-64">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
