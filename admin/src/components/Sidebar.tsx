import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Bookmark,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  Package,
  User,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import useAuthStore from "@/store/useAuthStore";
import { NavLink, useLocation } from "react-router";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
  end?: boolean;
  pathname: string;
};

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const navigationItems = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    label: "Panel de control",
    end: true,
  },
  {
    to: "/dashboard/account",
    icon: <User size={20} />,
    label: "Cuenta",
  },
  {
    to: "/dashboard/users",
    icon: <Users size={20} />,
    label: "Usuarios",
  },
  {
    to: "/dashboard/orders",
    icon: <Package size={20} />,
    label: "Pedidos",
  },
  {
    to: "/dashboard/invoices",
    icon: <FileText size={20} />,
    label: "Facturas",
  },
  {
    to: "/dashboard/banners",
    icon: <Layers size={20} />,
    label: "Publicaciones",
  },
  {
    to: "/dashboard/products",
    icon: <ShoppingBag size={20} />,
    label: "Productos",
  },
  {
    to: "/dashboard/categories",
    icon: <Tag size={20} />,
    label: "Categorias",
  },
  {
    to: "/dashboard/brands",
    icon: <Bookmark size={20} />,
    label: "Marcas",
  },
];

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();

  // Close sidebar when clicking backdrop on mobile
  const handleBackdropClick = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="md:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ width: open ? 256 : 80 }}
        animate={{
          width: open ? 256 : 80,
          x: open ? 0 : -256 // On mobile, slide out completely if closed. On desktop, verify this.
        }}
        // We need separate animation logic for desktop/mobile or use CSS classes to override
        // Let's use CSS for responsiveness and Motion for smooth transitions
        style={{ width: open ? 256 : 80 }} // Fallback/Baseline
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-all duration-300 transform",
          // Mobile: always w-64 but translate-x logic handled by open state
          "w-64 md:translate-x-0",
          // If closed on mobile, hide it. If open, show it.
          !open && "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border bg-sidebar">
          <motion.div
            className={cn(
              "flex items-center overflow-hidden",
              open ? "w-auto opacity-100" : "w-0 opacity-0 md:w-0" // Hide Title on closed desktop too
            )}
            initial={false}
            animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
          >
            <span className="font-bold text-xl text-sidebar-foreground whitespace-nowrap">
              Tienda L&V <span className="text-primary">Admin</span>
            </span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="rounded-full bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground hover:text-white"
            >
              <motion.div
                animate={{ rotate: open ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {open ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} className="rotate-180" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Sidebar menu */}
        <div className="flex flex-col gap-1 flex-1 p-3 bg-sidebar overflow-y-auto custom-scrollbar">
          {navigationItems?.map((item) => (
            <NavItem
              key={item?.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              open={open}
              end={item.end}
              pathname={pathname}
            />
          ))}
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar">
          <motion.div
            className={cn(
              "flex items-center gap-3 mb-4",
              open ? "justify-start" : "justify-center"
            )}
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt="userImage"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  className="flex flex-col overflow-hidden"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[150px]">
                    {user?.name}
                  </span>
                  <span className="text-xs text-primary capitalize font-medium">
                    {user?.role}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div>
            <Button
              variant={"outline"}
              size={open ? "full" : "icon"}
              className={cn(
                "border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50 text-red-500 hover:text-red-600 transition-colors bg-transparent",
                open ? "w-full justify-start" : "w-10 p-0 justify-center"
              )}
              onClick={logout}
            >
              <LogOut size={16} className={cn(open && "mr-2")} />
              {open && "Cerrar sesión"}
            </Button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

function NavItem({ to, icon, label, open, end, pathname }: NavItemProps) {
  const isActive = end ? pathname === to : pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={end}
      className={cn(
        "flex items-center p-3 rounded-md text-sm font-medium transition-all duration-200 gap-3 overflow-hidden",
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/30"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
      )}
    >
      <span className={cn("shrink-0", isActive ? "text-white" : "text-gray-400 group-hover:text-white")}>{icon}</span>
      {open && (
        <span className="truncate">{label}</span>
      )}
    </NavLink>
  );
}

export default Sidebar;
