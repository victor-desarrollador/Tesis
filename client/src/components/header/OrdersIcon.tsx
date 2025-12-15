import { useOrderStore } from "@/lib/store";
import { Package } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OrdersIcon = () => {
  const { orders } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link
        href={"/user/orders"}
        className="relative hover:text-tiendaLVPrimary hoverEffect"
      >
        <Package size={24} />
        <span className="absolute -right-2 -top-2 bg-tiendaLVPrimary text-tiendaLVLight text-[11px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
          0
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={"/user/orders"}
      className="relative hover:text-tiendaLVPrimary hoverEffect"
    >
      <Package size={24} />
      <span className="absolute -right-2 -top-2 bg-tiendaLVPrimary text-tiendaLVLight text-[11px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
        {orders?.length || 0}
      </span>
    </Link>
  );
};

export default OrdersIcon;
