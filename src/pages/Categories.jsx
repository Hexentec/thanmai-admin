// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import CategoryForm from '../components/CategoryForm';
import api from '../lib/api';
import '../styles/pages/Categories.css';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetch = async () => setCats((await api.get('/categories')).data);

  useEffect(() => { fetch(); }, []);

  const handleSuccess = () => {
    setEditing(null);
    fetch();
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { key: 'order', header: 'Order' },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Categories" />
        <div className="content-body">
          <button className="btn-new" onClick={() => setEditing({})}>
            + New Category
          </button>
          {editing && (
            <CategoryForm category={editing} onSuccess={handleSuccess} />
          )}
          <DataTable columns={columns} data={cats} />
        </div>
      </div>
    </div>
  );
}
