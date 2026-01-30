import { Button } from "@/components/ui/button";
// import heroImage from "@/assets/hero-banner.jpg";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#15315B] via-[#26A044] to-[#15315B] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 left-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-40 left-1/3 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-foreground">Empowering</span>
              <span className="block bg-gradient-white bg-clip-text ">
                Future Innovators
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Discover cutting-edge electronics, 3D printing kits, and robotics designed 
              for young tech enthusiasts and students ready to shape tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="tech-hover group bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 text-lg">
                <Link to="/products">
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="tech-hover border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white px-8 py-4 text-lg"
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;