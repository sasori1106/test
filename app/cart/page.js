'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import CheckoutDialog from '../../components/CheckoutDialog';

export default function Cart() {
  const router = useRouter();
  const { 
    cartItems, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    calculateSubtotal 
  } = useCart();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessages, setActionMessages] = useState({ message: '', type: '' });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Function to display status messages
  const showMessage = (message, type = 'info') => {
    setActionMessages({ message, type });
    // Clear message after 3 seconds
    setTimeout(() => {
      setActionMessages({ message: '', type: '' });
    }, 3000);
  };

  const handleUpdateQuantity = async (index, newQuantity) => {
    setIsUpdating(true);
    
    try {
      const success = await updateQuantity(index, newQuantity);
      
      if (success) {
        showMessage('Cart updated successfully', 'success');
      } else {
        showMessage('Failed to update cart', 'error');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (index) => {
    setIsUpdating(true);
    
    try {
      const success = await removeItem(index);
      
      if (success) {
        showMessage('Item removed from cart', 'success');
      } else {
        showMessage('Failed to remove item', 'error');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    setIsUpdating(true);
    
    try {
      const success = await clearCart();
      
      if (success) {
        showMessage('Cart cleared successfully', 'success');
      } else {
        showMessage('Failed to clear cart', 'error');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = () => {
    // Open the checkout dialog
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = (result) => {
    setIsCheckoutOpen(false);
    
    if (result.success) {
      showMessage('Order placed successfully! Redirecting to orders page...', 'success');
      
      // Redirect to orders page after a short delay
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    }
  };

  if (isLoading || isUpdating) {
    return (
      <div className="min-h-screen bg-[#e6d5cc] flex justify-center items-center">
        <p className="text-neutral-900 text-xl">
          {isLoading ? 'Loading your cart...' : 'Updating your cart...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6d5cc] font-sans p-6">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Your Cart</h1>
      
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

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-24 w-24 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Your cart is empty</h2>
          <p className="text-neutral-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/shop" className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-red-600 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-stone-500 text-white">
                <h2 className="font-bold">Shopping Cart ({cartItems.length} items)</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div key={index} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <Image
                        src={item.img || "/placeholder.jpg"}
                        alt={item.name || "Product Image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900">{item.name}</h3>
                      <p className="text-red-700 font-medium">
                        ₱{item.price && typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                      </p>
                      <p className="text-sm text-green-600">
                        {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center border text-red-600 border-neutral-300 rounded-md">
                        <button 
                          onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                          className="px-3 py-1 text-lg font-bold text-neutral-700"
                          disabled={isUpdating}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                          className="px-3 py-1 text-lg font-bold text-neutral-700"
                          disabled={isUpdating || item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                        disabled={isUpdating}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="text-lg font-semibold text-neutral-900 text-right">
                      ₱{item.price && typeof item.price === 'number' 
                          ? (item.price * item.quantity).toFixed(2) 
                          : '0.00'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 text-right">
                <button 
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  disabled={isUpdating}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold text-red-600">₱{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-semibold text-red-600">₱0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-lg text-black">Total</span>
                  <span className="font-bold text-lg text-red-700">₱{calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-red-500 text-white py-3 rounded-full text-lg font-medium hover:bg-red-600 transition"
                disabled={isUpdating}
              >
                Proceed to Checkout
              </button>
              
              <Link href="/shop">
                <button className="w-full mt-4 border border-red-500 text-red-500 py-3 rounded-full text-lg font-medium hover:bg-red-50 transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Checkout Dialog */}
      {isCheckoutOpen && (
        <CheckoutDialog 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
}