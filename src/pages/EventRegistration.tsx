// src/pages/EventRegistration.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { featuredProducts } from "@/data/products";

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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

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

    if (!otpVerified) {
      alert("Please verify OTP before proceeding.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
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
      const keyRes = await axios.get(
        "http://localhost:5000/api/payment/get-key"
      );
      const razorpayKey = keyRes.data.key;

      // 3) Create order: amount in paise (₹1 -> 100)
      const amountInPaise = Math.round(eventProduct.price * 100);
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: amountInPaise }
      );

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
          name: fullName,
          email: email,
        },
        theme: {
          color: "#3b82f6",
        },
        handler: async (response: any) => {
          try {
            // 5) Verify payment on backend
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (!verifyRes.data.success) {
              alert("Payment verification failed. Please contact support.");
              setLoading(false);
              return;
            }

            // 6) NOW save registration in contest DB (only after successful payment)
            await axios.post("http://localhost:5000/api/events/register", {
              eventId: eventProduct.id,
              eventName: eventProduct.name,
              name: fullName,
              email,
              password,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });

            // 7) Send confirmation email
            await axios.post(
              "http://localhost:5000/api/events/send-confirmation",
              {
                name: fullName,
                email,
                eventName: eventProduct.name,
              }
            );

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
            Create your account and pay ₹{eventProduct.price} to confirm your spot.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email + Send OTP */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOtpVerified(false);
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    if (!email) {
                      alert("Enter email first");
                      return;
                    }
                    try {
                      setLoading(true);
                      await axios.post(
                        "https://egroots-innovate-shop-production.up.railway.app/api/events/send-otp",
                        { email }
                      );
                      setOtpSent(true);
                      alert("OTP sent to your email");
                    } catch (err) {
                      console.error(err);
                      alert("Failed to send OTP");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* OTP input + verify */}
            {otpSent && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Enter OTP (sent to your email)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const res = await axios.post(
                          "http://localhost:5000/api/events/verify-otp",
                          { email, otp }
                        );
                        if (res.data.success) {
                          setOtpVerified(true);
                          alert("OTP verified successfully");
                        }
                      } catch (err: any) {
                        console.error(err);
                        alert(
                          err.response?.data?.error ||
                            "Failed to verify OTP"
                        );
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Verify OTP
                  </Button>
                </div>
                {otpVerified && (
                  <p className="text-xs text-green-600">OTP verified ✔</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${eventProduct.price} & Register`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistration;
