import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Helper function to get cart from cookies
function getCart() {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get('cart');
  
  if (!cartCookie) {
    return { items: [] };
  }
  
  try {
    return JSON.parse(cartCookie.value);
  } catch (error) {
    console.error('Failed to parse cart cookie:', error);
    return { items: [] };
  }
}

// Helper function to save cart to cookies
function saveCart(cart) {
  const cookieStore = cookies();
  cookieStore.set('cart', JSON.stringify(cart), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
}

// POST handler for adding items to cart
export async function POST(request) {
  try {
    const body = await request.json();
    const { product, quantity } = body;
    
    if (!product || !product.name || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }
    
    const cart = getCart();
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      (item.id && product.id && item.id === product.id) || 
      (item.name && product.name && item.name === product.name)
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Make sure not to exceed available stock
      if (newQuantity <= product.stock) {
        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        return NextResponse.json(
          { error: 'Requested quantity exceeds available stock' },
          { status: 400 }
        );
      }
    } else {
      // Create a clean object with only the properties we need to store
      const cleanProduct = {
        id: product.id || product.name,
        name: product.name,
        price: product.price || 0,
        stock: product.stock || 0,
        quantity: quantity,
        img: product.img || "/placeholder.jpg"
      };
      
      // Add new item to cart
      cart.items.push(cleanProduct);
    }
    
    // Save updated cart
    saveCart(cart);
    
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}