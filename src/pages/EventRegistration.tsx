// src/pages/EventRegistration.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { featuredProducts } from "@/data/products";

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

      // 1) Save registration in contestdb
      await axios.post("http://localhost:5000/api/events/register", {
        eventId: eventProduct.id,
        eventName: eventProduct.name,
        name: fullName,
        email,
        password,
      });

      // 2) Send thank‑you email
      await axios.post("http://localhost:5000/api/events/send-confirmation", {
        name: fullName,
        email,
        eventName: eventProduct.name,
      });

      // 3) Navigate to thank‑you page
      navigate(`/events/thank-you/${eventProduct.id}`);
    } catch (err) {
      console.error("Event registration/payment flow error", err);
      alert("Something went wrong. Please try again.");
    } finally {
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
            Create your account to continue to payment.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                        "http://localhost:5000/api/events/send-otp",
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
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistration;
