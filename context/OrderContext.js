'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from server on initial render
  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order count whenever orders change
  useEffect(() => {
    // Only count active orders (not cancelled)
    const activeOrderCount = orders.filter(order => order.status.toLowerCase() !== 'cancelled').length;
    setOrderCount(activeOrderCount);
  }, [orders]);

  // Fetch orders data from server
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Initialize with empty orders on error
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (cartItems, shippingDetails) => {
    if (!cartItems || cartItems.length === 0) {
      console.error("Cannot create order with empty cart");
      return { success: false, message: "Cart is empty" };
    }
    
    try {
      const orderData = {
        items: cartItems,
        shipping: shippingDetails,
        status: "pending",
        orderDate: new Date().toISOString(),
        totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error creating order: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Immediately add the new order to the local state for instant feedback
      const newOrder = {
        id: data.orderId,
        ...orderData
      };
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      return { 
        success: true, 
        message: "Order placed successfully", 
        orderId: data.orderId 
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return { 
        success: false, 
        message: error.message || "Failed to place order" 
      };
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (!response.ok) {
        throw new Error(`Error cancelling order: ${response.status}`);
      }
      
      // Update the order status locally for immediate feedback
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      
      return { success: true, message: "Order cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { success: false, message: error.message || "Failed to cancel order" };
    }
  };

  // Delete a cancelled order
  const deleteOrder = async (orderId) => {
    try {
      console.log("Deleting order:", orderId);
      const response = await fetch('/api/orders/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      // Get the response body even if it's an error
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error(`Error response: ${response.status}`, responseData);
        throw new Error(responseData.message || `Failed to delete order: ${response.status}`);
      }
      
      console.log("Order deleted successfully:", orderId);
      // Remove the order from local state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      return { success: true, message: "Order deleted successfully" };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { success: false, message: error.message || "Failed to delete order" };
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      orderCount,
      isLoading,
      createOrder,
      cancelOrder,
      deleteOrder,
      fetchOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}