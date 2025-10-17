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

// POST handler for removing items from cart
export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId } = body;
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    const cart = getCart();
    
    // Remove the item
    cart.items = cart.items.filter(item => 
      (item.id && item.id !== itemId) && 
      (item.name && item.name !== itemId)
    );
    
    // Save updated cart
    saveCart(cart);
    
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}