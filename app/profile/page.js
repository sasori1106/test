'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '../../components/ProtectRoutes';

export default function Profile() {
  const { user, logout } = useAuth();
  const { orders, orderCount } = useOrder();
  const { cartItems, cartCount } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  // Mock user stats
  const userStats = {
    joinDate: '01/15/2025',
    totalOrders: orderCount || 0,
    pendingOrders: orders?.filter(order => order?.status === 'pending')?.length || 0,
    totalSpent: orders?.reduce((total, order) => total + (order?.totalAmount || 0), 0) || 0
  };

  // Mock recent orders
  const recentOrders = orders?.slice(0, 3) || [];

  // Mock recent cart items
  const recentCartItems = cartItems?.slice(0, 3) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-600 to-gray-300">
        {/* Header with user info */}
        <div className="bg-stone-800 text-white p-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gray-500 rounded-full h-24 w-24 flex items-center justify-center mr-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.displayName || 'User'}</h1>
                <p className="text-gray-300">{user?.email}</p>
                <p className="text-sm text-gray-400">Member since: {userStats.joinDate}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3M12 5l7 7-7 7" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-stone-700 py-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
            <div className="text-center p-2">
              <p className="text-gray-300 text-sm">Member since</p>
              <p className="text-white font-bold">{userStats.joinDate}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-gray-300 text-sm">Total Orders</p>
              <p className="text-white font-bold">{userStats.totalOrders}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-gray-300 text-sm">Pending Orders</p>
              <p className="text-white font-bold">{userStats.pendingOrders}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-gray-300 text-sm">Total Spent</p>
              <p className="text-white font-bold">₱{userStats.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-500 mb-6">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Details
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
              onClick={() => setActiveTab('orders')}
            >
              Recent Orders
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'cart' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
              onClick={() => setActiveTab('cart')}
            >
              Current Cart
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
          
          {/* Content based on active tab */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                      <div className="bg-gray-100 p-3 rounded text-black">{user?.displayName || 'Not provided'}</div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                      <div className="bg-gray-100 p-3 rounded text-black">{user?.email}</div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">User ID</label>
                      <div className="bg-gray-100 p-3 rounded text-black">{user?.uid}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                      <div className="bg-gray-100 p-3 rounded text-black">Not provided</div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Default Shipping Address</label>
                      <div className="bg-gray-100 p-3 rounded text-black">Not provided</div>
                    </div>
                    
                    <div className="flex mt-8 justify-end">
                      <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
                  <Link href="/orders" className="text-red-600 hover:text-red-800">
                    View All Orders
                  </Link>
                </div>
                
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">Items: {order.items?.length || 0}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">₱{order.totalAmount?.toFixed(2)}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p className="text-gray-600">You don't have any orders yet</p>
                    <Link href="/shop" className="mt-3 inline-block text-red-600 hover:text-red-800 font-medium">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'cart' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                  <Link href="/cart" className="text-red-600 hover:text-red-800">
                    Go to Cart
                  </Link>
                </div>
                
                {recentCartItems.length > 0 ? (
                  <div className="space-y-4">
                    {recentCartItems.map((item, index) => (
                      <div key={index} className="flex items-center border-b pb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                          {item.img ? (
                            <Image src={item.img} alt={item.name} width={64} height={64} className="object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-gray-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">₱{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">₱{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-right pt-4">
                      <p className="text-lg text-gray-700">
                        {cartItems.length > 3 ? `+ ${cartItems.length - 3} more items in cart` : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <p className="text-gray-600">Your cart is empty</p>
                    <Link href="/shop" className="mt-3 inline-block text-red-600 hover:text-red-800 font-medium">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Password</h3>
                    <button className="bg-stone-600 hover:bg-stone-700 text-white font-medium py-2 px-4 rounded">
                      Change Password
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="email_notifications" className="mr-2" defaultChecked />
                        <label htmlFor="email_notifications">Email notifications for orders</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="promo_emails" className="mr-2" defaultChecked />
                        <label htmlFor="promo_emails">Promotional emails</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Methods</h3>
                    <button className="bg-stone-600 hover:bg-stone-700 text-white font-medium py-2 px-4 rounded">
                      Add Payment Method
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                    <button className="border border-red-600 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-stone-800 text-center py-4 mt-6">
          <p className="text-white">
            <span className="text-2xl">
              <span className="text-black">VO</span>
              <span className="text-red-500">X</span>
            </span> © 2025 VapeonX. All rights reserved.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}