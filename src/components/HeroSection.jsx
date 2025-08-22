import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Cpu, Bot } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="E-Groots Electronics" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Empowering Future Innovators</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                E-Groots
              </span>
              <br />
              <span className="text-foreground">
                Electronics Store
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover cutting-edge electronics, 3D printing kits, educational robotics, and professional PCB design services. 
              Built for students, makers, and tech enthusiasts who dare to innovate.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/products?category=educational-kits">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                  Educational Kits
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Latest Tech</h3>
                  <p className="text-sm text-muted-foreground">Cutting-edge components</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Robotics</h3>
                  <p className="text-sm text-muted-foreground">Competition ready</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Quick & reliable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - could add animation or additional graphics here */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Floating elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-20 right-5 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full opacity-30 animate-pulse delay-300"></div>
              <div className="absolute top-1/2 right-20 w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl opacity-25 animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;