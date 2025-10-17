export async function POST(request) {
  try {
    const data = await request.json();
    
    // Debug log for incoming request
    console.log("Delete order request:", data);
    
    // Validate required fields
    if (!data.orderId) {
      return new Response(
        JSON.stringify({ success: false, message: "Order ID is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get existing orders from cookies
    const cookies = request.headers.get('cookie') || '';
    console.log("Received cookies:", cookies);
    
    let ordersCookie = cookies.split(';').find(c => c.trim().startsWith('orders='));
    
    let orders = [];
    
    if (ordersCookie) {
      try {
        const encodedOrders = ordersCookie.split('=')[1];
        console.log("Found encoded orders:", encodedOrders);
        orders = JSON.parse(decodeURIComponent(encodedOrders));
        console.log("Parsed orders:", orders);
      } catch (error) {
        console.error("Error parsing orders from cookie:", error);
        // Return a more detailed error response
        return new Response(
          JSON.stringify({ success: false, message: "Invalid order data format" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.log("No orders cookie found");
    }
    
    // Find the order to delete
    const orderIndex = orders.findIndex(order => order.id === data.orderId);
    console.log("Order index:", orderIndex, "for ID:", data.orderId);
    
    if (orderIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: "Order not found" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // No need to check if the order is cancelled - allowing deletion of any order
    // Remove the order from the array
    orders.splice(orderIndex, 1);
    
    // Set the updated orders in a cookie
    const encodedOrders = encodeURIComponent(JSON.stringify(orders));
    console.log("Updated orders length:", orders.length);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order deleted successfully" 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `orders=${encodedOrders}; path=/; max-age=31536000; SameSite=Strict`
        } 
      }
    );
  } catch (error) {
    // Log the full error details
    console.error("Error deleting order:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to delete order", 
        error: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}