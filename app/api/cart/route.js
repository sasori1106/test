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

function saveCart(cart) {
  const cookieStore = cookies();
  cookieStore.set('cart', JSON.stringify(cart), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, 
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
}

// GET handler for fetching the cart
export async function GET() {
  try {
    const cart = getCart();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}