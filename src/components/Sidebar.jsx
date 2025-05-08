// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/Sidebar.css';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar__logo">🍯 Pickle Shop</div>
      <ul className="sidebar__nav">
        <li><NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink></li>
        <li><NavLink to="/products" activeClassName="active">Products</NavLink></li>
        <li><NavLink to="/categories" activeClassName="active">Categories</NavLink></li>
        <li><NavLink to="/orders" activeClassName="active">Orders</NavLink></li>
        <li><NavLink to="/bulk-requests" activeClassName="active">Bulk Requests</NavLink></li>
        <li><NavLink to="/testimonials" activeClassName="active">Testimonials</NavLink></li>
        <li><NavLink to="/blogs" activeClassName="active">Blogs</NavLink></li>
        <li><NavLink to="/settings" activeClassName="active">Settings</NavLink></li>
      </ul>
    </nav>
);
}
