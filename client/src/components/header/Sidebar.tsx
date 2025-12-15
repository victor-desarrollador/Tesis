"use client";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import HeaderLeftSideBar from "./HeaderLeftSideBar";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="md:hidden">
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors duration-200 active:scale-95"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>
      <HeaderLeftSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
