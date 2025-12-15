"use client";
import React from "react";
import TopHeader from "./TopHeader";
import { useUserStore } from "@/lib/store";
import Container from "../common/Container";
import Logo from "../common/Logo";
import SearchInput from "./SearchInput";
import OrdersIcon from "./OrdersIcon";
import WishlistIcon from "./WishlistIcon";
import UserButton from "./UserButton";
import CartIcon from "./CartIcon";
import Sidebar from "./Sidebar";

const Header = () => {
  const { verifyAuth } = useUserStore();

  React.useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return (
    <header className="border-b sticky top-0 z-50 bg-tiendaLVLight">
      <TopHeader />
      <Container className="flex items-center justify-between gap-10 py-4">
        <div className="flex flex-1 items-center justify-between md:justify-start md:gap-12">
          <Sidebar />
          <Logo />
          <div className="md:hidden flex items-center gap-3">
            <OrdersIcon />
            <WishlistIcon />
            <CartIcon />
          </div>
          <SearchInput />
        </div>
        <div className="hidden md:inline-flex items-center gap-5">
          {/* Admin Button */}
          {useUserStore.getState().authUser?.role === 'admin' && (
            <a
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:5173/login"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-tiendaLVSecondary rounded-full hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Panel Admin
            </a>
          )}
          <OrdersIcon />
          <WishlistIcon />
          <UserButton />
          <CartIcon />
        </div>
      </Container>
    </header>
  );
};

export default Header;
