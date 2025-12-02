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
import { Loader2 } from "lucide-react";

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
  _id: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");

  axios.get("http://localhost:5000/api/admin/orders/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => {
    setOrders(res.data.orders);
    setLoading(false);
  })
  .catch(err => {
    console.error("Error fetching orders:", err);
    setLoading(false);
  });
}, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            📊 Admin Order Dashboard
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
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map(order => (
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
                            {item.name} x {item.quantity}
                          </div>
                        ))}
                      </TableCell>

                      <TableCell className="font-bold text-green-600">
                        ₹{order.totalAmount?.toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Badge>{order.paymentMethod}</Badge>
                      </TableCell>

                      <TableCell className="text-xs">
                        {new Date(order.createdAt).toLocaleString()}
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
