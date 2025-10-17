export async function GET(request) {
  // In a real application with a backend, you would fetch orders from your database
  // Since we're working client-side only, we'll use localStorage via cookies
  
  // Check if there are any orders in cookies
  const cookies = request.headers.get('cookie') || '';
  const ordersCookie = cookies.split(';').find(c => c.trim().startsWith('orders='));
  
  let orders = [];
  
  if (ordersCookie) {
    try {
      // Parse the orders from the cookie
      const encodedOrders = ordersCookie.split('=')[1];
      orders = JSON.parse(decodeURIComponent(encodedOrders));
    } catch (error) {
      console.error("Error parsing orders from cookie:", error);
    }
  }
  
  return new Response(JSON.stringify({ orders }), {
    headers: { 'Content-Type': 'application/json' }
  });
}