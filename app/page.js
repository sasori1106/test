'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAuth, signOut } from "firebase/auth";

export default function HomeShop() {

  const trendingProducts = [
    { id: 1, name: 'Nasty 15,000 Puff Kits', image: '/nasty.jpg', description: 'Best selling disposable kit', shopLink: '/shop/Beast-Vape-shop-FVR' },
    { id: 2, name: 'X-1 Series Pink Air', image: '/x-pink.jpg', description: 'Popular X-1 Series', shopLink: '/shop/Vapery-shop' },
    { id: 3, name: 'X6 Series Black Tornado', image: '/x6-black.jpg', description: 'Best in x6 Series', shopLink: '/shop/Vapery-shop' },
    { id: 4, name: 'Oxva Xlim SQ', image: '/oxva.jpg', description: 'Refillable Pod of Oxva', shopLink: '/shop/Beast-Vape-shop-FVR' },
  ];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isShopAccessBlocked, setIsShopAccessBlocked] = useState(false);
  let dropdownTimeout;
  
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User successfully logged out');
        // Redirect the user to the login page or home page
        window.location.href = '/signin';
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
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

  const handleShopClick = (e) => {
    if (isShopAccessBlocked) {
      e.preventDefault(); // Prevent click on shops
      alert("Please sign in to see the products.");
    }
  };

  return (
    <div className="min-h-screen bg-[#e6d5cc] font-sans">

      {/* Main Content */}
      <section className="flex gap-4 p-8 bg-[#e6d5cc] relative z-0">
        <div className="flex-1 bg-gradient-to-r from-red-600 to-red-400 rounded-lg p-8 flex flex-col items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.891 15.107 15.11 8.89m-5.183-.52h.01m3.089 7.254h.01M14.08 3.902a2.849 2.849 0 0 0 2.176.902 2.845 2.845 0 0 1 2.94 2.94 2.849 2.849 0 0 0 .901 2.176 2.847 2.847 0 0 1 0 4.16 2.848 2.848 0 0 0-.901 2.175 2.843 2.843 0 0 1-2.94 2.94 2.848 2.848 0 0 0-2.176.902 2.847 2.847 0 0 1-4.16 0 2.85 2.85 0 0 0-2.176-.902 2.845 2.845 0 0 1-2.94-2.94 2.848 2.848 0 0 0-.901-2.176 2.848 2.848 0 0 1 0-4.16 2.849 2.849 0 0 0 .901-2.176 2.845 2.845 0 0 1 2.941-2.94 2.849 2.849 0 0 0 2.176-.901 2.847 2.847 0 0 1 4.159 0Z"
            />
          </svg>
          <h2 className="text-white text-3xl font-bold mb-4">UP TO 50% OFF</h2>
          <p className="text-white mb-6">On All Disposable Vape Pods</p>
          <Link href='/shop'>
            <button className="bg-white text-red-500 transform hover:scale-125 font-semibold px-4 py-2 rounded-full">
              Shop Now
            </button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Link href="/shop/Beast-Vape-shop-FVR" onClick={handleShopClick}>
            <Image
              src="/sale.jpg"
              alt="Featured Vape Product"
              width={500}
              height={400}
              className="rounded-lg transform transition duration-300 hover:scale-110"
            />
          </Link>
        </div>
      </section>

      <section className="p-8">
        <h2 className="text-center text-2xl text-black font-semibold mb-6">Trending Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg text-center transform transition duration-300 hover:scale-110">
              <Link href={product.shopLink} onClick={handleShopClick}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="rounded-lg mx-auto"
                />
                <h3 className="font-semibold text-black mt-2">{product.name}</h3>
                <p className="text-sm text-black">{product.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
