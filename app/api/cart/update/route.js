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

// POST handler for updating cart items
export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;
    
    if (!itemId || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid item ID or quantity' },
        { status: 400 }
      );
    }
    
    const cart = getCart();
    
    // Find the item to update
    const itemIndex = cart.items.findIndex(item => 
      (item.id && item.id === itemId) || 
      (item.name && item.name === itemId)
    );
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // Make sure not to exceed available stock
    if (quantity > cart.items[itemIndex].stock) {
      return NextResponse.json(
        { error: 'Requested quantity exceeds available stock' },
        { status: 400 }
      );
    }
    
    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Save updated cart
    saveCart(cart);
    
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}