// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import ProductForm from '../components/ProductForm';
import api from '../lib/api';
import '../styles/pages/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => {
    setEditing(null);
    fetchProducts();
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { key: 'category', header: 'Category', render: row => row.category?.name },
    { key: 'variants', header: 'Variants', render: row => row.variants.length },
    { key: 'isFeatured', header: 'Featured', render: row => row.isFeatured ? 'Yes' : 'No' },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Products" />
        <div className="content-body">
          <button className="btn-new" onClick={() => setEditing({})}>
            + New Product
          </button>
          {editing && (
            <ProductForm product={editing} onSuccess={handleSuccess} />
          )}
          <DataTable columns={columns} data={products} />
        </div>
      </div>
    </div>
  );
}
