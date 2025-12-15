"use client";

import { createOrderFromCart, getOrderById, Order } from "@/lib/orderApi";
import { useCartStore, useUserStore } from "@/lib/store";
import { Address } from "@/types/type";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
import authApi from "@/lib/authApi";

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
  const { auth_token, authUser, isAuthenticated, verifyAuth, updateUser } = useUserStore();
  const { cartItemsWithQuantities, clearCart } = useCartStore();

  const orderId = searchParams.get("orderId");
  const hasRefreshedProfile = useRef(false);

  // Determine if we need to verify auth or refresh profile
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      // Ensure we have the latest user data (addresses)
      if (auth_token && !hasRefreshedProfile.current) {
        hasRefreshedProfile.current = true;
        try {
            const response = await authApi.get("/auth/profile");
            if (response.success && response.data) {
                updateUser(response.data);
            }
        } catch (error) {
            console.error("Failed to refresh profile:", error);
        }
      }

      if (auth_token && !authUser) {
        await verifyAuth();
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, [auth_token, verifyAuth, updateUser]);

  // Helper to ensure we get a valid image
  const getProductImage = (product: any) => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const first = product.images[0];
      return typeof first === 'string' ? first : first.url;
    }
    if (product?.image) {
      return typeof product.image === 'string' ? product.image : product.image.url;
    }
    return null;
  };

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
              image: getProductImage(item.product),
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
          image: getProductImage(item.product), // Use helper here too
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pedido no encontrado
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            El pedido que estás buscando no existe o ha sido eliminado.
          </p>
          <Button onClick={() => router.push("/cart")} size="lg" className="hoverEffect">
            Volver al carrito
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <PageBreadcrumb
        items={[{ label: "Carrito", href: "/user/cart" }]}
        currentPage="Finalizar Compra"
      />

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Finalizar Compra</h1>
        <p className="text-gray-600 text-lg">Revisa tu pedido y completa el pago de forma segura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-8">

          {/* Address Selection with Premium Touch */}
          <section>
            <AddressSelection
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              addresses={addresses}
              onAddressesUpdate={handleAddressesUpdate}
            />
          </section>

          {/* Order items List */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">2</span>
                Detalles del pedido
              </h2>
            </div>

            <div className="divide-y divide-gray-50">
              {order?.items.map((item, index) => (
                <div key={index.toString()} className="p-6 group hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-6">
                    {/* Image Container - Premium Style */}
                    <div className="relative w-24 h-24 bg-white border border-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-black transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-400">Precio unitario</div>
                        <PriceFormatter
                          amount={item.price * item.quantity}
                          className="text-lg font-bold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
              <span className="font-medium">Total de artículos</span>
              <span className="font-bold text-gray-900">{order.items.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
            </div>
          </section>

          {/* Payment Information */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">3</span>
              Información de pago
            </h2>

            <div className="space-y-4">
              <div className="relative overflow-hidden flex items-center gap-4 p-5 border border-gray-200 bg-white rounded-2xl cursor-pointer hover:border-black transition-all duration-300 group">
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Mercado Pago</h3>
                  <p className="text-sm text-gray-500">
                    Tarjetas de crédito, débito y otros medios
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-black group-hover:bg-black flex items-center justify-center transition-colors">
                  <CheckCircle className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Sus datos están protegidos con encriptación SSL de 256 bits</span>
              </div>
            </div>
          </section>
        </div>

        {/* Order summary - Right Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Resumen del pedido
            </h2>

            <div className="space-y-4 text-base">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <PriceFormatter
                  amount={calculateSubtotal()}
                  className="font-medium text-gray-900"
                />
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Envío</span>
                <span className="font-medium">
                  {calculateShipping() === 0 ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm font-bold">Gratis</span>
                  ) : (
                    <PriceFormatter
                      amount={calculateShipping()}
                      className="text-gray-900"
                    />
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Impuestos (8%)</span>
                <PriceFormatter
                  amount={calculateTax()}
                  className="font-medium text-gray-900"
                />
              </div>

              {calculateShipping() === 0 && (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="text-xl">🎉</div>
                  <div>
                    <h4 className="font-bold text-green-800 text-sm mb-0.5">¡Envío Gratuito Calificado!</h4>
                    <p className="text-green-700 text-xs leading-relaxed">
                      Ahorraste el costo de envío en este pedido.
                    </p>
                  </div>
                </div>
              )}

              <Separator className="my-6 bg-gray-100" />

              <div className="flex justify-between items-end mb-2">
                <span className="text-lg font-bold text-gray-900">Total a Pagar</span>
                <PriceFormatter
                  amount={calculateTotal()}
                  className="text-2xl font-black text-gray-900"
                />
              </div>
              <p className="text-xs text-gray-400 text-right mb-6">IVA incluido</p>
            </div>

            <Button
              size={"lg"}
              className="w-full py-7 text-lg font-bold rounded-xl shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] transition-all duration-300 bg-black text-white hover:bg-gray-900"
              disabled={processing || isCreatingOrder || !selectedAddress}
              onClick={handlePayment}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : isCreatingOrder ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando pedido...
                </span>
              ) : !selectedAddress ? (
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Seleccionar dirección
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Pagar con Mercado Pago
                </span>
              )}
            </Button>

            <p className="text-center mt-4 text-xs text-gray-400">
              Al completar la compra aceptas nuestros
              <a href="#" className="underline hover:text-gray-900 ml-1">Términos y condiciones</a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPageClient;
