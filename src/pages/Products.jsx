import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import ProductForm from '../components/ProductForm';
import api from '../lib/api';
import '../styles/pages/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing]   = useState(null);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // when user clicks “Edit,” pull the full product record
 const handleEdit = async id => {
   try {
     const { data } = await api.get(`/products/${id}`);
     setEditing(data);
   } catch (err) {
     console.error('Failed to load product for editing', err);
     alert('Could not load product details');
   }
 };

  const handleSuccess = () => {
    setEditing(null);
    fetchProducts();
  };

  const columns = [
    { key: 'name',       header: 'Name' },
    { key: 'slug',       header: 'Slug' },
    {
      key: 'category',
      header: 'Category',
      render: row => row.category?.name || '-'
    },
    {
      key: 'variants',
      header: 'Variants',
      render: row => row.variants.length
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      render: row => row.isFeatured ? 'Yes' : 'No'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: row => (
        <button className="btn-action btn-edit" onClick={() => handleEdit(row._id)}>
          Edit
        </button>
      )
    }
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Products" />
        <div className="content-body">
          <button
            className="btn-action btn-new"
            onClick={() => setEditing({})}
          >
            + New Product
          </button>

          {editing && (
            <ProductForm
              product={editing}
              onSuccess={handleSuccess}
            />
          )}

          <DataTable
            columns={columns}
            data={products}
          />
        </div>
      </div>
    </div>
  );
}
