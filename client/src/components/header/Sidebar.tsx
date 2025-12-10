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
      <button onClick={toggleSidebar}>
        <Menu />
      </button>
      <HeaderLeftSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
