import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

// POST handler for clearing the cart
export async function POST() {
  try {
    // Clear the cart by setting items to an empty array
    const emptyCart = { items: [] };
    saveCart(emptyCart);
    
    return NextResponse.json({ success: true, cart: emptyCart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}