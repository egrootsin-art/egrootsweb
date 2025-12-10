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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  LogOut,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price?: number;
  category?: string;
  image?: string;
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
  status: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------ FETCH ORDERS ------------------
  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = res.data.orders;
      
      console.log("📊 Fetched orders:", fetchedOrders);
      console.log("📊 Status values:", fetchedOrders.map((o: Order) => o.status));
      
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      calculateStats(fetchedOrders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ------------------ CALCULATE STATS ------------------
const calculateStats = (orderList: Order[]) => {
  // ✅ 1. Exclude cancelled orders from revenue
  const totalRevenue = orderList
    .filter((o) => o.status?.toLowerCase() !== "cancelled")
    .reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0
    );

  // You can keep totalOrders as all orders,
  // or also exclude cancelled if you prefer:
  const totalOrders = orderList.length;
  // const totalOrders = orderList.filter(
  //   (o) => o.status?.toLowerCase() !== "cancelled"
  // ).length;

  const pendingOrders = orderList.filter(
    (o) => o.status?.toLowerCase() === "pending"
  ).length;

  const processingOrders = orderList.filter(
    (o) => o.status?.toLowerCase() === "processing"
  ).length;

  const completedOrders = orderList.filter(
    (o) => o.status?.toLowerCase() === "completed"
  ).length;

  const cancelledOrders = orderList.filter(
    (o) => o.status?.toLowerCase() === "cancelled"
  ).length;

  setStats({
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
  });
};


  // ------------------ SEARCH & FILTER ------------------
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ------------------ TOGGLE STATUS ------------------
const handleToggleStatus = async (orderId: string, currentStatus: string) => {
  let newStatus = currentStatus;

  if (currentStatus.toLowerCase() === "pending") newStatus = "Processing";
  else if (currentStatus.toLowerCase() === "processing") newStatus = "Completed";
  else return;

  try {
    const res = await axios.put(
      `http://localhost:5000/api/orders/update-status/${orderId}`,
      { status: newStatus }
    );

    const updatedOrders = orders.map((order) =>
      order._id === orderId ? res.data.order : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    calculateStats(updatedOrders);

    // ✅ SEND SHIPMENT CONFIRMATION EMAIL when status becomes "Completed"
    if (newStatus.toLowerCase() === "completed") {
      try {
        await axios.post("http://localhost:5000/api/send-shipment-email", {
          customerInfo: res.data.order.customer,
          items: res.data.order.items,
          total: res.data.order.totalAmount,
          orderId: res.data.order._id,
          trackingId: `TRK${res.data.order._id.slice(-6).toUpperCase()}`, // Optional tracking ID
        });
      } catch (emailErr) {
        console.error("Shipment email failed:", emailErr);
        // Don't fail the status update if email fails
      }
    }

    toast({
      title: "Status Updated ✅",
      description: `Order status changed to ${newStatus}`,
    });
  } catch (err) {
    console.error("Status update failed:", err);
    toast({
      title: "Update Failed",
      description: "Unable to update order status",
      variant: "destructive",
    });
  }
};


  // ------------------ CANCEL ORDER ------------------
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/update-status/${orderToCancel._id}`,
        { status: "Cancelled" }
      );

      const updatedOrders = orders.map((order) =>
        order._id === orderToCancel._id ? res.data.order : order
      );
      
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      calculateStats(updatedOrders);
      setShowCancelDialog(false);
      setOrderToCancel(null);

      toast({
        title: "Order Cancelled 🚫",
        description: `Order #${orderToCancel._id.slice(-6)} has been cancelled`,
      });
    } catch (err) {
      console.error("Cancel order failed:", err);
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel order",
        variant: "destructive",
      });
    }
  };

  // ------------------ VIEW ORDER DETAILS ------------------
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // ------------------ OPEN CANCEL DIALOG ------------------
  const openCancelDialog = (order: Order) => {
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  // ------------------ EXPORT TO CSV ------------------
  const handleExportCSV = () => {
    const csvContent = [
      ["Order ID", "Customer", "Email", "Phone", "Total", "Status", "Date"],
      ...filteredOrders.map((order) => [
        order._id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
        order.totalAmount,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // ------------------ STATUS BADGE STYLING ------------------
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "processing":
        return "bg-blue-600 hover:bg-blue-700";
      case "completed":
        return "bg-green-600 hover:bg-green-700";
      case "cancelled":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* -------- HEADER -------- */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage orders and track performance
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={fetchOrders}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* -------- STATS CARDS -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 sm:mb-8">
          {/* Total Orders */}
          <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total Orders</p>
                  <h3 className="text-2xl font-bold text-white-900 mt-1">
                    {stats.totalOrders}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Revenue</p>
                  <h3 className="text-xl font-bold text-white-900 mt-1">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                  <h3 className="text-2xl font-bold text-white-900 mt-1">
                    {stats.pendingOrders}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing */}
          <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Processing</p>
                  <h3 className="text-2xl font-bold text-white-900 mt-1">
                    {stats.processingOrders}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Completed</p>
                  <h3 className="text-2xl font-bold text-white-900 mt-1">
                    {stats.completedOrders}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancelled */}
          <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Cancelled</p>
                  <h3 className="text-2xl font-bold text-white-900 mt-1">
                    {stats.cancelledOrders}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------- FILTERS -------- */}
        <Card className="shadow-md mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* -------- ORDERS TABLE -------- */}
        <Card className="shadow-xl">
          <CardHeader className="border-b bg-black-50">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Management
              <Badge variant="secondary" className="ml-2">
                {filteredOrders.length} orders
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-gray-500 mt-4">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Package className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold hidden lg:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-mono text-xs">
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {order.customer?.name}
                          </div>
                          <div className="text-xs text-gray-500 md:hidden">
                            {order.customer?.email}
                          </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-sm text-gray-600">
                          {order.customer?.email}
                        </TableCell>

                        <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                          {order.customer?.phone}
                        </TableCell>

                        <TableCell className="font-bold text-green-600">
                          ₹{order.totalAmount?.toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <Badge className={getStatusBadgeClass(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleViewDetails(order)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Eye size={14} />
                              <span className="hidden lg:inline">View</span>
                            </Button>

                            {/* ✅ CANCEL BUTTON */}
                            {order.status?.toLowerCase() !== "completed" && 
                             order.status?.toLowerCase() !== "cancelled" && (
                              <>
                                <Button
                                  onClick={() =>
                                    handleToggleStatus(order._id, order.status)
                                  }
                                  size="sm"
                                  className={`${
                                    order.status?.toLowerCase() === "pending"
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : "bg-yellow-600 hover:bg-yellow-700"
                                  } text-white hidden sm:flex`}
                                >
                                  {order.status?.toLowerCase() === "pending"
                                    ? "Process"
                                    : "Complete"}
                                </Button>

                                <Button
                                  onClick={() => openCancelDialog(order)}
                                  variant="destructive"
                                  size="sm"
                                  className="flex items-center gap-1"
                                >
                                  <X size={14} />
                                  <span className="hidden lg:inline">Cancel</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* -------- ORDER DETAILS MODAL -------- */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order ID: #{selectedOrder?._id.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1.5 text-sm">
                  <div className="flex">
                    <span className="font-medium w-20">Name:</span>
                    <span className="text-gray-700">
                      {selectedOrder.customer?.name}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">Email:</span>
                    <span className="text-gray-700">
                      {selectedOrder.customer?.email}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">Phone:</span>
                    <span className="text-gray-700">
                      {selectedOrder.customer?.phone}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">Address:</span>
                    <span className="text-gray-700">
                      {selectedOrder.customer?.address || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium">Product</th>
                        <th className="text-center p-2 font-medium w-20">Qty</th>
                        <th className="text-right p-2 font-medium w-24">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{item.name}</td>
                          <td className="text-center p-2">{item.quantity}</td>
                          <td className="text-right p-2">
                            ₹{((item.price || 0) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2">
                      <tr>
                        <td colSpan={2} className="p-2 font-bold text-right">
                          Total:
                        </td>
                        <td className="p-2 font-bold text-right text-green-600">
                          ₹{selectedOrder.totalAmount?.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1.5">Payment Method</p>
                  <Badge variant="secondary">{selectedOrder.paymentMethod}</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1.5">Order Status</p>
                  <Badge className={getStatusBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1.5">Order Date</p>
                  <p className="text-sm font-medium text-black">
                    {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ CANCEL ORDER CONFIRMATION DIALOG */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              Cancel Order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order{" "}
              <span className="font-mono font-bold">
                #{orderToCancel?._id.slice(-6).toUpperCase()}
              </span>
              ?
              <br />
              <br />
              <span className="text-gray-700">
                <strong>Customer:</strong> {orderToCancel?.customer?.name}
                <br />
                <strong>Total:</strong> ₹{orderToCancel?.totalAmount?.toFixed(2)}
              </span>
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToCancel(null)}>
              No, Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
