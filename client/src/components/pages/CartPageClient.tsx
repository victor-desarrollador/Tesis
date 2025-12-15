"use client";
import { useCartStore, useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Container from "../common/Container";
import { Skeleton } from "../ui/skeleton";
import CartSkeleton from "../skeleton/CartSkeleton";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import PageBreadcrumb from "../common/PageBreadcrumb";
import Image from "next/image";
import PriceFormatter from "../common/PriceFormatter";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

const CartPageClient = () => {
  const {
    cartItemsWithQuantities,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    syncCartFromServer,
  } = useCartStore();
  const { auth_token } = useUserStore();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const TAX_RATE = 0.08; // 8% tax rate

  useEffect(() => {
    const initializeCart = async () => {
      if (auth_token) {
        try {
          await syncCartFromServer();
        } catch (error) {
          console.error("No se ha podido sincronizar el carrito desde el servidor:", error);
        }
      }
      setIsLoading(false);
    };
    initializeCart();
  }, [auth_token, syncCartFromServer]);

  const calculateSubtotal = () => {
    return cartItemsWithQuantities.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const tax = subtotal * TAX_RATE; // 8% tax
    return subtotal + shipping + tax;
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar el producto");
    }
  };

  // Helper function to get product image safely
  const getProductImage = (product: any) => {
    // 1. Try 'images' array (new format)
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const first = product.images[0];
      if (typeof first === 'string') return first;
      if (typeof first === 'object' && first.url) return first.url;
    }
    // 2. Try 'image' field (old format)
    if (product?.image) {
      if (typeof product.image === 'string') return product.image;
      if (typeof product.image === 'object' && product.image.url) return product.image.url;
    }
    return null;
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      toast.success("Cantidad actualizada");
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      toast.error("No se pudo actualizar la cantidad");
    }
  };

  const handleClearCart = () => {
    setShowClearDialog(true);
  };

  const confirmClearCart = async () => {
    setIsLoading(true);
    try {
      await clearCart();
      setShowClearDialog(false);
      toast.success("Tu carrito ha sido vaciado");
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      toast.error("No se pudo vaciar el carrito");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      if (!auth_token) {
        toast.error("Inicia sesión para finalizar tu compra");
        setIsCheckingOut(false);
        return;
      }

      // Redirect to checkout page with cart items
      router.push(`/user/checkout`);
      // toast.success("Iniciando proceso de pago..."); // Optional, visually noisy if redirect is fast
    } catch (error) {
      console.error("Checkout redirect error:", error);
      toast.error("Error al iniciar el pago. Intenta nuevamente.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (cartItemsWithQuantities.length === 0) {
    return (
      <Container className="py-16">
        <div className="bg-tiendaLVLight rounded-md border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Explora nuestro catálogo y encuentra lo mejor para tu bebé.
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium"
              >
                Ir a la Tienda
              </Button>
            </Link>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Calidad Premium
                </h3>
                <p className="text-sm text-gray-600">
                  Productos seleccionados con los más altos estándares
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Mejores Precios
                </h3>
                <p className="text-sm text-gray-600">
                  Directo de fábrica para cuidar tu economía
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Envío Rápido
                </h3>
                <p className="text-sm text-gray-600">
                  Entregas seguras y confiables a todo el país
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* breadcrumb */}
      <PageBreadcrumb
        items={[]}
        currentPage="Carrito"
        showSocialShare={true}
        shareData={{
          title: "Mi Carrito",
          text: `Mira mi carrito con ${cartItemsWithQuantities.length} artículo${cartItemsWithQuantities.length !== 1 ? "s" : ""
            } de Babyshop`,
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-tiendaLVAccent">Mi Carrito</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Cart items section */}
        <div className="lg:col-span-3">
          <div className="bg-tiendaLVLight rounded-md border border-gray-200 shadow-sm p-6">
            {/* Cart Table Header - Only visible on larger screens */}
            <div className="hidden lg:grid grid-cols-12 gap-4 py-4 border-b border-gray-200 mb-6">
              <div className="col-span-6 text-sm font-medium text-gray-900 uppercase tracking-wide">
                Artículo
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-900 uppercase tracking-wide text-center">
                Precio
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-900 uppercase tracking-wide text-center">
                Cantidad
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-900 uppercase tracking-wide text-center">
                Subtotal
              </div>
            </div>
            {/* Cart items */}
            <div className="space-y-4">
              {cartItemsWithQuantities?.map((cartItem) => (
                <div
                  key={cartItem?.product?._id}
                  className="border border-gray-100 rounded-lg p-4 lg:p-0 lg:border-0 lg:rounded-none"
                >
                  {/* Mobile layout */}
                  <div className="block lg:hidden">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <Link href={`/product/${cartItem.product._id}`}>
                        <div className="relative w-24 h-24 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0 hover:shadow-md transition-all duration-300 cursor-pointer">
                          {getProductImage(cartItem.product) ? (
                            <Image
                              src={getProductImage(cartItem.product)}
                              alt={cartItem.product.name}
                              fill
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                              <ShoppingCart className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${cartItem.product._id}`}>
                          <h3 className="font-medium text-gray-900 mb-2 text-sm leading-5 hover:text-blue-600 transition-colors cursor-pointer">
                            {cartItem.product.name}
                          </h3>
                        </Link>

                        {/* Price and Quantity Row */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-xs text-gray-500 block">
                              Precio
                            </span>
                            <PriceFormatter
                              amount={cartItem.product.price}
                              className="text-sm font-medium text-gray-900"
                            />
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.product._id,
                                  cartItem.quantity - 1
                                )
                              }
                              className="h-8 w-8 p-0 hover:bg-gray-50 border-0 rounded-none"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <div className="h-8 w-10 flex items-center justify-center border-x border-gray-300 bg-gray-50 text-xs font-medium">
                              {cartItem.quantity}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.product._id,
                                  cartItem.quantity + 1
                                )
                              }
                              className="h-8 w-8 p-0 hover:bg-gray-50 border-0 rounded-none"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-500 block">
                              Subtotal
                            </span>
                            <PriceFormatter
                              amount={
                                cartItem.product.price * cartItem.quantity
                              }
                              className="text-sm font-semibold text-gray-900"
                            />
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveItem(cartItem.product._id)
                            }
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center py-6 border-b border-gray-100">
                    {/* product info */}
                    <div className="lg:col-span-6 flex items-center gap-4">
                      <Link href={`/product/${cartItem.product._id}`}>
                        <div className="relative w-24 h-24 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0 hover:shadow-md transition-all duration-300">
                          {getProductImage(cartItem.product) ? (
                            <Image
                              src={getProductImage(cartItem.product)}
                              alt={cartItem.product.name}
                              fill
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                              <ShoppingCart className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="flex items-center gap-3">
                        <Link href={`/product/${cartItem.product._id}`}>
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-tiendaLVPrimary hoverEffect">
                            {cartItem?.product.name}
                          </h3>
                        </Link>
                        {/* Remove button */}

                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() =>
                            handleRemoveItem(cartItem?.product?._id)
                          }
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto text-xs hoverEffect"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                        </Button>
                      </div>
                    </div>
                    {/* price */}
                    <div className="lg:col-span-2 text-center">
                      <PriceFormatter
                        amount={cartItem?.product?.price}
                        className="text-base font-medium text-gray-900"
                      />
                    </div>
                    {/* quantity */}
                    <div className="lg:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() =>
                            handleQuantityChange(
                              cartItem?.product?._id,
                              cartItem?.quantity - 1
                            )
                          }
                          className="h-10 w-10 p-0 hover:bg-gray-50 border-0 rounded-none"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="h-10 w-12 flex items-center justify-center border-x border-gray-300 bg-gray-50 text-sm font-medium">
                          {cartItem.quantity}
                        </div>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() =>
                            handleQuantityChange(
                              cartItem?.product?._id,
                              cartItem?.quantity + 1
                            )
                          }
                          className="h-10 w-10 p-0 hover:bg-gray-50 border-0 rounded-none"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Subtotal */}
                    <div className="lg:col-span-2 text-center">
                      <PriceFormatter
                        amount={cartItem.product.price * cartItem.quantity}
                        className="text-base font-semibold text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Cart actions */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <Link href={"/shop"}>
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="w-full sm:w-auto rounded-full px-8"
                >
                  <ArrowLeft /> Continuar comprando
                </Button>
              </Link>
              <Button
                variant={"outline"}
                size={"lg"}
                onClick={handleClearCart}
                className="w-full sm:w-auto rounded-full px-8 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                Limpiar carrito
              </Button>
            </div>
          </div>
        </div>
        {/* Cart totals */}
        <div className="lg:col-span-1 bg-tiendaLVLight rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del carrito</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <PriceFormatter
                amount={calculateSubtotal()}
                className="text-base font-medium text-gray-900"
              />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Envío</span>
              <span className="text-base font-medium">
                {calculateSubtotal() > 100 ? (
                  <span className="text-green-600">Envío gratuito</span>
                ) : (
                  <PriceFormatter
                    amount={15}
                    className="text-base font-medium text-gray-900"
                  />
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Impuesto</span>
              <PriceFormatter
                amount={calculateSubtotal() * TAX_RATE}
                className="text-base font-medium text-gray-900"
              />
            </div>

            {calculateSubtotal() > 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm font-medium">
                  🎉 Tienes derecho a envío gratuito!
                </p>
              </div>
            )}
            <Separator className="my-4" />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total</span>
              <PriceFormatter
                amount={calculateTotal()}
                className="text-base font-medium text-gray-900"
              />
            </div>
          </div>
          <Button
            size={"lg"}
            onClick={handleCheckout}
            disabled={isCheckingOut || cartItemsWithQuantities?.length === 0}
            className="w-full mt-6 bg-tiendaLVAccent hover:bg-gray-800 text-tiendaLVLight rounded-full py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creando orden...
              </>
            ) : (
              "Proceder al Pago"
            )}
          </Button>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Pago seguro • SSL encriptado
            </p>
          </div>
        </div>
      </div>
      {/* Clear cart confirmation modal */}
      <AlertDialog
        open={showClearDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowClearDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpiar carrito</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres limpiar tu carrito? Esta acción no
              puede ser deshecha y todos los artículos se eliminarán de tu carrito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowClearDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogCancel
              onClick={confirmClearCart}
              className="bg-tiendaLVSecondary/80 hover:bg-tiendaLVSecondary hoverEffect text-tiendaLVLight hover:text-tiendaLVLight"
            >
              Sí, Limpiar carrito
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
};

export default CartPageClient;
