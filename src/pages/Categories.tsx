import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { categories, featuredProducts } from "@/data/products";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = featuredProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Our <span className="text-primary">Tech Categories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover innovative technology products across various categories designed for students, educators, and tech enthusiasts.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card 
            className={`group tech-hover gradient-card border-border/50 overflow-hidden cursor-pointer ${
              selectedCategory === "all" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">All Products</h3>
              <Badge variant="outline" className="text-xs">
                {featuredProducts.length} items
              </Badge>
            </CardContent>
          </Card>

          {categories.map((category) => (
            <Card 
              key={category.name}
              className={`group tech-hover gradient-card border-border/50 overflow-hidden cursor-pointer ${
                selectedCategory === category.name ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {category.productCount}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory === "all" ? "All Products" : selectedCategory}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} products found
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse different categories.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="gradient-card border-border/50 text-center p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-muted-foreground mb-6">
            Contact our team for custom solutions and product recommendations tailored to your project needs.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/contact">
              Contact Us <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Categories;