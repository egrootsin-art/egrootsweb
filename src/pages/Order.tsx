import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, User, Phone, MapPin, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Order = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
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

  // ✅ VALIDATION FUNCTIONS
  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    if (!/^[6-9]/.test(cleanPhone)) {
      return "Phone number must start with 6, 7, 8, or 9";
    }
    return "";
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) {
      return "Delivery address is required";
    }
    if (address.trim().length < 10) {
      return "Please provide a complete address (minimum 10 characters)";
    }
    return "";
  };

  // ✅ HANDLE INPUT CHANGE WITH VALIDATION
  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Real-time phone validation (format display)
    if (field === "phone") {
      // Allow only digits
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 10) {
        setCustomerInfo((prev) => ({ ...prev, phone: cleaned }));
      }
    }
  };

  // ✅ VALIDATE ALL FIELDS
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

  // ✅ PLACE ORDER HANDLER - WITH VALIDATION
  const handlePlaceOrder = async () => {
    // Validate all fields
    if (!validateAllFields()) {
      toast({
        title: "Validation Error ❌",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Map items to ensure ALL fields including image are included
      const orderPayload = {
        customer: customerInfo,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || "Uncategorized",
          image: item.image || "/placeholder.svg",
        })),
        totalAmount: total,
        paymentMethod: "Pending",
      };

      console.log("📦 Sending order payload:", orderPayload);

      // Save to MongoDB
      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderPayload
      );

      const orderId = res.data.orderId;

      // Send confirmation email
      await axios.post("http://localhost:5000/api/send-order-email", {
        customerInfo,
        items: orderPayload.items,
        total,
        paymentMethod: "Pending",
      });

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order #${orderId.slice(-6)} has been confirmed`,
      });

      clearCart();
      refreshOrders();
      navigate("/my-orders");
    } catch (error) {
      console.error("❌ Order error:", error);
      toast({
        title: "Order Failed",
        description: "Unable to save order. Please try again.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto text-center py-20">
          <h2 className="text-3xl font-bold">Your cart is empty</h2>
          <Link to="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/cart">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CUSTOMER INFO CARD */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                All fields are required
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ✅ NAME INPUT WITH VALIDATION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Enter your full name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${
                      errors.name ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    ⚠️ {errors.name}
                  </p>
                )}
              </div>

              {/* ✅ EMAIL - READ ONLY */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email Address <span className="text-gray-400">(from your account)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={customerInfo.email}
                    disabled
                    className="pl-10 bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                </div>
                
              </div>

              {/* ✅ PHONE INPUT WITH VALIDATION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    maxLength={10}
                    className={`pl-10 ${
                      errors.phone ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    ⚠️ {errors.phone}
                  </p>
                )}
                {customerInfo.phone && !errors.phone && customerInfo.phone.length === 10 && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    ✓ Valid phone number
                  </p>
                )}
              </div>

              {/* ✅ ADDRESS INPUT WITH VALIDATION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Enter complete delivery address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`pl-10 ${
                      errors.address ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    ⚠️ {errors.address}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Include street, area, city, and pin code
                </p>
              </div>

              {/* ✅ REQUIRED FIELDS NOTE */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> All fields marked with{" "}
                  <span className="text-red-500">*</span> are mandatory. Please
                  ensure your phone number is correct for order updates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ORDER SUMMARY CARD */}
          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
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
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
