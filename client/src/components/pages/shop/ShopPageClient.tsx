"use client";
import Container from "@/components/common/Container";
import EmptyListDesign from "@/components/common/pages/product/EmptyListDesign";
import ProductCard from "@/components/common/ProductCard";
import ShopSkeleton from "@/components/skeleton/ShopSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchData } from "@/lib/api";
import { Brand, Category, Product } from "@/types/type";
import { ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

interface Props {
  categories: Category[];
  brands: Brand[];
}
const ShopPageClient = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [brand, setBrand] = useState<string>(searchParams.get("brand") || "");
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newlyLoadedProducts, setNewlyLoadedProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [invalidCategory, setInvalidCategory] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const productsPerPage = 10;

  useEffect(() => {
    // 1. Sync Category (existing logic + fix)
    const cotegoryFromUrl = searchParams.get("category");
    if (cotegoryFromUrl) {
      const categoryExits = categories.some(
        (cat) => cat._id === cotegoryFromUrl
      );
      if (!categoryExits) {
        const categoryName = categories.find(
          (cat) =>
            cat.name.toLocaleLowerCase() === cotegoryFromUrl.toLocaleLowerCase()
        );

        if (categoryName) {
          setCategory(categoryName._id);
        } else {
          setInvalidCategory(cotegoryFromUrl);
          setCategory("");
        }
      } else {
        setCategory(cotegoryFromUrl);
      }
    } else {
      setCategory("");
    }

    // 2. Sync Brand
    const brandFromUrl = searchParams.get("brand");
    setBrand(brandFromUrl || "");

    // 3. Sync Search
    const searchFromUrl = searchParams.get("search");
    setSearch(searchFromUrl || "");

    // 4. Sync Price Range
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    if (priceMin && priceMax) {
      setPriceRange([Number(priceMin), Number(priceMax)]);
    } else {
      setPriceRange(null);
    }

    // 5. Sync Sort
    const sortFromUrl = searchParams.get("sort");
    if (sortFromUrl) {
      setSortOrder(sortFromUrl);
    } else {
      setSortOrder("newest");
    }

  }, [searchParams, categories]);

  const fetchProducts = useCallback(
    async (loadMore = false) => {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (brand) params.append("brand", brand);
        if (search) params.append("search", search);
        if (priceRange) {
          params.append("priceMin", priceRange[0].toString());
          params.append("priceMax", priceRange[1].toString());
        }
        params.append("page", currentPage.toString());
        params.append("limit", productsPerPage.toString());
        if (sortOrder) {
          // Map frontend sort values to backend expected values
          let backendSort = "newest"; // Default
          switch (sortOrder) {
            case "asc": // Frontend "Mas reciente" -> Backend "newest"
              backendSort = "newest";
              break;
            case "desc": // Frontend "Mas antiguo" -> We'll use price_asc as a proxy or just keep descending creation if backend supports it. 
              // Actually, backend has specific cases. Let's align options with backend capabilities.
              // "price_asc", "price_desc", "rating", "newest", "popular"
              // Keeping "asc" as "newest" and adding Price sorting.
              backendSort = "newest";
              break;
            // Let's just pass the value directly if we update the Select options
            default:
              backendSort = sortOrder;
          }
          params.append("sort", sortOrder);
        }

        const response: ProductsResponse = await fetchData(
          `/products?${params.toString()}`
        );
        setTotal(response?.pagination?.total || 0);
        if (loadMore) {
          setNewlyLoadedProducts(response?.data || []);
          setProducts((prev) => [...prev, ...(response?.data || [])]);
        } else {
          setNewlyLoadedProducts([]);
          setProducts(response?.data || []);
        }
      } catch (error) {
        console.log("Failed to fetch products:", error);
        setTotal(0);
        if (!loadMore) {
          setProducts([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      category,
      brand,
      search,
      priceRange,
      sortOrder,
      productsPerPage,
      currentPage,
    ]
  );

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [category, brand, search, priceRange, sortOrder]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProducts(true);
    }
  }, [currentPage, fetchProducts]);

  useEffect(() => {
    if (newlyLoadedProducts.length > 0) {
      const timer = setTimeout(() => {
        setNewlyLoadedProducts([]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newlyLoadedProducts]);

  const totalPages = Math.ceil(total / productsPerPage);

  const hasMoreProducts = products?.length < total && currentPage < totalPages;

  const priceRanges: [number, number][] = [ // Precios en ARS (estimados)
    [0, 10000],
    [10000, 30000],
    [30000, 50000],
    [50000, Infinity],
  ];

  const loadMoreProducts = () => {
    if (hasMoreProducts && !loadingMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const resetCategory = () => {
    setCategory("");
    setCurrentPage(1);
    setInvalidCategory("");
  };

  const resetBrand = () => {
    setBrand("");
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const resetPriceRange = () => {
    setPriceRange(null);
    setCurrentPage(1);
  };

  const resetSortOrder = () => {
    setSortOrder("newest");
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setCategory("");
    setBrand("");
    setSearch("");
    setPriceRange(null);
    setSortOrder("newest");
    setCurrentPage(1);
    setInvalidCategory("");
  };

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold">Comprar productos</h2>
          <p className="text-tiendaLVAccent/70 fiont-medium">
            {loading
              ? "Cargando"
              : `Mostrando ${products?.length} de ${total} productos`}
          </p>
          {invalidCategory && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md py-1 px-2">
              <p className="text-sm text-yellow-800">
                Categoría &quot;{invalidCategory}&quot; no encontrada. Mostrando todos
                los productos.
              </p>
            </div>
          )}
        </div>
        {(category || brand || search || priceRange || sortOrder !== "newest") && (
          <Button
            variant={"outline"}
            className="text-sm"
            onClick={resetAllFilters}
            disabled={loading}
          >
            Resetear filtros
          </Button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="p-5 bg-tiendaLVLight w-full md:max-w-64 min-w-60 rounded-lg border">
          {/* Small devices */}
          <div className="md:hidden">
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full mb-4 flex items-center justify-between"
            >
              <span className="font-medium">Filtros</span>
              {isFiltersOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </Button>
          </div>
          <div
            className={`${isFiltersOpen ? "block" : "hidden"
              } md:block space-y-4`}
          >
            {/* ... (Search, Category, Brand, Price Range Sections remain same, just ensure correct nesting if replacing large chunk) ... */}
            {/* Search */}
            {search && (
              <div>
                <h3 className="text-sm font-medium mb-3">Buscar</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                    `&quot;`{search}`&quot;`
                    <button
                      onClick={resetSearch}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      disabled={loading}
                    >
                      <X size={14} />
                    </button>
                  </span>
                </div>
              </div>
            )}
            {/* category */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-2">
                  Categoría
                </label>
                {category && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={resetCategory}
                    disabled={loading}
                    className="text-xs text-blue-600 p-0"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <Select
                value={category || "All"}
                onValueChange={(value) => {
                  setCategory(value === "All" ? "" : value);
                  setCurrentPage(1);
                  setInvalidCategory("");
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full p-2 border rounded-md">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Todas las categorías</SelectItem>
                  {Object.entries(
                    categories?.reduce((acc: { [key: string]: Category[] }, cat) => {
                      const type = cat.categoryType || "Otros";
                      if (!acc[type]) acc[type] = [];
                      acc[type].push(cat);
                      return acc;
                    }, {}) || {}
                  ).map(([type, cats]) => (
                    <SelectGroup key={type}>
                      <SelectLabel className="font-bold text-gray-900 bg-gray-50 px-2 py-1">
                        {type}
                      </SelectLabel>
                      {cats.map((cat) => (
                        <SelectItem key={cat?._id} value={cat?._id} className="pl-6">
                          {cat?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* brands */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-2">Marca</label>
                {brand && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={resetBrand}
                    disabled={loading}
                    className="text-xs text-blue-600 p-0"
                  >
                    Resetear
                  </Button>
                )}
              </div>
              <Select
                value={brand || "All"}
                onValueChange={(value) => {
                  setBrand(value === "All" ? "" : value);
                  setCurrentPage(1);
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full p-2 border rounded">
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marcas</SelectLabel>
                    <SelectItem value="All">Todas las marcas</SelectItem>
                    {brands.map((brd: Brand) => (
                      <SelectItem key={brd?._id} value={brd?._id}>
                        {brd?.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* price range */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-2">
                  Rango de precio
                </label>
                {priceRange && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={resetPriceRange}
                    disabled={loading}
                    className="text-xs text-blue-600 p-0"
                  >
                    Resetear
                  </Button>
                )}
              </div>
              <Select
                value={priceRange ? `${priceRange[0]}-${priceRange[1]}` : "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setPriceRange(null);
                  } else {
                    const [min, max] = value.split("-").map(Number);
                    setPriceRange([min, max]);
                  }
                  setCurrentPage(1);
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full p-2 border rounded">
                  <SelectValue placeholder="Seleccionar rango de precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rangos de precio</SelectLabel>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    {priceRanges.map(([min, max]) => (
                      <SelectItem key={`${min}-${max}`} value={`${min}-${max}`}>
                        ${min} - {max === Infinity ? "Por encima" : `$${max}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* sort filter */}
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-2">
                  Ordenar por
                </label>
                {sortOrder !== "newest" && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={resetSortOrder}
                    disabled={loading}
                    className="text-xs text-blue-600 p-0"
                  >
                    Resetear
                  </Button>
                )}
              </div>
              <Select
                value={sortOrder}
                onValueChange={(value: "newest" | "price_asc" | "price_desc") => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full p-2 border rounded">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más reciente</SelectItem>
                  <SelectItem value="price_asc">Precio: Bajo a Alto</SelectItem>
                  <SelectItem value="price_desc">Precio: Alto a Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="bg-tiendaLVLight p-5 rounded-md w-full border">
          {loading ? (
            <ShopSkeleton />
          ) : products?.length > 0 ? (
            <div className="w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {products?.map((product, index) => {
                  const isNewlyLoaded = newlyLoadedProducts.some(
                    (newProduct) => newProduct._id === product._id
                  );
                  return (
                    <div
                      key={`${product?._id}-${index}`}
                      className={`transition-all duration-700 ease-out ${isNewlyLoaded
                        ? "opacity-0 translate-y-8 scale-95"
                        : "opacity-100 translate-y-0 scale-100"
                        }`}
                      style={{
                        transitionDelay: isNewlyLoaded
                          ? `${(index % 10) * 100}ms`
                          : "0ms",
                      }}
                    >
                      {/* Debug log for images */}
                      <ProductCard product={product} />
                    </div>
                  );
                })}
              </div>
              {hasMoreProducts && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <Button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    variant={"outline"}
                    className="w-full rounded-sm hover:bg-tiendaLVPrimary hover:text-tiendaLVLight hoverEffect py-5 mt-2"
                  >
                    {loadingMore ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Cargar más productos"
                    )}
                  </Button>
                </div>
              )}
              {!hasMoreProducts &&
                products.length > 0 &&
                total > 0 &&
                !loadingMore && (
                  <div className="text-center py-6 mt-6">
                    <p className="text-gray-600 text-lg mb-2">
                      🎉 Has visto todo! No hay más productos para mostrar.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Mostrando todos los {products.length} productos
                    </p>
                  </div>
                )}
            </div>
          ) : (
            !loading && (
              <EmptyListDesign
                message="No hay productos que coincidan con tus filtros seleccionados."
                resetFilters={resetAllFilters}
              />
            )
          )}
        </div>
      </div>
    </Container>
  );
};

export default ShopPageClient;
