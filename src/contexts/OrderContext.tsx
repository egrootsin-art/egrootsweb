import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "@/api/axiosConfig";

export interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  fetchOrders: (email: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  // Fetch orders for logged email
  const fetchOrders = async (email: string) => {
    try {
      setUserEmail(email);
      const res = await axios.get(`/api/orders/user/${email}`);
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const refreshOrders = async () => {
    if (!userEmail) return;
    await fetchOrders(userEmail);
  };

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
      await refreshOrders();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      await refreshOrders();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        fetchOrders,
        refreshOrders,
        cancelOrder,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
