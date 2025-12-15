"use client";

import { createOrderFromCart, getOrderById, Order } from "@/lib/orderApi";
import { useCartStore, useUserStore } from "@/lib/store";
import { Address } from "@/types/type";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import CheckoutSkeleton from "../skeleton/CheckoutSkeleton";
import Container from "../common/Container";
import PageBreadcrumb from "../common/PageBreadcrumb";
import { createPaymentPreference } from "@/lib/paymentApi";
import authApi from "@/lib/authApi";
import CheckoutSteps from "../checkout/CheckoutSteps";
import DeliveryMethodStep from "../checkout/DeliveryMethodStep";
import DeliveryDetailsStep from "../checkout/DeliveryDetailsStep";
import PaymentMethodStep from "../checkout/PaymentMethodStep";
import ReviewStep from "../checkout/ReviewStep";
import { Button } from "../ui/button";
import TransferModal from "../checkout/TransferModal";

const CheckoutPageClient = () => {
  const [order, setOrder] = useState<Order | any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Wizard State
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth_token, authUser, isAuthenticated, verifyAuth, updateUser } = useUserStore();
  const { cartItemsWithQuantities, clearCart } = useCartStore();

  const orderId = searchParams.get("orderId");
  const hasRefreshedProfile = useRef(false);

  // Steps Configuration
  const steps = [
    { id: 1, label: "Entrega" },
    { id: 2, label: "Datos" },
    { id: 3, label: "Pago" },
    { id: 4, label: "Revisar" },
  ];

  // Auth & Data Loading (Same as before)
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
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

  // Load Order or Cart items
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !authUser || !auth_token) {
      router.push("/auth/signin");
      return;
    }

    if (authUser.addresses && authUser.addresses.length > 0) {
      setAddresses(authUser.addresses);
      if (authUser.addresses.length === 1) {
        setSelectedAddress(authUser.addresses[0]);
      } else {
        const defaultAddress = authUser.addresses.find((addr) => addr.isDefault);
        setSelectedAddress(defaultAddress || authUser.addresses[0]);
      }
    }

    const initializeCheckout = async () => {
      setLoading(true);
      try {
        if (orderId) {
          const orderData = await getOrderById(orderId, auth_token);
          if (orderData) {
            setOrder(orderData);
          } else {
            toast.error("Pedido no encontrado");
            router.push("/user/cart");
          }
        } else {
          if (cartItemsWithQuantities.length === 0) {
            toast.error("Tu carrito está vacío");
            router.push("/user/cart");
            return;
          }
          // Temp order construction
          const tempOrder = {
            _id: "temp",
            userId: authUser._id,
            items: cartItemsWithQuantities.map((item) => ({
              productId: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.images?.[0]?.url || item.product.image || "",
            })),
            total: cartItemsWithQuantities.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
          };
          setOrder(tempOrder);
        }
      } catch (error) {
        console.error("Error loading checkout:", error);
        toast.error("Error al cargar checkout");
        router.push("/user/cart");
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [orderId, auth_token, router, isAuthenticated, authUser, authLoading, cartItemsWithQuantities]);


  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- Final Payment/Order Logic ---
  const handleConfirmOrder = async () => {
    if (!order) return;
    if (deliveryMethod === "shipping" && !selectedAddress) {
      toast.error("Debes seleccionar una dirección de envío");
      setStep(2); // Go back to details
      return;
    }

    // Intercept Transfer Payment
    if (paymentMethod === "transferencia") {
      setShowTransferModal(true);
      return;
    }

    await processOrderCreation();
  };

  const processOrderCreation = async () => {
    if (!order) return;

    setProcessing(true);
    try {
      let finalOrderId = order._id;

      // 1. Create Order if "temp"
      if (order._id === "temp") {
        setIsCreatingOrder(true);
        const payloadItems = cartItemsWithQuantities.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price, // Use base price, backend will validate
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || item.product.image || "",
        }));

        // Construct Shipping Payload (empty if pickup)
        const shippingPayload = deliveryMethod === "shipping" && selectedAddress ? {
          street: selectedAddress.street,
          city: selectedAddress.city,
          country: selectedAddress.country || "Argentina",
          postalCode: selectedAddress.postalCode || "0000",
        } : undefined;

        // Pass new fields to API
        // Note: We need to update createOrderFromCart signature or pass additional params if the current API helper doesn't support them.
        // Assuming we might need to cast or simple object pass. 
        // Wait, createOrderFromCart arguments are (token, items, shippingAddress). 
        // I need to update `lib/orderApi.ts` OR just force it here if I can't change that file now.
        // Let's assume I can modify the payload sent to the backend.
        // Since I can't modify `lib/orderApi` right now easily without another tool call (I can, but I want to finish this), 
        // I will use `authApi.post("/orders")` directly here or assume `createOrderFromCart` passes the whole body if I refactor it later.
        // Actually, looking at `createOrderFromCart` in `client/src/lib/orderApi.ts`, it likely takes specific args.
        // I should verify `client/src/lib/orderApi.ts`. 
        // *Update*: I will use `authApi` directly here for maximum flexibility with the new fields I added to backend.

        const orderPayload = {
          items: payloadItems,
          shippingAddress: shippingPayload,
          deliveryMethod,
          paymentMethod
        };

        // Direct API call to ensure we send new fields
        const response = await authApi.post("/orders", orderPayload);

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || "Error al crear pedido");
        }

        const createdOrder = response.data.order;
        finalOrderId = createdOrder._id;
        setOrder(createdOrder);
        clearCart();
      }

      // 2. Process Payment
      if (paymentMethod === "mercadopago") {
        const preference = await createPaymentPreference(finalOrderId);
        if (preference.initPoint) {
          // Open MP in new tab
          window.open(preference.initPoint, '_blank');

          // Redirect current tab to empty cart (as per user request)
          // We clear cart first to reflect "order placed" state in UI (technically pending)
          clearCart();
          router.push("/user/cart");
          toast.success("Se abrió una nueva ventana para realizar el pago");
        } else {
          toast.error("Error al conectar con Mercado Pago");
        }
      } else {
        // Cash / Transfer
        // Update status? Order is created as pending.
        // Redirect to success / instructions page.
        toast.success("¡Pedido realizado con éxito!");
        // For now simpler redirect
        router.push(`/user/orders`);
      }

    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Error al procesar el pedido");
    } finally {
      setIsCreatingOrder(false);
      setProcessing(false);
    }
  };

  const handleTransferConfirm = async () => {
    // Close modal is handled by logic flow or explicitly if needed, 
    // but here we just call processOrderCreation which handles redirect.
    // We might want to keep modal open with loading state until redirect happens.
    await processOrderCreation();
    setShowTransferModal(false);
  };


  if (loading || authLoading) return <CheckoutSkeleton />;

  if (!order && !loading) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">No hay pedido activo</h1>
        <Button onClick={() => router.push("/")} className="mt-4">Volver al inicio</Button>
      </Container>
    )
  }

  return (
    <Container className="py-10 min-h-screen">
      <PageBreadcrumb items={[{ label: "Carrito", href: "/user/cart" }]} currentPage="Checkout" />

      <div className="mt-8">
        <CheckoutSteps currentStep={step} steps={steps} />
      </div>

      <div className="max-w-4xl mx-auto mt-10">
        {step === 1 && (
          <DeliveryMethodStep
            selectedMethod={deliveryMethod}
            onMethodSelect={setDeliveryMethod}
            onNext={handleNext}
            onBack={() => router.push("/user/cart")}
          />
        )}

        {step === 2 && (
          <DeliveryDetailsStep
            deliveryMethod={deliveryMethod}
            selectedAddress={selectedAddress}
            onAddressSelect={setSelectedAddress}
            addresses={addresses}
            onAddressesUpdate={setAddresses}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <PaymentMethodStep
            selectedMethod={paymentMethod}
            onMethodSelect={setPaymentMethod}
            deliveryMethod={deliveryMethod}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <ReviewStep
            order={order}
            deliveryMethod={deliveryMethod}
            paymentMethod={paymentMethod}
            shippingAddress={selectedAddress}
            onConfirm={handleConfirmOrder}
            onBack={handleBack}
            processing={processing}
          />
        )}
      </div>

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onConfirm={handleTransferConfirm}
        isLoading={processing}
        totalAmount={order?.total || 0}
      />
    </Container>
  );
};

export default CheckoutPageClient;
