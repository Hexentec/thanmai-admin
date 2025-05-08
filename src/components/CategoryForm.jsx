// src/components/CategoryForm.jsx
import React, { useState } from 'react';
import api from '../lib/api';
import '../styles/components/Forms.css';

export default function CategoryForm({ category, onSuccess }) {
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [order, setOrder] = useState(category?.order || 0);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('order', order);
      if (imageFile) formData.append('image', imageFile);

      const url = category
        ? `/categories/${category._id}`
        : '/categories';
      const method = category ? 'put' : 'post';

      const res = await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving category');
    }
    setLoading(false);
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Slug
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
        />
      </label>
      <label>
        Order
        <input
          type="number"
          value={order}
          onChange={e => setOrder(e.target.value)}
        />
      </label>
      <label>
        Image
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : category ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
