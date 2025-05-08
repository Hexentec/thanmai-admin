// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import '../styles/components/Forms.css';

export default function ProductForm({ product, onSuccess }) {
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [category, setCategory] = useState(product?.category?._id || '');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('slug', slug);
      fd.append('category', category);
      imageFiles.forEach(file => fd.append('images', file));

      const url = product
        ? `/products/${product._id}`
        : '/products';
      const method = product ? 'put' : 'post';

      const res = await api[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
    setLoading(false);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
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
        Category
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">Select</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Images
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setImageFiles(Array.from(e.target.files))}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : product ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
