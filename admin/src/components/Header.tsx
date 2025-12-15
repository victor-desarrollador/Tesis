import useAuthStore from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { user } = useAuthStore();
  return (
    <header className="sticky top-0 z-10 flex items-center h-16 gap-5 bg-background border-b border-border px-4 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground mr-2"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
      </Button>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground">
          <Bell size={18} />
        </Button>
      </div>
      <div className="flex items-center gap-3 border-l border-border pl-4">
        <div className="hidden md:block text-right">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {user?.role}
          </div>
        </div>

        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold overflow-hidden ring-2 ring-primary/20">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
