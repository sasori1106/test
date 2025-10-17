export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.items || data.items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No items provided" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate an order ID
    const orderId = `ord-${Date.now().toString().slice(-6)}`;
    
    // Create a new order object
    const newOrder = {
      id: orderId,
      status: data.status || "pending",
      orderDate: data.orderDate || new Date().toISOString(),
      totalAmount: data.totalAmount || 0,
      items: data.items || [],
      shipping: data.shipping || {}
    };
    
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
    
    // Add the new order to the orders array
    orders.push(newOrder);
    
    // In a real application, you would store this in a database
    // For this client-side only approach, we'll set a cookie
    
    // Set the updated orders in a cookie
    const encodedOrders = encodeURIComponent(JSON.stringify(orders));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order created successfully", 
        orderId 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `orders=${encodedOrders}; path=/; max-age=31536000; SameSite=Strict`
        } 
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Failed to create order" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}