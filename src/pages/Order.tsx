import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Order = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
const { refreshOrders } = useOrder();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  // NEW UPDATED ORDER HANDLER — NO PAYMENT REQUIRED
 const handlePlaceOrder = async () => {
  if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
    return toast({
      title: "Missing Information",
      description: "Fill required customer details.",
      variant: "destructive",
    });
  }

  setIsProcessing(true);

  try {
    // Save to MongoDB ✨
    const res = await axios.post("http://localhost:5000/api/orders/create", {
      customer: customerInfo,
      items,
      totalAmount: total,
    });

    const orderId = res.data.orderId;

    // Send confirmation email
    await axios.post("http://localhost:5000/api/send-order-email", {
      customerInfo,
      items,
      total,
      paymentMethod: "Pending",
    });

    toast({
      title: "Order Saved 🛒",
      description: `Order #${orderId} saved to database`,
    });

    clearCart();
    navigate("/my-orders");

  } catch (error) {
    console.error("Order error:", error);
    toast({
      title: "Order Failed",
      description: "Unable to save order",
      variant: "destructive",
    });
  }

  setIsProcessing(false);
};


  // OLD RAZORPAY PAYMENT CODE — SAFE IN COMMENTS FOR FUTURE USE
  /*
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return toast({
        title: "Missing Information",
        description: "Fill required customer details.",
        variant: "destructive",
      });
    }

    setIsProcessing(true);

    try {
      await loadRazorpayScript();

      const orderResponse = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100 }),
      });

      const orderData = await orderResponse.json();

      const options = {
        key: "rzp_live_akdDITNUFAB4hA",
        amount: orderData.amount,
        currency: "INR",
        name: "Egroots Innovate Shop",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async (response: any) => {
          try {
            await axios.post("http://localhost:5000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const orderId = createOrder({
              items,
              total,
              paymentMethod: "Razorpay",
              paymentStatus: "completed",
              customerInfo,
            });

            await axios.post("http://localhost:5000/api/send-order-email", {
              customerInfo,
              items,
              total,
              paymentMethod: "Razorpay",
            });

            toast({
              title: "Order Successful 🎉",
              description: `Order #${orderId.split("-")[1]} confirmed`,
            });

            clearCart();
            navigate("/my-orders");

          } catch (err) {
            console.error(err);
            toast({
              title: "Verification Failed",
              description: "Payment could not be verified",
              variant: "destructive",
            });
          }
        },

        method: { upi: true, netbanking: false, card: false, wallet: false },
        prefill: customerInfo,
        theme: { color: "#00b894" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "Try again",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };
  */

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
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Full Name *" value={customerInfo.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              <Input type="email" placeholder="Email *" value={customerInfo.email} onChange={(e) => handleInputChange("email", e.target.value)} />
              <Input placeholder="Phone Number *" value={customerInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              <Input placeholder="Address (optional)" value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} />
            </CardContent>
          </Card>

          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded-md" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full">
                {isProcessing ? "Processing..." : "Pay with Razorpay"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Only Razorpay UPI payments available.
              </p>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
