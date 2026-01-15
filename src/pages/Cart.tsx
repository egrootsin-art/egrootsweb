import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, X, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total, isReady } =
    useCart();

  // Show loading while cart hydrates from localStorage
  if (!isReady) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Subtotal = total from context (sum of price * quantity)
  const subtotal = total;

  // Flat fee of 200 when there is at least one item
  const fee = items.length > 0 ? 200 : 0;

  // Grand total shown in checkout
  const grandTotal = subtotal + fee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start shopping to add some amazing tech products to your cart!
            </p>
            <Link to="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back + title row */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-white-500">{item.category}</p>
                      <p className="text-lg font-bold text-white-600">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-white-900 font-medium px-3">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border border-emerald-100 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-white-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-white-900">
                  <span>
                    Subtotal (
                    {items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    items)
                  </span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-white-900">
                  <span>Shipping Fee</span>
                  <span>₹{fee.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold text-white-900">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>

                <Link to={`/order?total=${grandTotal.toFixed(2)}`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mb-2">
                    Proceed to Checkout ₹{grandTotal.toFixed(2)}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>

                <Link to="/">
                  <Button variant="ghost" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
