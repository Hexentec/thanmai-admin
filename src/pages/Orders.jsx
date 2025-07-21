import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';         // ← make sure this is here
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../lib/api';
import '../styles/pages/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data || []))
      .catch(err => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="orders-loading">Loading orders…</p>;

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Orders" />
        <div className="content-body">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Email</th><th>Total</th>
                <th>Payment</th><th>Order Status</th><th>Date</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map(o => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.email}</td>
                  <td>₹{(o.total||0).toFixed(2)}</td>
                  <td>{o.paymentStatus}</td>
                  <td>{o.orderStatus}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/orders/${o._id}`}
                      className="view-btn"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
