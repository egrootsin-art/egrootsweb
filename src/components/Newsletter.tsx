import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription
    setTimeout(() => {
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about new products and tech innovations.",
      });
      setEmail("");
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 gradient-card">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome to the Future!
              </h2>
              <p className="text-muted-foreground">
                Thanks for subscribing! Get ready for exciting updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  
};

export default Newsletter;