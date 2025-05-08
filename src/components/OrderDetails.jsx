// src/components/OrderDetails.jsx
import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import '../styles/components/OrderDetails.css';

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(console.error);
  }, [orderId]);

  if (!order) return <p>Loading order…</p>;

  return (
    <div className="order-details">
      <h2>Order #{order._id}</h2>
      <p>Status: {order.paymentStatus}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map(item => (
          <li key={item._id}>
            {item.product.name} &times; {item.quantity} @ ₹{item.price}
          </li>
        ))}
      </ul>
      <p>Subtotal: ₹{order.subtotal}</p>
      <p>Shipping: ₹{order.shippingFee}</p>
      <p><strong>Total: ₹{order.total}</strong></p>
    </div>
  );
}
