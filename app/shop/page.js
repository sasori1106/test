'use client';
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ShopPage() {
  const scrollRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let dropdownTimeout;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
    <div className="min-h-screen bg-[#e6d5cc] font-sans">
      <section className="p-8">
        <h2 className="text-center text-3xl text-black font-bold mb-6">Our Shops</h2>
        <div className="flex items-center relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 bg-stone-500 text-white text-xl p-3 rounded-full hover:bg-stone-600 transition duration-300"
            style={{ transform: "translateX(-50%)" }}
          >
            &#60;
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-hidden space-x-4 px-4 snap-x snap-mandatory scroll-smooth w-full mx-12"
          >
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg min-w-[300px] snap-start transform transition duration-300 hover:scale-95">
              <Link href="/shop/Vapery-shop">
                <h3 className="text-xl text-white font-semibold mb-4">VAPERY SHOP-SJDM</h3>
                <Image
                  src="/vapery.png"
                  alt="VapeX Store"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-white">Popular Vapes:</h4>
                  <ul className="text-white">
                    <li>- X-Vape X1 Series</li>
                    <li>- X-Vape X6 Series</li>
                    <li>- X-Vape X3 Series Transparent Chamber</li>
                  </ul>
                </div>
              </Link>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg min-w-[300px] snap-start transform transition duration-300 hover:scale-95">
              <Link href="/shop/M&M-Vape-Shop">
                <h3 className="text-xl font-semibold mb-4 text-white">M&M Vape Shop</h3>
                <Image
                  src="/MM.png"
                  alt="Cloud Nine"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-white">Popular Products:</h4>
                  <ul className="text-white">
                    <li>- Celestial Series</li>
                    <li>- Dream Puff XL</li>
                    <li>- Nimbus Flavor Collection</li>
                  </ul>
                </div>
              </Link>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg min-w-[300px] snap-start transform transition duration-300 hover:scale-95">
              <Link href="/shop/Sheesh-Vape-Shop">
                <h3 className="text-xl font-semibold mb-4 text-white">SHEESH VAPE SHOP</h3>
                <Image
                  src="/sheeshh.png"
                  alt="Vape Solutions"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-white">Popular Products:</h4>
                  <ul className="text-white">
                    <li>- Premium Juice Collection</li>
                    <li>- Pro Series Pods</li>
                    <li>- Elite Coils</li>
                  </ul>
                </div>
              </Link>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg min-w-[300px] snap-start transform transition duration-300 hover:scale-95">
              <Link href="/shop/Beast-Vape-shop-FVR">
                <h3 className="text-xl text-white font-semibold mb-4">BEAST VAPE SHOP - FVR</h3>
                <Image
                  src="/beast.png"
                  alt="Beast Vape Shop - FVR"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-white">Popular Products:</h4>
                  <ul className="text-white">
                    <li>- Berry Burst Vape</li>
                    <li>- Mango Mist Mini</li>
                    <li>- Ghostly Puff</li>
                  </ul>
                </div>
              </Link>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg min-w-[300px] snap-start transform transition duration-300 hover:scale-95">
              <Link href="/shop/Beast-Vape-Shop-Gaya-Gaya">
                <h3 className="text-xl font-semibold mb-4 text-white">BEAST VAPE SHOP - GAYA-GAYA</h3>
                <Image
                  src="/beast.png"
                  alt="BVS GAYA-GAYA"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-white">Popular Products:</h4>
                  <ul className="text-white">
                    <li>- Mint Chill Blast</li>
                    <li>- Sunset Vibe</li>
                    <li>- Ultra Puff Classic</li>
                  </ul>
                </div>
              </Link>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg min-w-[300px] snap-start transform transition duration-300 hover:scale-95">
              <Link href="/shop/Vapery-shop-Tungko">
                <h3 className="text-xl font-semibold mb-4 text-white">VAPERY SHOP - TUNGKO</h3>
                <Image
                  src="/vapery.png"
                  alt="Vapery Shop"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold text-white">Popular Products:</h4>
                  <ul className="text-white">
                    <li>- Cloud Max Pro</li>
                    <li>- Arctic Breeze</li>
                    <li>- Thunder Strike</li>
                  </ul>
                </div>
              </Link>
            </div>
          </div>
          <button 
            onClick={scrollRight} 
            className="absolute right-0 bg-stone-500 text-white text-xl p-3 rounded-full hover:bg-stone-600 transition duration-300"
            style={{ transform: "translateX(50%)" }}
          >
            &#62;
          </button>
        </div>
      </section>
    </div>
  );
}