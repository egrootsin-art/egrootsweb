import { useEffect, useState } from "react";
import axios from "axios";
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

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`http://localhost:5000/api/orders/user/${user.email}`)
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.error("Order fetch error:", err));
  }, [user]);

  const cancelOrder = (id: string) => {
    axios
      .put(`http://localhost:5000/api/orders/update-status/${id}`, {
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
        return "text-accent";
      case "pending":
        return "text-tech-orange";
      case "failed":
        return "text-destructive";
      case "cancelled":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">No Orders Yet</h2>
          <p className="text-lg text-muted-foreground mb-8">
            You haven't placed any orders yet.
          </p>
          <Link to="/products">
            <Button className="bg-primary text-primary-foreground">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order._id} className="gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <span>Order #{order._id.slice(-6)}</span>
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusBadgeVariant(order.status)}
                      className={getStatusColor(order.status)}
                    >
                      {order.status.toUpperCase()}
                    </Badge>

                    {/* ✅ ONLY SHOW CANCEL BUTTON FOR PENDING ORDERS */}
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
                              className="bg-orange-600 text-white"
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

                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {order.paymentMethod}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-4">
                  {order.items?.length > 0 ? (
                    order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <p className="text-sm mt-1">
                            Qty: {item.quantity} — ₹{item.price}
                          </p>
                        </div>
                        <p className="font-bold text-right">
                          ₹{item.quantity * item.price}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No items in this order.</p>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <span className="text-muted-foreground text-sm">
                    {order.items?.length || 0} items
                  </span>
                  <span className="text-xl font-bold">₹{order.totalAmount}</span>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-muted/20 border">
                  <h5 className="font-medium mb-2">Delivery Information</h5>
                  <p className="text-sm">
                    <strong>Name:</strong> {order.customer.name}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {order.customer.email}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {order.customer.phone}
                  </p>
                  <p className="text-sm">
                    <strong>Address:</strong> {order.customer.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
