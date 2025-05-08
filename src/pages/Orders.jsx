// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import api from '../lib/api';
import '../styles/pages/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data));
  }, []);

  const columns = [
    { key: '_id', header: 'ID' },
    { key: 'user.email', header: 'Customer', render: row => row.user?.email },
    { key: 'total', header: 'Total (₹)' },
    { key: 'paymentStatus', header: 'Status' },
    { key: 'createdAt', header: 'Date', render: row => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Orders" />
        <div className="content-body">
          <DataTable columns={columns} data={orders} />
        </div>
      </div>
    </div>
  );
}
