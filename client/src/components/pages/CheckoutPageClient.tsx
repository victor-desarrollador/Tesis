"use client";

import { createOrderFromCart, getOrderById, Order } from "@/lib/orderApi";
import { useCartStore, useUserStore } from "@/lib/store";
import { Address } from "@/types/type";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CheckoutSkeleton from "../skeleton/CheckoutSkeleton";
import { Button } from "../ui/button";
import Container from "../common/Container";
import PageBreadcrumb from "../common/PageBreadcrumb";
import PriceFormatter from "../common/PriceFormatter";
import Image from "next/image";
import { AlertCircle, CheckCircle, CreditCard, Lock } from "lucide-react";
import AddressSelection from "./AddressSelection";
import { Separator } from "../ui/separator";
import { createPaymentPreference } from "@/lib/paymentApi";

const CheckoutPageClient = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth_token, authUser, isAuthenticated, verifyAuth } = useUserStore();
  const { cartItemsWithQuantities, clearCart } = useCartStore();

  const orderId = searchParams.get("orderId");

  //   Verify authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      if (auth_token && !authUser) {
        await verifyAuth();
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, [auth_token, authUser, verifyAuth]);

  useEffect(() => {
    // Wait for auth check to complete
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !authUser || !auth_token) {
      router.push("/auth/signin");
      return;
    }

    // Load user addresses
    if (authUser.addresses && authUser.addresses.length > 0) {
      setAddresses(authUser.addresses);
      // Auto-select address logic
      if (authUser.addresses.length === 1) {
        // If only one address, select it automatically
        setSelectedAddress(authUser.addresses[0]);
      } else {
        // If multiple addresses, prefer default address
        const defaultAddress = authUser.addresses.find(
          (addr) => addr.isDefault
        );
        setSelectedAddress(defaultAddress || authUser.addresses[0]);
      }
    }

    const initializeCheckout = async () => {
      setLoading(true);
      try {
        if (orderId) {
          // If orderId is provided, load existing order
          console.log("Finalizar compra: Recuperar pedido", orderId);
          const orderData = await getOrderById(orderId, auth_token);
          if (orderData) {
            console.log("Finalizar compra: Pedido recuperado exitosamente");
            setOrder(orderData);
          } else {
            toast.error("Pedido no encontrado");
            router.push("/user/cart");
          }
        } else {
          // If no orderId, check if we have cart items
          if (cartItemsWithQuantities.length === 0) {
            toast.error("Tu carrito está vacío");
            router.push("/user/cart");
            return;
          }

          // Create a temporary order object for display
          const tempOrder: Order = {
            _id: "temp",
            userId: authUser._id,
            items: cartItemsWithQuantities.map((item) => ({
              productId: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.image,
            })),
            total: cartItemsWithQuantities.reduce(
              (total, item) => total + item.product.price * item.quantity,
              0
            ),
            status: "pendiente",
            shippingAddress: {
              street: "",
              city: "",
              country: "",
              postalCode: "",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setOrder(tempOrder);
        }
      } catch (error) {
        console.error("Error finalizando la compra:", error);
        toast.error("No se pudieron cargar los detalles del checkout");
        router.push("/user/cart");
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [
    orderId,
    auth_token,
    router,
    isAuthenticated,
    authUser,
    authLoading,
    cartItemsWithQuantities,
  ]);

  const handleAddressesUpdate = (updatedAddresses: Address[]) => {
    setAddresses(updatedAddresses);

    // Auto-select address logic
    if (updatedAddresses.length === 1) {
      // If only one address, select it automatically
      setSelectedAddress(updatedAddresses[0]);
    } else if (updatedAddresses.length > 1) {
      // If multiple addresses, prefer default or keep current selection
      const defaultAddress = updatedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (
        !selectedAddress ||
        !updatedAddresses.find((addr) => addr._id === selectedAddress._id)
      ) {
        // If no default and current selection is invalid, select first
        setSelectedAddress(updatedAddresses[0]);
      }
    } else {
      // No addresses, clear selection
      setSelectedAddress(null);
    }
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 15;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  //   handle mercado pago checkout function
  const handlePayment = async () => {
    if (!order) return;
    if (!selectedAddress) {
      toast.error("Por favor, seleccione una dirección de envío");
      return;
    }
    setProcessing(true);
    try {
      let finalOrder = order;
      // If this is a temporary order (from cart), create it first
      if (order?._id === "temp") {
        setIsCreatingOrder(true);
        const payloadItems = cartItemsWithQuantities.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        }));

        const shippingPayload = {
          street: selectedAddress!.street,
          city: selectedAddress!.city,
          country: selectedAddress!.country || "Argentina",
          postalCode: selectedAddress!.postalCode || "0000",
        };

        console.log("Processing Payment with:", { payloadItems, shippingPayload });

        const response = await createOrderFromCart(
          auth_token!,
          payloadItems,
          shippingPayload
        );

        if (!response?.success || !response.order) {
          throw new Error(response.message || "No se pudo crear el pedido");
        }
        finalOrder = response.order;
        setOrder(finalOrder);

        // Clear cart after successful order creation
        // await clearCart();
        setIsCreatingOrder(false);
      }

      // Mercado Pago payment preference creation
      const preference = await createPaymentPreference(finalOrder._id);

      if (preference.initPoint) {
        // Redirect to Mercado Pago Checkput
        window.location.href = preference.initPoint;
      } else {
        toast.error("No se pudo iniciar el pago con Mercado Pago");
      }

    } catch (error) {
      console.log("Error de pago con Mercado Pago", error);
      toast.error("Error al procesar el pago. Por favor intente nuevamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return <CheckoutSkeleton />;
  }

  if (!order) {
    return (
      <Container className="py-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Pedido no encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              El pedido que estás buscando no existe o ha sido eliminado.
            </p>
            <Button onClick={() => router.push("/cart")}>Volver al carrito</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <PageBreadcrumb
        items={[{ label: "Carrito", href: "/user/cart" }]}
        currentPage="Finalizar Compra"
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
        <p className="text-gray-600">Complete su pedido</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Addresss */}

          <AddressSelection
            selectedAddress={selectedAddress}
            onAddressSelect={setSelectedAddress}
            addresses={addresses}
            onAddressesUpdate={handleAddressesUpdate}
          />
          {/* Order items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Detalles del pedido
            </h2>
            <div>
              {order?.items.map((item, index) => (
                <div key={index.toString()}>
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity} ×{" "}
                      <PriceFormatter amount={item.price} />
                    </p>
                  </div>

                  <div className="text-right">
                    <PriceFormatter
                      amount={item.price * item.quantity}
                      className="text-base font-semibold text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Información de pago
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Mercado Pago</h3>
                  <p className="text-sm text-gray-600">
                    Pago seguro con Mercado Pago
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Información de pago segura y encriptada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-babyshopWhite rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Resumen del pedido
            </h2>
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
                  {calculateShipping() === 0 ? (
                    <span className="text-green-600">Envío gratuito</span>
                  ) : (
                    <PriceFormatter
                      amount={calculateShipping()}
                      className="text-base font-medium text-gray-900"
                    />
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Impuestos</span>
                <PriceFormatter
                  amount={calculateTax()}
                  className="text-base font-medium text-gray-900"
                />
              </div>
              {calculateShipping() === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium">
                    🎉 ¡Tienes envío gratis!
                  </p>
                </div>
              )}

              <Separator className="my-4" />
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <PriceFormatter
                  amount={calculateTotal()}
                  className="text-xl font-bold text-gray-900"
                />
              </div>
            </div>
            <Button
              size={"lg"}
              className="w-full mt-6 font-semibold hover:text-babyshopWhite hoverEffect disabled:opacity-50"
              disabled={processing || isCreatingOrder || !selectedAddress}
              onClick={handlePayment}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Procesando...
                </>
              ) : isCreatingOrder ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creando pedido...
                </>
              ) : !selectedAddress ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Seleccionar dirección para continuar
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pagar con Mercado Pago
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPageClient;
