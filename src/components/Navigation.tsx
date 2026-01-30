import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Menu, X, LayoutDashboard, LogOut, User, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);       // mobile menu
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false); // desktop icon menu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // profile menu
  const [searchTerm, setSearchTerm] = useState("");
  const { items } = useCart();
  const { logout, user } = useAuth();
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
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsDesktopMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Close menus when clicking outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setIsDesktopMenuOpen(false);
      }
    };

    if (isProfileMenuOpen || isDesktopMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen, isDesktopMenuOpen]);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200/20">
      <div className=" mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded overflow-hidden">
              <img
                src={logoImage}
                alt="E-Groots Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error("Failed to load logo image:", logoImage);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">E-Groots</h1>
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

            {/* Profile */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen((prev) => !prev);
                  setIsDesktopMenuOpen(false);
                }}
                className="p-2 relative"
              >
                {user ? (
                  <UserCircle className="w-5 h-5 text-black hover:text-blue-600 transition-colors" />
                ) : (
                  <User className="w-5 h-5 text-black hover:text-blue-600 transition-colors" />
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          go("/my-orders");
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          go("/home");
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          go("/login");
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          go("/signup");
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCircle className="w-4 h-4" />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Desktop icon menu (three lines, black) */}
            <div className="relative hidden md:block" ref={desktopMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDesktopMenuOpen((prev) => !prev);
                  setIsProfileMenuOpen(false);
                }}
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
                    onClick={() => go("/courses")}
                    className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                  >
                    Courses
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
                  {user && (
                    <button
                      onClick={() => go("/my-orders")}
                      className="block w-full text-left px-4 py-2  text-black hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
                setIsProfileMenuOpen(false);
              }}
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
    onClick={() => go("/courses")}
    className="block w-full text-left text-black hover:bg-gray-100 transition-colors py-2"
  >
    Courses
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

  {user && (
    <>
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

      <div className="border-t border-gray-200 my-2"></div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </>
  )}
</div>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
