import { useWishlistStore } from "@/lib/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WishlistIcon = () => {
  const { wishlistItems } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link
        href={"/user/wishlist"}
        className="relative hover:text-tiendaLVPrimary hoverEffect"
      >
        <Heart size={24} />
        <span className="absolute -right-2 -top-2 bg-tiendaLVPrimary text-tiendaLVLight text-[11px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
          0
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={"/user/wishlist"}
      className="relative hover:text-tiendaLVPrimary hoverEffect"
    >
      <Heart size={24} />
      <span className="absolute -right-2 -top-2 bg-tiendaLVPrimary text-tiendaLVLight text-[11px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
        {wishlistItems?.length || 0}
      </span>
    </Link>
  );
};

export default WishlistIcon;
