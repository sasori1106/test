export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.orderId) {
      return new Response(
        JSON.stringify({ success: false, message: "Order ID is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get existing orders from cookies
    const cookies = request.headers.get('cookie') || '';
    const ordersCookie = cookies.split(';').find(c => c.trim().startsWith('orders='));
    
    let orders = [];
    
    if (ordersCookie) {
      try {
        const encodedOrders = ordersCookie.split('=')[1];
        orders = JSON.parse(decodeURIComponent(encodedOrders));
      } catch (error) {
        console.error("Error parsing orders from cookie:", error);
      }
    }
    
    // Find the order to cancel
    const orderIndex = orders.findIndex(order => order.id === data.orderId);
    
    if (orderIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: "Order not found" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Update the order status to cancelled
    orders[orderIndex].status = "cancelled";
    
    // Set the updated orders in a cookie
    const encodedOrders = encodeURIComponent(JSON.stringify(orders));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order cancelled successfully" 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `orders=${encodedOrders}; path=/; max-age=31536000; SameSite=Strict`
        } 
      }
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Failed to cancel order" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}