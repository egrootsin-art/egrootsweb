import { useState } from "react";
import { ShoppingCart, Search, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);       // mobile menu
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false); // desktop icon menu
  const [searchTerm, setSearchTerm] = useState("");
  const { items } = useCart();
  const navigate = useNavigate();

  const categories = [
    { name: "Events", value: "Events" },
    { name: "PCB Design Services", value: "PCB Design Services" },
    { name: "Educational Kits", value: "Educational Kits" },
    { name: "Competition Robots", value: "Competition Robots" },
  ];

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (categoryValue: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryValue)}`);
    setIsMenuOpen(false);
    setIsDesktopMenuOpen(false);
  };

  const go = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsDesktopMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200/20">
      <div className=" mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logoImage}
                alt="E-Groots Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">E-Groots</h1>
              <p className="text-xs text-muted-foreground">
                Empowering Future Innovators
              </p>
            </div>
          </Link>

          {/* Right side: search (desktop), dashboard, cart, menus */}
          <div className="flex items-center space-x-2">
            {/* Desktop search */}
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white border border-gray-300 text-black placeholder-black"
                />
              </form>
            </div>

            {/* Desktop Dashboard button */}
            <Link to="/home" className="hidden md:inline-flex">
              <Button variant="outline" size="sm" className="tech-hover">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-black hover:text-blue-600 transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-neon">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Desktop icon menu (three lines, black) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
                className="p-2"
              >
                <Menu className="w-5 h-5 text-black" />
              </button>

              {isDesktopMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => go("/")}
                    className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => go("/products")}
                    className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => go("/about")}
                    className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                  >
                    About
                  </button>
                  <button
                    onClick={() => go("/contact")}
                    className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => go("/my-orders")}
                    className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-black" />
              ) : (
                <Menu className="w-5 h-5 text-black" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile full menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-muted/50 border-border"
              />
            </form>

           <div className="space-y-2">
  <button
    onClick={() => go("/")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    Home
  </button>

  <button
    onClick={() => go("/products")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    Products
  </button>

  <button
    onClick={() => go("/about")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    About
  </button>

  <button
    onClick={() => go("/contact")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    Contact
  </button>

  <button
    onClick={() => go("/my-orders")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    My Orders
  </button>

  <button
    onClick={() => go("/home")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    Dashboard
  </button>
</div>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
