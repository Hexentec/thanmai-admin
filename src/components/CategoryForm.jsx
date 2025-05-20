import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import '../styles/components/CategoryForm.css';

export default function CategoryForm({ category, onSuccess }) {
  const [name, setName]         = useState(category?.name || '');
  const [slug, setSlug]         = useState(category?.slug || '');
  const [order, setOrder]       = useState(category?.order ?? 0);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(category?.image || null);
  const [loading, setLoading]   = useState(false);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, imageFile]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('order', order);
      if (imageFile) formData.append('image', imageFile);

      const isEdit = !!(category && category._id);
      const url    = isEdit
        ? `/categories/${category._id}`
        : '/categories';
      const method = isEdit ? 'put' : 'post';

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
      <div className="field-group">
        <label>Name <span className="required">*</span></label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Veg Pickles"
          required
        />
      </div>

      <div className="field-group">
        <label>Slug <span className="required">*</span></label>
        <input
          type="text"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="e.g. veg-pickles"
          required
        />
      </div>

      <div className="field-group">
        <label>Order</label>
        <input
          type="number"
          value={order}
          onChange={e => setOrder(e.target.value)}
          min="0"
        />
      </div>

      <div className="field-group">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {previewUrl && (
        <div className="preview-container">
          <img
            src={previewUrl}
            alt="Category preview"
            className="preview-image"
          />
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading
          ? 'Saving…'
          : category && category._id
            ? 'Update Category'
            : 'Create Category'
        }
      </button>
    </form>
  );
}
