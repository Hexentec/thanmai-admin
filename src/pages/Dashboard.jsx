// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import api from '../lib/api';
import '../styles/pages/Dashboard.css';
import { ShoppingCartOutlined, DatabaseOutlined, TeamOutlined } from '@ant-design/icons';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/products').then(res => res.data.length),
      api.get('/orders').then(res => res.data.length),
      api.get('/users').then(res => res.data.length).catch(() => 0) // if you add user list
    ]).then(([p, o, u]) => setStats({ products: p, orders: o, users: u }));
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Dashboard" />
        <div className="stats-row">
          <StatsCard title="Products" value={stats.products} icon={DatabaseOutlined} />
          <StatsCard title="Orders" value={stats.orders} icon={ShoppingCartOutlined} />
          <StatsCard title="Users" value={stats.users} icon={TeamOutlined} />
        </div>
      </div>
    </div>
  );
}
