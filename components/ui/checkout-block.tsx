"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Truck,
  Shield,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ShoppingBag,
  Check,
  ChevronLeft,
  Percent,
  X,
  Wallet,
  Smartphone,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { products } from "@/lib/products";
import { useCart } from "@/components/shop/cart-context";

type CheckoutPaymentMethod = "paypal" | "bolivares" | "binance_pay" | "zinli";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
}

export default function Checkout() {
  const router = useRouter();
  const { items: cartItems, subtotal, clear } = useCart();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPay = cartItems.length > 0 && subtotal > 0;
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
  });

  const [selectedPaymentType, setSelectedPaymentType] =
    useState<CheckoutPaymentMethod>("paypal");
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
  const [savePaymentMethod, setSavePaymentMethod] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<string>("SAVE10");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(true);

  const shippingMethods = [
    { id: "mrw", name: "MRW" },
    { id: "zoom", name: "Zoom" },
  ];

  const [selectedShipping, setSelectedShipping] = useState("mrw");

  useEffect(() => {
    setIsLoading(true);

    const hydratedFromCart: OrderItem[] = cartItems.map((it) => ({
      id: it.slug,
      name: it.title,
      price: it.price,
      image: it.image,
      quantity: it.quantity,
    }));

    // Si el carrito está vacío, mostramos las piezas “reales” como fallback visual.
    setOrderItems(
      hydratedFromCart.length
        ? hydratedFromCart
        : products.map((p) => ({
            id: p.slug,
            name: p.title,
            price: p.price,
            image: p.image,
            quantity: 1,
          }))
    );

    setIsLoading(false);
  }, [cartItems]);

  async function readApiError(res: Response): Promise<string> {
    const text = await res.text();
    try {
      const j = JSON.parse(text) as { error?: string };
      if (typeof j.error === "string" && j.error.trim()) return j.error.trim();
    } catch {
      /* ignore */
    }
    if (text.trim()) return text.trim().slice(0, 500);
    return `Error del servidor (${res.status}).`;
  }

  const createOrder = async () => {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        payment_method: selectedPaymentType,
        items: cartItems.map((it) => ({
          slug: it.slug,
          quantity: it.quantity,
        })),
      }),
    });
    if (!res.ok) throw new Error(await readApiError(res));
    return (await res.json()) as { orderId: string };
  };

  const startPayPal = async (createdOrderId: string) => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId: createdOrderId }),
    });
    if (!res.ok) throw new Error(await readApiError(res));
    const data = (await res.json()) as { approvalUrl: string };

    // Redirección hacia PayPal (solo en cliente).
    if (typeof window !== "undefined") {
      window.location.href = data.approvalUrl;
    }
  };

  const uploadProof = async () => {
    if (!orderId) throw new Error("Missing orderId");
    if (!proofFile) throw new Error("Missing file");

    const fd = new FormData();
    fd.append("orderId", orderId);
    fd.append("method", selectedPaymentType);
    fd.append("reference", reference);
    fd.append("file", proofFile);

    const res = await fetch("/api/orders/upload-proof", { method: "POST", body: fd });
    if (!res.ok) throw new Error(await readApiError(res));
    clear();
    setMessage("Recibimos tu comprobante. Validación en breve.");
  };

  const onConfirmOrder = async () => {
    setIsSubmitting(true);
    setMessage(null);
    setOrderId(null);
    try {
      const { orderId: createdOrderId } = await createOrder();
      setOrderId(createdOrderId);

      if (selectedPaymentType === "paypal") {
        await startPayPal(createdOrderId);
        return;
      }

      setMessage("Orden creada. Sigue las instrucciones y sube tu comprobante.");
    } catch (e) {
      setMessage(String((e as Error).message || e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSummary = (): CheckoutSummary => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = 0;
    const shipping = 0;
    const tax = 0;
    const total = subtotal;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
    };
  };

  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentChange = (
    field: keyof PaymentMethod,
    value: string
  ) => {
    setPaymentMethod((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return canPay;
      case 2:
        return canPay && !!selectedPaymentType;
      case 3:
        return agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const removePromo = () => {
    setAppliedPromo("");
  };

  const summary = calculateSummary();

  const CheckoutSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const OrderSummaryCard = () => (
    <Card className="flex flex-col gap-5">
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Resumen del pedido
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <Badge
                  className="absolute -top-1 -right-1 text-xs min-w-5 h-5 flex items-center justify-center"
                >
                  {item.quantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    ${item.price}
                  </span>
                </div>
              </div>
              <div className="text-sm font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {appliedPromo && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-ele border border-green-200">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {appliedPromo}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removePromo}
              className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>
          {summary.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${summary.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>${summary.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>${summary.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-32" />
        </div>
        <CheckoutSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 flex flex-col gap-6 animate-in fade-in-0 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4 flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1"
          >
            ← Volver al shop
          </Button>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black uppercase flex items-center gap-2">
              CHECKOUT
            </h1>
            <p className="text-muted-foreground text-sm">
              Completa tu compra de forma segura
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="flex items-center gap-1 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.18)]"
        >
          <Shield className="h-3 w-3" />
          Pago seguro 🔒
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-start gap-4 sm:gap-6 py-4">
        {[
          { step: 1, label: "Datos de envío", icon: Truck },
          { step: 2, label: "Método de pago", icon: CreditCard },
          { step: 3, label: "Confirmar pedido", icon: Check },
        ].map(({ step, label, icon: Icon }, index) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                  currentStep >= step
                    ? "bg-stone-100 border-stone-100 text-stone-950 shadow-[0_0_18px_rgba(255,255,255,0.28)]"
                    : "border-border text-muted-foreground"
                )}
              >
                {currentStep > step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  currentStep >= step
                    ? "text-stone-950"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < 2 && (
              <div
                className={cn(
                  "w-8 h-0.5 transition-all duration-300",
                  currentStep > step ? "bg-stone-100" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Step 1: Datos de envío */}
          {currentStep === 1 && (
            <Card className="flex flex-col gap-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Datos de envío
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      size="lg"
                      placeholder="Carlos"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        handleAddressChange("firstName", e.target.value)
                      }
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      size="lg"
                      placeholder="Kuffaty"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        handleAddressChange("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      size="lg"
                      type="email"
                      placeholder="john@example.com"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        handleAddressChange("email", e.target.value)
                      }
                      leftIcon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      size="lg"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      leftIcon={<Phone className="h-4 w-4" />}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    size="lg"
                    placeholder="Av. Principal, Caracas"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      size="lg"
                      placeholder="Caracas"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Select
                      value={shippingAddress.state}
                      onValueChange={(value) =>
                        handleAddressChange("state", value)
                      }
                    >
                      <SelectTrigger className="text-sm" size={"lg"}>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DT">Distrito Capital</SelectItem>
                        <SelectItem value="MI">Miranda</SelectItem>
                        <SelectItem value="AR">Aragua</SelectItem>
                        <SelectItem value="CA">Carabobo</SelectItem>
                        <SelectItem value="LA">Lara</SelectItem>
                        <SelectItem value="ZU">Zulia</SelectItem>
                        <SelectItem value="AN">Anzoátegui</SelectItem>
                        <SelectItem value="BO">Bolívar</SelectItem>
                        <SelectItem value="TA">Táchira</SelectItem>
                        <SelectItem value="ME">Mérida</SelectItem>
                        <SelectItem value="SU">Sucre</SelectItem>
                        <SelectItem value="MO">Monagas</SelectItem>
                        <SelectItem value="PO">Portuguesa</SelectItem>
                        <SelectItem value="TR">Trujillo</SelectItem>
                        <SelectItem value="BA">Barinas</SelectItem>
                        <SelectItem value="YA">Yaracuy</SelectItem>
                        <SelectItem value="CO">Cojedes</SelectItem>
                        <SelectItem value="GU">Guárico</SelectItem>
                        <SelectItem value="FA">Falcón</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="AP">Apure</SelectItem>
                        <SelectItem value="NV">Nueva Esparta</SelectItem>
                        <SelectItem value="VG">La Guaira</SelectItem>
                        <SelectItem value="DE">Dependencias Federales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t pt-4">
                  <Label>Métodos de envíos</Label>
                  <div className="flex flex-col gap-4">
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className={cn(
                        "p-3 border rounded-ele cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,255,255,0.10)]",
                          selectedShipping === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent"
                        )}
                        onClick={() => setSelectedShipping(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-2 transition-colors",
                                selectedShipping === method.id
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              )}
                            />
                            <div>
                              <div className="font-medium">{method.name}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(1)}
                  className="ml-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_22px_rgba(255,255,255,0.18)]"
                  size="lg"
                >
                  Continuar al pago
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Método de pago */}
          {currentStep === 2 && (
            <Card className="flex flex-col gap-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de pago
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Label className="text-base font-medium">
                    Elige tu método de pago
                  </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentType("paypal")}
                        className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-all duration-300 text-left hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,255,255,0.10)]",
                          selectedPaymentType === "paypal"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Wallet className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            PayPal (automático)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Redirección a PayPal
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentType("bolivares")}
                        className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-all duration-300 text-left hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,255,255,0.10)]",
                          selectedPaymentType === "bolivares"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Phone className="h-5 w-5 text-blue-700" />
                        <div>
                          <div className="font-medium">
                            Bolívares (manual)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pago móvil/transferencia
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentType("binance_pay")}
                        className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-all duration-300 text-left hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,255,255,0.10)]",
                          selectedPaymentType === "binance_pay"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Building2 className="h-5 w-5 text-blue-800" />
                        <div>
                          <div className="font-medium">
                            Binance Pay (manual)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pago con Binance Pay
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentType("zinli")}
                        className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-all duration-300 text-left hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,255,255,0.10)]",
                          selectedPaymentType === "zinli"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Smartphone className="h-5 w-5 text-gray-700" />
                        <div>
                          <div className="font-medium">Zinli (manual)</div>
                          <div className="text-xs text-muted-foreground">
                            Pago con Zinli
                          </div>
                        </div>
                      </button>
                    </div>
                </div>

                {false && (
                  <div className="flex flex-col gap-4 border-t pt-6">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nameOnCard">
                        Nombre en la tarjeta *
                      </Label>
                      <Input
                        id="nameOnCard"
                        size="lg"
                        placeholder="John Doe"
                        value={paymentMethod.nameOnCard}
                        onChange={(e) =>
                          handlePaymentChange("nameOnCard", e.target.value)
                        }
                        leftIcon={<User className="h-4 w-4" />}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        size="lg"
                        placeholder="1234 5678 9012 3456"
                        value={paymentMethod.cardNumber}
                        onChange={(e) =>
                          handlePaymentChange("cardNumber", e.target.value)
                        }
                        leftIcon={<CreditCard className="h-4 w-4" />}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="expiryMonth">Month *</Label>
                        <Select
                          value={paymentMethod.expiryMonth}
                          onValueChange={(value) =>
                            handlePaymentChange("expiryMonth", value)
                          }
                        >
                          <SelectTrigger className="text-sm" size={"lg"}>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="expiryYear">Year *</Label>
                        <Select
                          value={paymentMethod.expiryYear}
                          onValueChange={(value) =>
                            handlePaymentChange("expiryYear", value)
                          }
                        >
                          <SelectTrigger className="text-sm" size={"lg"}>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem
                                key={2024 + i}
                                value={String(2024 + i)}
                              >
                                {2024 + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          size="lg"
                          placeholder="123"
                          maxLength={4}
                          value={paymentMethod.cvv}
                          onChange={(e) =>
                            handlePaymentChange("cvv", e.target.value)
                          }
                          leftIcon={<Lock className="h-4 w-4" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentType === "paypal" && (
                  <div className="border-t pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-ele p-4">
                      <div className="flex items-start gap-3">
                        <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">
                            PayPal (automático)
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Te redirigiremos a PayPal para completar tu
                            pago de forma segura.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentType === "bolivares" && (
                  <div className="border-t pt-6">
                    <div className="bg-stone-50 border border-stone-200 rounded-ele p-4">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-blue-700 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-stone-900">
                            Bolívares (manual)
                          </h4>
                          <p className="text-sm text-stone-700 mt-1">
                            Realiza el pago por Pago Móvil/transferencia y
                            sube tu comprobante.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentType === "binance_pay" && (
                  <div className="border-t pt-6">
                    <div className="bg-stone-50 border border-stone-200 rounded-ele p-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-blue-800 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-stone-900">
                            Binance Pay (manual)
                          </h4>
                          <p className="text-sm text-stone-700 mt-1">
                            Realiza el pago por Binance Pay (o QR) y sube
                            el comprobante.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentType === "zinli" && (
                  <div className="border-t pt-6">
                    <div className="bg-stone-50 border border-stone-200 rounded-ele p-4">
                      <div className="flex items-start gap-3">
                        <Smartphone className="h-5 w-5 text-gray-700 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-stone-900">
                            Zinli (manual)
                          </h4>
                          <p className="text-sm text-stone-700 mt-1">
                            Realiza el pago por Zinli y sube el
                            comprobante.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {false && (
                  <div className="flex items-center gap-2 border-t pt-4">
                    <Checkbox
                      id="savePayment"
                      checked={savePaymentMethod}
                      onCheckedChange={(checked) =>
                        setSavePaymentMethod(checked === true)
                      }
                    />
                    <Label htmlFor="savePayment" className="text-sm">
                      Guardar método de pago
                    </Label>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={prevStep}
                  className="flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(2)}
                  className="transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_22px_rgba(255,255,255,0.18)]"
                  size="lg"
                >
                  Revisar pedido
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Confirmar pedido */}
          {currentStep === 3 && (
            <Card className="flex flex-col gap-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Confirmar pedido
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">Datos de envío</h3>
                  <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                    <p>
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    <p>{shippingAddress.address}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.state}{" "}
                      {shippingAddress.zipCode}
                    </p>
                    <p>{shippingAddress.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">Método de pago</h3>
                  <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                    {selectedPaymentType === "paypal" && (
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-600" />
                        <span>PayPal (automático)</span>
                      </div>
                    )}

                    {selectedPaymentType === "bolivares" && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-700" />
                        <span>Bolívares (manual)</span>
                      </div>
                    )}

                    {selectedPaymentType === "binance_pay" && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-800" />
                        <span>Binance Pay (manual)</span>
                      </div>
                    )}

                    {selectedPaymentType === "zinli" && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-700" />
                        <span>Zinli (manual)</span>
                      </div>
                    )}
                  </div>
                </div>

                {message && (
                  <p className="text-xs leading-5 text-amber-200/90">
                    {message}
                  </p>
                )}

                {selectedPaymentType !== "paypal" && orderId && (
                  <div className="flex flex-col gap-4 border-t pt-4">
                    <div className="rounded-2xl border border-stone-800 bg-stone-950/30 p-4">
                      <p className="text-xs font-semibold uppercase text-stone-400">
                        Instrucciones
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-300">
                        Tu orden es{" "}
                        <span className="font-black text-stone-100">
                          {orderId}
                        </span>
                        . Usa este ID como referencia.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-stone-500">
                        {selectedPaymentType === "bolivares" &&
                          "Paga por Pago Móvil/transferencia y sube el comprobante."}
                        {selectedPaymentType === "binance_pay" &&
                          "Realiza el pago por Binance Pay (o QR) y sube el comprobante."}
                        {selectedPaymentType === "zinli" &&
                          "Realiza el pago por Zinli y sube el comprobante."}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                          Referencia (opcional)
                        </label>
                        <input
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          className="w-full rounded-2xl border border-stone-800 bg-stone-950/30 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 outline-none"
                          placeholder="Ej: 000123 / teléfono / nota"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                          Comprobante (imagen)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setProofFile(e.target.files?.[0] ?? null)
                          }
                          className="block w-full text-xs text-stone-300 file:mr-3 file:rounded-full file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-stone-950"
                        />
                      </div>

                      <Button
                        type="button"
                        disabled={!proofFile || isSubmitting}
                        onClick={async () => {
                          setIsSubmitting(true);
                          try {
                            await uploadProof();
                          } catch (e) {
                            setMessage(
                              String((e as Error).message || e)
                            );
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
                      >
                        Enviar comprobante
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 border-t pt-4">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked === true)
                    }
                  />
                  <Label
                    htmlFor="agreeTerms"
                    className="text-sm leading-relaxed"
                  >
                    Acepto los términos y condiciones
                  </Label>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={prevStep}
                  className="flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Volver
                </Button>

                <button
                  type="button"
                  disabled={
                    !validateStep(3) ||
                    !canPay ||
                    isSubmitting ||
                    (selectedPaymentType !== "paypal" && !!orderId)
                  }
                  onClick={onConfirmOrder}
                  className="inline-flex items-center gap-2 rounded-full
                   bg-stone-100 px-8 py-4 text-sm font-bold 
                   uppercase text-stone-950 transition-all duration-300
                   hover:scale-[1.02] hover:bg-stone-200 hover:shadow-[0_0_26px_rgba(255,255,255,0.25)]
                   disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Lock className="h-4 w-4" />
                  Confirmar pedido — ${summary.total.toFixed(2)}
                </button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="flex flex-col gap-4">
          <OrderSummaryCard />

          <Card className="transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Seguro y encriptado</div>
                  <div className="text-muted-foreground">
                    Tus datos están protegidos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Link placeholders (no funcional) */}
      <div className="hidden">
        <Link href="/shop" />
      </div>
    </div>
  );
}

export { Checkout };

