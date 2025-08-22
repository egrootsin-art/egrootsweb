import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import Testimonials from '@/components/Testimonials';
import { featuredProducts, productCategories } from '@/data/products';
import { ArrowRight, Zap, Shield, Truck, Headphones } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover our most popular electronics and kits loved by innovators worldwide
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From beginner kits to professional tools, find everything you need for your next innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productCategories.map((category, index) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <div className="p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/50 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      index === 0 ? 'bg-gradient-to-br from-primary to-primary/80' :
                      index === 1 ? 'bg-gradient-to-br from-secondary to-secondary/80' :
                      index === 2 ? 'bg-gradient-to-br from-accent to-accent/80' :
                      'bg-gradient-to-br from-primary to-secondary'
                    }`}>
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose E-Groots?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to empowering the next generation of innovators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality Assured</h3>
              <p className="text-muted-foreground">All products tested and certified for educational and professional use</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick shipping across India with secure packaging</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Expert Support</h3>
              <p className="text-muted-foreground">Technical guidance and project assistance from our experts</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Innovation First</h3>
              <p className="text-muted-foreground">Cutting-edge technology for future innovators and makers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Index;
