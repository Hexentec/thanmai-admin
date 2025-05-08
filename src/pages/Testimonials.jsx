// src/pages/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import TestimonialForm from '../components/TestimonialForm';
import api from '../lib/api';
import '../styles/pages/Testimonials.css';

export default function Testimonials() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetch = async () => setList((await api.get('/testimonials')).data);

  useEffect(() => { fetch(); }, []);

  const handleSuccess = () => {
    setEditing(null);
    fetch();
  };

  const columns = [
    { key: 'authorName', header: 'Author' },
    { key: 'quote', header: 'Quote' },
    { key: 'rating', header: 'Rating' },
    { key: 'createdAt', header: 'Date', render: row => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Testimonials" />
        <div className="content-body">
          <button className="btn-new" onClick={() => setEditing({})}>
            + New Testimonial
          </button>
          {editing && (
            <TestimonialForm testimonial={editing} onSuccess={handleSuccess} />
          )}
          <DataTable columns={columns} data={list} />
        </div>
      </div>
    </div>
  );
}
