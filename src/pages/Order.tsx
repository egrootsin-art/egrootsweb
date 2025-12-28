import axios from "@/api/axiosConfig";
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  MapPin,
  Loader2,
  ShoppingCart,
} from "lucide-react";

// ✅ RAZORPAY ENABLED
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Order = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, total: cartSubtotal, clearCart, isReady } = useCart();
  const { refreshOrders } = useOrder();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Wait for cart to hydrate
  if (!isReady) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto text-center py-20">
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ✅ GET GRAND TOTAL FROM CART (includes shipping)
  const urlTotal = parseFloat(searchParams.get("total") || "0");
  const grandTotal = urlTotal > 0 ? urlTotal : cartSubtotal;

  // ✅ SHIPPING CALCULATION (same as Cart)
  const calculateShipping = () => {
    if (items.length === 0) return 0;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return itemCount >= 3 ? 0 : 200;
  };

  const shippingCost = calculateShipping();
  const subtotal = grandTotal - shippingCost;

  // AUTO-FILL EMAIL FROM LOGGED-IN USER
  useEffect(() => {
    if (user?.email) {
      setCustomerInfo((prev) => ({
        ...prev,
        email: user.email,
        name: user.name || "",
      }));
    }
  }, [user]);

  // ✅ LOAD RAZORPAY SCRIPT
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existing) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // VALIDATION FUNCTIONS
  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return "Phone number is required";
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return "Phone number must be exactly 10 digits";
    if (!/^[6-9]/.test(cleanPhone)) return "Phone number must start with 6, 7, 8, or 9";
    return "";
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) return "Delivery address is required";
    if (address.trim().length < 10)
      return "Please provide a complete address (minimum 10 characters)";
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (field === "phone") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 10) {
        setCustomerInfo((prev) => ({ ...prev, phone: cleaned }));
      }
    }
  };

  const validateAllFields = () => {
    const nameError = validateName(customerInfo.name);
    const phoneError = validatePhone(customerInfo.phone);
    const addressError = validateAddress(customerInfo.address);

    setErrors({
      name: nameError,
      phone: phoneError,
      address: addressError,
    });

    return !nameError && !phoneError && !addressError;
  };

  // ✅ PLACE ORDER WITH RAZORPAY (Updated amount)
  const handlePlaceOrder = async () => {
    console.log("🚀 Starting payment + order process...");

    if (!validateAllFields()) {
      console.log("❌ Validation failed");
      toast({
        title: "Validation Error ❌",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Validation passed");
    setIsProcessing(true);

    try {
      // 1) Load Razorpay SDK
      console.log("📦 Loading Razorpay script...");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast({
          title: "Payment Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // 2) Get Razorpay key
      console.log("🔑 Fetching Razorpay key from backend...");
      const keyResponse = await axios.get("/api/payment/get-key");
      const razorpayKey = keyResponse.data.key;
      console.log("✅ Razorpay Key received:", razorpayKey);

      // 3) Create Razorpay order (GRAND TOTAL in paise)
      console.log("💰 Creating Razorpay order for ₹", grandTotal);
      const orderResponse = await axios.post("/api/payment/create-order", {
        amount: Math.round(grandTotal * 100),
      });
      console.log("✅ Razorpay order created:", orderResponse.data);

      const { id: razorpay_order_id, amount, currency } = orderResponse.data;

      // 4) Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: "E-Groots",
        description: "Order Payment",
        order_id: razorpay_order_id,
        handler: async (response: any) => {
          console.log("✅ Payment successful! Response:", response);

          try {
            // 5) Verify payment on backend
            console.log("🔐 Verifying payment signature...");
            const verifyResponse = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log("✅ Payment verified:", verifyResponse.data);

            // 6) Save order in MongoDB
            console.log("💾 Saving order to database...");
            
            // Validate items and ensure prices are correct
            const validatedItems = items.map((item) => {
              const price = typeof item.price === 'number' && item.price > 0 
                ? item.price 
                : (parseFloat(item.price) || 0);
              
              if (price <= 0) {
                console.error(`❌ Invalid price for item ${item.name}: ${item.price}`);
              }
              
              console.log(`📦 Item: ${item.name}, Price: ₹${price}, Qty: ${item.quantity}`);
              
              return {
                id: item.id,
                name: item.name,
                price: price,
                quantity: item.quantity,
                category: item.category || "Uncategorized",
                image: item.image || "/placeholder.svg",
              };
            });
            
            const orderPayload = {
              customer: customerInfo,
              items: validatedItems,
              subtotal: subtotal,
              shipping: shippingCost,
              totalAmount: grandTotal,
              paymentMethod: "Razorpay",
              paymentStatus: "Completed",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            };

            console.log("📦 Order payload:", orderPayload);
            console.log("💰 Item prices:", validatedItems.map(i => `${i.name}: ₹${i.price}`));

            const res = await axios.post("/api/orders/create", orderPayload);

            const orderId = res.data.orderId;
            console.log("✅ Order saved! Order ID:", orderId);

            // 7) Send confirmation email
            console.log("📧 Sending confirmation email...");
            await axios.post("/api/send-order-email", {
              customerInfo,
              items: orderPayload.items,
              subtotal,
              shipping: shippingCost,
              total: grandTotal,
              paymentMethod: "Razorpay",
            });

            console.log("✅ Email sent successfully");

            toast({
              title: "Payment Successful! 🎉",
              description: `Order #${orderId.slice(-6)} has been confirmed`,
            });

            clearCart();
            refreshOrders();
            navigate("/my-orders");
          } catch (err: any) {
            console.error("❌ Error saving order:", err);
            console.error("❌ Error response:", err.response?.data);
            toast({
              title: "Order Failed",
              description:
                err.response?.data?.message ||
                "Payment verified but order could not be saved.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: () => {
            console.log("⚠️ Payment modal closed by user");
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            });
            setIsProcessing(false);
          },
        },
      };

      console.log("🎨 Opening Razorpay payment modal...");
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("❌ Payment error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });

      toast({
        title: "Payment Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <Link to="/products">
            <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back + title row */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CUSTOMER INFO CARD */}
          <Card className="border border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-white-900">
                Customer Information
              </CardTitle>
              <p className="text-sm text-white-600">
                All fields are required
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white-800">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-white-400" />
                  <Input
                    placeholder="Enter your full name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">⚠️ {errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-white-400" />
                  <Input
                    type="email"
                    value={customerInfo.email}
                    disabled
                    className="pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white-800">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-white-400" />
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    maxLength={10}
                    className={`pl-10 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">⚠️ {errors.phone}</p>
                )}
                {customerInfo.phone.length === 10 && !errors.phone && (
                  <p className="text-xs text-green-600">✓ Valid phone number</p>
                )}
              </div>

              {/* ADDRESS */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white-800">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-white-400" />
                  <Input
                    placeholder="Enter complete delivery address"
                    value={customerInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`pl-10 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500">⚠️ {errors.address}</p>
                )}
                <p className="text-xs text-gray-500">
                  Include street, area, city, and pin code
                </p>
              </div>

              {/* NOTE */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> All fields marked with{" "}
                  <span className="text-red-500">*</span> are mandatory. Please
                  ensure your phone number is correct for order updates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ORDER SUMMARY WITH SHIPPING */}
          <Card className="border border-emerald-100 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-white-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-white-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-white-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* ✅ BREAKDOWN WITH SHIPPING */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white-900">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white-900">
                  <span>Shipping</span>
                  <span
                    className={
                      shippingCost === 0 ? "text-green-600 font-medium" : ""
                    }
                  >
                    {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-xl text-white-900">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pay ₹{grandTotal.toFixed(2)} & Place Order
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Secure payment via Razorpay. Cash on Delivery available soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
