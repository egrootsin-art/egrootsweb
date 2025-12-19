// src/pages/EventRegistration.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { featuredProducts } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";

// Allow window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const EventRegistration = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventProduct = featuredProducts.find((p) => p.id === id);
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Load Razorpay script
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
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  if (!eventProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center space-y-4">
            <h2 className="text-2xl font-bold">Event Not Found</h2>
            <Button onClick={() => navigate("/products")}>
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert("Please sign in with Google before registering for the event.");
      navigate("/login");
      return;
    }
    if (!name || !password) {
      alert("Please enter your name and password to proceed.");
      return;
    }

    try {
      setLoading(true);

      // 1) Load Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      // 2) Get key
      const keyRes = await axios.get("/api/payment/get-key");
      const razorpayKey = keyRes.data.key;

      // 3) Create order: amount in paise (₹1 -> 100)
      const amountInPaise = Math.round(eventProduct.price * 100);
      const orderRes = await axios.post("/api/payment/create-order", {
        amount: amountInPaise,
      });

      const { id: razorpay_order_id, amount, currency } = orderRes.data;

      // 4) Open Razorpay
      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: "E-Groots",
        description: `Registration for ${eventProduct.name}`,
        order_id: razorpay_order_id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3b82f6",
        },
        handler: async (response: any) => {
          try {
            // 5) Verify payment on backend
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              alert("Payment verification failed. Please contact support.");
              setLoading(false);
              return;
            }

            // 6) NOW save registration in contest DB (only after successful payment)
            await axios.post("/api/events/register", {
              name,
              password,
              eventId: eventProduct.id,
              eventName: eventProduct.name,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });

            // 7) Send confirmation email
            await axios.post("/api/events/send-confirmation", {
              name: user.name,
              email: user.email,
              eventName: eventProduct.name,
            });

            // 8) Go to thank‑you page
            navigate(`/events/thank-you/${eventProduct.id}`);
          } catch (err) {
            console.error("Event registration/payment flow error", err);
            alert(
              "Payment was captured but something went wrong after payment. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            alert("Payment cancelled.");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Event registration/payment flow error", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Register for {eventProduct.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pay ₹{eventProduct.price} to confirm your spot. Your Google account
            details will be used for registration.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Registered Email</label>
              <Input
                value={user?.email || ""}
                disabled
                placeholder="Sign in with Google to continue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password for event portal"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading || !isAuthenticated}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${eventProduct.price} & Register`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistration;
