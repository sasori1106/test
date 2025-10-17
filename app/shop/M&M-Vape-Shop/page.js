'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

export default function MMVapeShop() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const { addToCart } = useCart();

  const products = [
    { name: "Black Elite V2 Prefilled Pod Vape Kit- Authentic", price: 820.00, stock: 15, img: "/BlackE.jpg" },
    { name: "DenKat x Geek Bar Pro 15k Disposable Vape", price: 599.00, stock: 8, img: "/GeekPink.jpg" },
    { name: "Exso V2 12000 Prefilled Pod Only Vape-Extremely Sour Compatible with Elite V2", price: 450, stock: 25, img: "/Exso.jpg" },
    { name: "Denkat X Smok X12000 Vape Kit", price: 600.00, stock: 30, img: "/Denkat.jpg" },
    { name: "Flava Hyper Bar Xtre 10000 Puffs Disposable Vape", price: 550.0, stock: 30, img: "/Flava.jpg" },
    { name: "Flava Romio Pilot 10000 Puffs Disposable Vape", price: 500.00, stock: 30, img: "/romio.png" },
    { name: "Geek Bar DF6000 Puffs Disposable Vape", price: 449.99, stock: 30, img: "/GeekBar.jpg" },
    { name: "Instabar Max 10000 Puffs Disposable Vape", price: 549.99, stock: 30, img: "/insta.jpg" },
  ];


  const showMessage = (message, type = 'info') => {
    setStatusMessage({ message, type });

    setTimeout(() => {
      setStatusMessage({ message: '', type: '' });
    }, 3000);
  };

  const openDialog = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < selectedProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartHandler = async () => {
    setIsAdding(true);
    
    try {
      const success = await addToCart(selectedProduct, quantity);
      
      if (success) {
        showMessage(`Added ${quantity} ${selectedProduct.name} to cart!`, 'success');
        closeDialog();
      } else {
        showMessage('Failed to add item to cart', 'error');
      }
    } catch (error) {
      console.error("Error in add to cart:", error);
      showMessage('An error occurred while adding to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6d5cc] font-sans">
      {/* Status message */}
      {statusMessage.message && (
        <div className={`fixed top-4 right-4 z-50 p-3 rounded-md shadow-md ${
          statusMessage.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 
          statusMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 
          'bg-blue-100 text-blue-700 border border-blue-300'
        }`}>
          {statusMessage.message}
        </div>
      )}
    
      {/* Shop Profile Section */}
      <section className="bg-[#e6d5cc] p-6">
        <div className="flex items-center gap-6">
          <Image
            src="/MM.png"
            alt="Vapery Shop"
            width={100}
            height={100}
            className="rounded-full bg-black"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-neutral-900">Welcome to</h1>
            <p className="text-3xl font-bold text-neutral-900">M&M Vape Shop</p>
            <p className="text-sm text-green-600">Location: San Jose del Monte, Bulacan</p>
          </div>
          <div>
            <button className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-medium">
              Follow Shop
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-neutral-900">Trending Vapes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white text-neutral-900 rounded-lg shadow-md transform transition-all duration-300 hover:scale-110 hover:z-20 p-4 flex flex-col items-center relative cursor-pointer"
              style={{ zIndex: 1 }}
              onClick={() => openDialog(product)}
            >
              <div className="transition-all duration-300 hover:scale-100">
                <Image
                  src={product.img}
                  alt={product.name}
                  width={300}
                  height={100}
                  className="mb-4"
                />
              </div>
              <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
              <p className="text-red-700 text-xs">Price: ₱{product.price.toFixed(2)}</p>
              <p className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Add to Cart Dialog */}
      {isDialogOpen && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-neutral-900/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-11/12">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-neutral-900">Add to Cart</h3>
              <button 
                onClick={closeDialog}
                className="text-neutral-500 hover:text-neutral-800 text-2xl font-bold"
                disabled={isAdding}
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 flex justify-center">
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  width={150}
                  height={150}
                  className="rounded-md object-contain"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">{selectedProduct.name}</h4>
                <p className="text-red-700 font-medium mb-2">₱{selectedProduct.price.toFixed(2)}</p>
                <p className="text-sm text-green-600 mb-4">{selectedProduct.stock} in stock</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-neutral-800 font-medium">Quantity:</span>
                  <div className="flex items-center border text-red-600 border-neutral-300 rounded-md">
                    <button 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || isAdding}
                      className="px-3 py-1 text-lg font-bold text-neutral-700 disabled:text-neutral-400"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-center w-10">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      disabled={quantity >= selectedProduct.stock || isAdding}
                      className="px-3 py-1 text-lg font-bold text-neutral-700 disabled:text-neutral-400"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="text-lg font-semibold text-neutral-900 mb-4">
                  Total: ₱{(selectedProduct.price * quantity).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-4">
              <button 
                onClick={closeDialog}
                className="flex-1 py-2 border border-red-500 text-red-500 rounded-full font-medium hover:bg-red-50"
                disabled={isAdding}
              >
                Cancel
              </button>
              <button 
                onClick={addToCartHandler}
                className="flex-1 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 disabled:bg-red-300"
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}