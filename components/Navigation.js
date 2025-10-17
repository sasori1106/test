'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import { useRouter } from 'next/navigation';
import { useOrder } from '../context/OrderContext'; // Import the OrderContext

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartCount } = useCart(); // Add this line
  const { orderCount } = useOrder(); // Add this line
  let dropdownTimeout;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout); 
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  return (
    <header className="bg-stone-500 opacity-90 p-4 flex justify-between items-center relative z-10">
      <Link href="/">
        <button>
          <div className="text-white text-2xl font-bold flex items-center gap-2 transform transition duration-150 hover:scale-95">
            <Image src="/logo.png" alt="VapeonX logo" width={70} height={50} />
          </div>
        </button>
      </Link>
        
      <div className="flex items-center gap-2">
        <p>
          <span className="text-black text-3xl">VO</span>
          <span className="text-red-700 text-3xl">X</span>
        </p>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Shop / Product"
          className="bg-gray-700 text-white px-20 py-1 rounded-full outline-none transform transition duration-300 hover:scale-105"
        />
        <button className="text-white bg-gray-700 p-2 rounded-md transform transition duration-300 hover:scale-110 hover:bg-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {user ? (
        <div className="flex items-center gap-4">

         <Link href="/cart" className="flex items-center px-3 py-1 text-white hover:bg-stone-600 rounded-md transition duration-300 relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>Cart
      {/* Cart Count Indicator */}
             {cartCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
             {cartCount > 99 ? '99+' : cartCount}
             </span>
             )}
          </Link>
          <Link href="/orders" className="flex items-center px-3 py-1 text-white hover:bg-stone-600 rounded-md transition duration-300 relative">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-1">
             <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
             </svg>Orders
      {/* Order Count Indicator */}
             {orderCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
             {orderCount > 99 ? '99+' : orderCount}
             </span>
             )}
          </Link>
          
          {/* User profile dropdown */}
          <div
            className="relative flex items-center gap-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <button className="text-white font-medium transform transition duration-300 hover:scale-110 hover:underline">
              {`Hello, ${user.displayName || 'User'}`}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50">
                <Link href="/profile" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Profile
                </Link>
                <Link href="/" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  Home
                </Link>
                <Link href="/shop" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  Shop
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3M12 5l7 7-7 7" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link href="/signin" className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition">
            Sign In
          </Link>
          <Link href="/signup" className="text-white bg-stone-600 px-4 py-2 rounded-md hover:bg-stone-700 transition">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}