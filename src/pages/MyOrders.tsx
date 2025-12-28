import { useEffect, useState } from "react";
import axios from "@/api/axiosConfig";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, CreditCard, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Component for individual order item with image error handling
const OrderItem = ({ item }: { item: any }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = item.image && !imageError 
    ? item.image 
    : "/placeholder.svg";

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
      <img
        src={imageSrc}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg bg-gray-200"
        onError={() => setImageError(true)}
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500">
          {item.category}
        </p>
        <p className="text-sm mt-1 text-gray-700">
          Qty: {item.quantity} — ₹{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}
        </p>
      </div>
      <p className="font-bold text-right text-gray-900">
        ₹{((typeof item.price === 'number' ? item.price : parseFloat(item.price || 0)) * (typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity || 1))).toFixed(2)}
      </p>
    </div>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`/api/orders/user/${user.email}`)
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.error("Order fetch error:", err));
  }, [user]);

  const cancelOrder = (id: string) => {
    axios
      .put(`/api/orders/update-status/${id}`, {
        status: "cancelled",
      })
      .then(() => {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
        );
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-600";
      case "pending":
        return "text-orange-500";
      case "failed":
        return "text-red-600";
      case "cancelled":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        {/* Hero bar to match other pages */}
        <section className="py-12 bg-[#202322]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-[#22c55e] mb-2">
              My Orders
            </h1>
            <p className="text-gray-300">
              Track all your purchases and their delivery status.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Orders Yet
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            You haven't placed any orders yet.
          </p>
          <Link to="/products">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Top hero same as other pages */}
      <section className="py-12 bg-[#202322]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#22c55e] mb-2">
            My Orders
          </h1>
          <p className="text-gray-300">
            View your recent purchases and manage order status.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card
              key={order._id}
              className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white-900">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <span>Order #{order._id.slice(-6)}</span>
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusBadgeVariant(order.status)}
                      className={getStatusColor(order.status)}
                    >
                      {order.status.toUpperCase()}
                    </Badge>

                    {order.status === "pending" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4 text-orange-600" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this order?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-orange-600 text-white hover:bg-orange-700"
                              onClick={() => cancelOrder(order._id)}
                            >
                              Yes, Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    {order.paymentMethod}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-4">
                  {order.items?.length > 0 ? (
                    order.items.map((item: any, index: number) => (
                      <OrderItem key={index} item={item} />
                    ))
                  ) : (
                    <p className="text-gray-500">No items in this order.</p>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">
                    {order.items?.length || 0} items
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <h5 className="font-medium mb-2 text-gray-900">
                    Delivery Information
                  </h5>
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {order.customer.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Email:</strong> {order.customer.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> {order.customer.phone}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Address:</strong> {order.customer.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" className="border-emerald-500 text-emerald-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
