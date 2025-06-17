// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import api from '../lib/api';
import '../styles/pages/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  const handleEdit = (order) => {
    setEditingId(order._id);
    setStatusUpdate(order.orderStatus);
    setTrackingUrl(order.courierTrackingUrl || '');
  };

  const handleSave = async (id) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, {
        status: statusUpdate,
        trackingUrl
      });
      setOrders(orders.map(o => o._id === id ? data : o));
      setEditingId(null);
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update order.');
    }
  };

  const columns = [
    { key: '_id', header: 'ID' },
    { key: 'user.email', header: 'Customer', render: row => row.user?.email },
    { key: 'total', header: 'Total (₹)' },
    {
      key: 'orderStatus', header: 'Status', render: row => (
        editingId === row._id ? (
          <select value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}>
            <option value="created">Created</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        ) : (
          <span className={`status-tag ${row.orderStatus}`}>{row.orderStatus}</span>
        )
      )
    },
    {
      key: 'tracking', header: 'Courier Link', render: row => (
        editingId === row._id ? (
          <input
            className="tracking-input"
            type="text"
            value={trackingUrl}
            placeholder="Tracking URL"
            onChange={e => setTrackingUrl(e.target.value)}
          />
        ) : (
          row.courierTrackingUrl ? (
            <a href={row.courierTrackingUrl} target="_blank">Link</a>
          ) : (
            '-' )
        )
      )
    },
    {
      key: 'actions', header: 'Actions', render: row => (
        editingId === row._id ? (
          <button className="save-btn" onClick={() => handleSave(row._id)}>Save</button>
        ) : (
          <button className="edit-btn" onClick={() => handleEdit(row)}>Edit</button>
        )
      )
    }
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Orders Management" />
        <div className="content-body">
          <DataTable columns={columns} data={orders} />
        </div>
      </div>
    </div>
  );
}
