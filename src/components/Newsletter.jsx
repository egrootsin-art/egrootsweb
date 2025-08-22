import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest updates and exclusive offers.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with E-Groots
          </h2>
          
          {/* Description */}
          <p className="text-xl text-white/90 mb-8">
            Get the latest tech updates, exclusive discounts, and early access to new products. 
            Join 10,000+ innovators who trust E-Groots!
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              variant="secondary"
              disabled={isLoading}
              className="bg-white text-primary hover:bg-white/90 min-w-[120px]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              No Spam
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              Unsubscribe Anytime
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              Weekly Updates
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;