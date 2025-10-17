'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrder } from '../../context/OrderContext';

export default function Orders() {
  const { orders, isLoading, cancelOrder, deleteOrder } = useOrder();
  const [actionMessages, setActionMessages] = useState({ message: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to display status messages
  const showMessage = (message, type = 'info') => {
    setActionMessages({ message, type });
    // Clear message after 3 seconds
    setTimeout(() => {
      setActionMessages({ message: '', type: '' });
    }, 3000);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await cancelOrder(orderId);
      
      if (result.success) {
        showMessage('Order cancelled successfully', 'success');
      } else {
        showMessage(result.message || 'Failed to cancel order', 'error');
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Attempting to delete order:", orderId);
      const result = await deleteOrder(orderId);
      console.log("Delete order result:", result);
      
      if (result.success) {
        showMessage('Order deleted successfully', 'success');
      } else {
        showMessage(result.message || 'Failed to delete order', 'error');
      }
    } catch (error) {
      console.error("Error in handleDeleteOrder:", error);
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to format date string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter active and cancelled orders
  const activeOrders = orders.filter(order => order.status.toLowerCase() !== 'cancelled');
  const cancelledOrders = orders.filter(order => order.status.toLowerCase() === 'cancelled');

  if (isLoading || isProcessing) {
    return (
      <div className="min-h-screen bg-[#e6d5cc] flex justify-center items-center">
        <p className="text-neutral-900 text-xl">
          {isLoading ? 'Loading your orders...' : 'Processing your request...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6d5cc] font-sans p-4">
      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Your Orders</h1>
      
      {/* Status message */}
      {actionMessages.message && (
        <div className={`mb-4 p-3 rounded-md ${
          actionMessages.type === 'error' ? 'bg-red-100 text-red-700' : 
          actionMessages.type === 'success' ? 'bg-green-100 text-green-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {actionMessages.message}
        </div>
      )}

      {activeOrders.length === 0 && cancelledOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">No orders yet</h2>
          <p className="text-neutral-600 mb-4">You haven't placed any orders yet.</p>
          <Link href="/shop" className="bg-red-500 text-white px-5 py-2 rounded-full text-base font-medium hover:bg-red-600 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-neutral-900 mt-4">Active Orders ({activeOrders.length})</h2>
              <div className="space-y-3">
                {activeOrders.map((order, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-3 bg-stone-500 text-white flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-sm">Order #{order.id || `${index + 1}`}</h2>
                        <p className="text-xs text-stone-200">Placed on {formatDate(order.orderDate)}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="p-3">
                      {/* Order Items - More compact */}
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-neutral-900 mb-2">Items</h3>
                        <div className="divide-y divide-gray-200">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="py-2 flex items-center gap-3">
                              <div className="w-12 h-12 relative flex-shrink-0">
                                <Image
                                  src={item.img || "/placeholder.jpg"}
                                  alt={item.name || "Product Image"}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-neutral-900">{item.name}</h4>
                                <p className="text-xs text-neutral-600">
                                  {item.quantity} × ₱{item.price && typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-medium text-sm text-neutral-900">
                                  ₱{item.price && typeof item.price === 'number' 
                                      ? (item.price * item.quantity).toFixed(2) 
                                      : '0.00'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shipping Details - More compact */}
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-neutral-900 mb-1">Shipping Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-black"><span className="font-medium text-black">Name:</span> {order.shipping.fullName}</p>
                            <p className="text-black"><span className="font-medium text-black">Email:</span> {order.shipping.email}</p>
                            <p className="text-black"><span className="font-medium text-black">Phone:</span> {order.shipping.phone}</p>
                          </div>
                          <div>
                            <p className="text-black"><span className="font-medium">Address:</span> {order.shipping.address}</p>
                            <p className="text-black"><span className="font-medium">City:</span> {order.shipping.city}</p>
                            <p className="text-black"><span className="font-medium">Postal Code:</span> {order.shipping.postalCode}</p>
                            <p className="text-black"><span className="font-medium">Payment Method:</span> {
                              order.shipping.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                              order.shipping.paymentMethod === 'bank' ? 'Bank Transfer' : 
                              order.shipping.paymentMethod
                            }</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Summary - More compact */}
                      <div className="mb-3">
                        <h3 className="text-base font-semibold text-neutral-900 mb-1">Order Summary</h3>
                        <div className="border-t border-b border-gray-200 py-2">
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-neutral-600">Subtotal</span>
                            <span className="font-medium text-black">₱{order.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-neutral-600">Shipping</span>
                            <span className="font-medium text-black">₱0.00</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-200 text-sm">
                            <span className="font-medium text-black">Total</span>
                            <span className="font-bold text-red-700">₱{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      {order.status.toLowerCase() === 'pending' && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                            disabled={isProcessing}
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Cancelled Orders - Even more compact */}
          {cancelledOrders.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-2">Cancelled Orders</h2>
              <div className="space-y-2">
                {cancelledOrders.map((order, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                    <div className="p-2 bg-gray-200 text-gray-800 flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-sm">Order #{order.id || `${index + 1}`}</h2>
                        <p className="text-xs text-gray-600">Cancelled on {formatDate(order.orderDate)}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        Cancelled
                      </div>
                    </div>
                    
                    <div className="p-3">
                      {/* Summary of cancelled items - Very compact */}
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Items</h3>
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="text-xs text-neutral-600">
                            {item.quantity}× {item.name}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-xs text-neutral-600">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                      
                      {/* Total Amount - Very compact */}
                      <div className="text-xs mb-2">
                        <span className="font-medium text-black">Order Total: </span>
                        <span className="font-medium text-red-600">₱{order.totalAmount.toFixed(2)}</span>
                      </div>
                      
                      {/* Delete action */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                          disabled={isProcessing}
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}