"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Loader2, Search, X } from "lucide-react";
import { Product } from "@/types/type";
import { useDebounce } from "use-debounce";
import { fetchData } from "@/lib/api";
import AddToCartButton from "../common/AddToCartButton";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setShowResults(false);
      setShowMobileSearch(false);
    }
  };

  const fetchProducts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchData<ProductsResponse>(
        `/products?page=1&limit=6&search=${encodeURIComponent(searchTerm)}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error buscando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      fetchProducts(debouncedSearch);
    } else {
      setProducts([]);
    }
  }, [debouncedSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus mobile input when opened
  useEffect(() => {
    if (showMobileSearch && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const clearSearch = () => {
    setSearch("");
    setProducts([]);
    setShowResults(false);
  }

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Mobile Search Toggle */}
      <button
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="lg:hidden p-2 rounded-full hover:bg-tiendaLVSoft transition-colors"
      >
        <Search className="w-5 h-5 text-tiendaLVText" />
      </button>

      {/* Desktop Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden lg:flex items-center relative w-full group"
      >
        <div className="relative w-full flex items-center">
          <Input
            placeholder="Buscar en Tienda L&V..."
            className="w-full bg-gray-50/50 border-gray-200 focus-visible:border-tiendaLVSecondary/50 focus-visible:ring-tiendaLVSecondary/20 rounded-full py-5 pl-5 pr-12 transition-all duration-300"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 text-gray-400 hover:text-tiendaLVAccent transition-colors p-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 p-2 bg-tiendaLVSecondary text-white rounded-full hover:bg-yellow-600 transition-all shadow-sm active:scale-95"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[70px] z-50 bg-white border-b border-gray-100 shadow-lg lg:hidden p-4"
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                ref={mobileInputRef}
                placeholder="Buscar productos..."
                className="flex-1 bg-gray-50 border-transparent focus:border-tiendaLVSecondary rounded-full"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowResults(true);
                }}
              />
              <button
                type="submit"
                className="bg-tiendaLVSecondary text-white p-2.5 rounded-full"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-2.5 text-gray-500"
              >
                <X size={24} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showResults && (search.length > 2) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-60"
          >
            {loading ? (
              <div className="p-8 flex justify-center text-tiendaLVSecondary">
                <Loader2 className="animate-spin" />
              </div>
            ) : products.length > 0 ? (
              <>
                <ul className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {products.map((product) => (
                    <li key={product._id} className="border-b border-gray-50 last:border-0 hover:bg-pink-50/30 transition-colors">
                      <Link
                        href={`/product/${product._id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center gap-4 p-3"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0 relative">
                          <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{product.brand?.name}</span>
                            {product.price > 0 && (
                              <span className="font-bold text-tiendaLVText">${product.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                  <button
                    onClick={handleSearch}
                    className="text-sm font-semibold text-tiendaLVSecondary hover:underline"
                  >
                    Ver todos los resultados ({products.length}+)
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No se encontraron productos para "{search}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;

