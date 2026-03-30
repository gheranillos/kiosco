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
  Clock,
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

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
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
    useState<string>("card");
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
  const [savePaymentMethod, setSavePaymentMethod] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<string>("SAVE10");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const shippingMethods = [
    {
      id: "standard",
      name: "Envío estándar",
      price: 9.99,
      time: "5-7 business days",
    },
    {
      id: "express",
      name: "Envío express",
      price: 19.99,
      time: "2-3 business days",
    },
    {
      id: "overnight",
      name: "Envío urgente",
      price: 39.99,
      time: "Next business day",
    },
  ];

  const [selectedShipping, setSelectedShipping] = useState("standard");

  useEffect(() => {
    const loadCheckout = async () => {
      setIsLoading(true);

      // Simulación para que el Skeleton se vea en local.
      await new Promise((resolve) => setTimeout(resolve, 600));

      setOrderItems(
        products.map((p) => ({
          id: p.slug,
          name: p.title,
          price: p.price,
          image: p.image,
          quantity: 1,
        }))
      );
      setIsLoading(false);
    };

    loadCheckout();
  }, []);

  const calculateSummary = (): CheckoutSummary => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
    const shipping =
      selectedShipping === "standard"
        ? 9.99
        : selectedShipping === "express"
          ? 19.99
          : 39.99;
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + shipping + tax;

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
        return !!(
          shippingAddress.firstName &&
          shippingAddress.lastName &&
          shippingAddress.email &&
          shippingAddress.address &&
          shippingAddress.city &&
          shippingAddress.state &&
          shippingAddress.zipCode
        );
      case 2:
        if (selectedPaymentType === "card") {
          return !!(
            paymentMethod.cardNumber &&
            paymentMethod.expiryMonth &&
            paymentMethod.expiryYear &&
            paymentMethod.cvv &&
            paymentMethod.nameOnCard
          );
        }
        return !!selectedPaymentType;
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
    <div className="w-full mx-auto p-6 flex flex-col gap-6">
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
        <Badge variant="secondary" className="flex items-center gap-1">
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
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  currentStep >= step
                    ? "bg-stone-100 border-stone-100 text-stone-950"
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
                  "w-8 h-0.5",
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
            <Card className="flex flex-col gap-6">
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
                      placeholder="John"
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
                      placeholder="Doe"
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
                    <Label htmlFor="phone">Phone</Label>
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
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    size="lg"
                    placeholder="123 Main Street"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      size="lg"
                      placeholder="New York"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={shippingAddress.state}
                      onValueChange={(value) =>
                        handleAddressChange("state", value)
                      }
                    >
                      <SelectTrigger className="text-sm" size={"lg"}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="zipCode">Código postal *</Label>
                    <Input
                      id="zipCode"
                      size="lg"
                      placeholder="10001"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressChange("zipCode", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t pt-4">
                  <Label>Shipping Method</Label>
                  <div className="flex flex-col gap-4">
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className={cn(
                          "p-3 border rounded-ele cursor-pointer transition-colors",
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
                              <div className="text-sm text-muted-foreground">
                                {method.time}
                              </div>
                            </div>
                          </div>
                          <div className="font-semibold">
                            ${method.price}
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
                  className="ml-auto"
                  size="lg"
                >
                  Continuar al pago
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Método de pago */}
          {currentStep === 2 && (
            <Card className="flex flex-col gap-6">
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
                      onClick={() => setSelectedPaymentType("card")}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                        selectedPaymentType === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-xs text-muted-foreground">
                          Visa, Mastercard, Amex
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentType("paypal")}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                        selectedPaymentType === "paypal"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">PayPal</div>
                        <div className="text-xs text-muted-foreground">
                          Fast & secure
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentType("apple-pay")}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                        selectedPaymentType === "apple-pay"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Smartphone className="h-5 w-5 text-gray-800" />
                      <div>
                        <div className="font-medium">Apple Pay</div>
                        <div className="text-xs text-muted-foreground">
                          Touch ID or Face ID
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentType("google-pay")}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                        selectedPaymentType === "google-pay"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Google Pay</div>
                        <div className="text-xs text-muted-foreground">
                          One-tap checkout
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentType("bank-transfer")}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                        selectedPaymentType === "bank-transfer"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Building2 className="h-5 w-5 text-blue-800" />
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-xs text-muted-foreground">
                          Direct bank payment
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentType("bnpl")}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                        selectedPaymentType === "bnpl"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Clock className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Buy Now Pay Later</div>
                        <div className="text-xs text-muted-foreground">
                          Split into 4 payments
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {selectedPaymentType === "card" && (
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
                            PayPal Payment
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            You'll be redirected to PayPal to complete
                            your payment securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* (Otros métodos de pago quedan igual) */}

                {selectedPaymentType === "card" && (
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
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(2)}
                  size="lg"
                >
                  Revisar pedido
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Confirmar pedido */}
          {currentStep === 3 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Confirmar pedido
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">Shipping Address</h3>
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
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                    {selectedPaymentType === "card" && (
                      <>
                        <p>
                          **** **** ****{" "}
                          {paymentMethod.cardNumber.slice(-4)}
                        </p>
                        <p>{paymentMethod.nameOnCard}</p>
                      </>
                    )}
                    {selectedPaymentType === "paypal" && (
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-600" />
                        <span>PayPal</span>
                      </div>
                    )}
                  </div>
                </div>

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
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                <button
                  type="button"
                  disabled={!validateStep(3)}
                  className="inline-flex items-center gap-2 rounded-full 
                   bg-stone-100 px-8 py-4 text-sm font-bold 
                   uppercase text-stone-950 transition 
                   hover:scale-[1.02] hover:bg-stone-200"
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

          <Card>
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

