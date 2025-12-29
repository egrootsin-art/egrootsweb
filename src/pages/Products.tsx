import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { featuredProducts, categories } from "@/data/products";
import { Search, Filter, Grid, List } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  // ✅ Handle URL parameters for search and category
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // ✅ Set category from URL parameter
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // ✅ Handle category change and update URL
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL parameter
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (category === "all") {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", category);
    }
    
    setSearchParams(newSearchParams);
  };

  // Filter products based on search and category
  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F1FFF7]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-[#222523]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Our <span className="text-green-600 px-2 py-1 rounded-md font-bold block sm:inline">Products</span>
          </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover innovative electronics, robotics kits, and educational tools designed to empower the next generation of innovators.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => handleCategoryChange("all")}
              className="tech-hover"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.name)}
                className="tech-hover"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.productCount}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ✅ Results Info with Active Filter Badge */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {sortedProducts.length} of {featuredProducts.length} products
              </p>
              {selectedCategory !== "all" && (
                <Badge variant="default" className="bg-primary">
                  {selectedCategory}
                </Badge>
              )}
            </div>
            {(selectedCategory !== "all" || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                  setSearchParams({});
                }}
                className="text-primary hover:text-primary/80"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                handleCategoryChange("all");
              }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {sortedProducts.map((product, index) => (
                <div key={product.id} className="animate-slide-up h-full" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-card border-t border-border/50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EG</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">E-Groots</h3>
                  <p className="text-xs text-muted-foreground">Empowering Future Innovators</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for electronics, 3D printing, and robotics education.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button 
                      onClick={() => handleCategoryChange(category.name)}
                      className="hover:text-primary transition-colors text-left"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li>
                  <a 
                    href="https://www.youtube.com/@E-GROOTS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/egroots.in?igsh=MXJla2V2NXA2NHRuZA%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Community Forum
                  </a>
                </li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 E-Groots. All rights reserved. Built for the next generation of innovators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products;
