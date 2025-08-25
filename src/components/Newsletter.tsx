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

  return (
    <section className="py-16 gradient-card">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay Ahead of Innovation
            </h2>
            <p className="text-lg text-muted-foreground">
              Get exclusive updates on new products, tech tutorials, and special discounts 
              for young innovators and students.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background/50 border-border"
              required
            />
            <Button 
              type="submit" 
              className="tech-hover bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Join 10,000+ tech enthusiasts. No spam, unsubscribe anytime.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">🚀</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Early Access</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to know about new products and innovations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-accent text-xl">💡</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Free guides and tutorials for your tech projects
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-secondary text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Student Discounts</h3>
              <p className="text-sm text-muted-foreground">
                Exclusive deals and discounts for students and educators
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;