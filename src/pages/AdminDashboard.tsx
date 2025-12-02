import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  _id: string;   // 👈 CORRECT
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  status: string; 
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ------------------ FETCH ORDERS ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/orders", {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  // ------------------ TOGGLE STATUS ------------------
  const handleToggleStatus = async (orderId: string, currentStatus: string) => {

    let newStatus = currentStatus;

    // Flow: Pending → Processing → Completed
    if (currentStatus === "Pending") newStatus = "Processing";
    else if (currentStatus === "Processing") newStatus = "Completed";
    else newStatus = "Pending";

    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/update-status/${orderId}`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? res.data.order : order
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* -------- TOP BAR WITH LOGOUT -------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>

      {/* -------- MAIN CARD -------- */}
      <Card className="shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            📦 Order Management
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      
                      <TableCell>{order.customer?.name}</TableCell>
                      <TableCell>{order.customer?.email}</TableCell>
                      <TableCell>{order.customer?.phone}</TableCell>

                      <TableCell className="max-w-[200px] truncate">
                        {order.customer?.address}
                      </TableCell>

                      <TableCell>
                        {order.items?.map((item, i) => (
                          <div key={i} className="text-sm">
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </TableCell>

                      <TableCell className="font-bold text-green-600">
                        ₹{order.totalAmount?.toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Badge>{order.paymentMethod}</Badge>
                      </TableCell>

                      {/* -------- STATUS BADGE -------- */}
                      <TableCell>
                        <Badge
                          className={
                            order.status === "Pending"
                              ? "bg-yellow-500"
                              : order.status === "Processing"
                              ? "bg-blue-600"
                              : "bg-green-600"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs">
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>

                      {/* -------- ACTION BUTTON -------- */}
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleToggleStatus(order._id, order.status)
                          }
                          className={
                            order.status === "Pending"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : order.status === "Processing"
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                        >
                          {order.status === "Pending"
                            ? "Mark as Processing"
                            : order.status === "Processing"
                            ? "Mark as Completed"
                            : "Completed"}
                        </Button>

                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
