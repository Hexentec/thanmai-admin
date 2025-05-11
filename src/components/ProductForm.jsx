'use client';

import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import '../styles/components/ProductsForm.css';

export default function ProductForm({ product = {}, onSuccess }) {
  // Basic info
  const [name, setName]       = useState(product.name || '');
  const [slug, setSlug]       = useState(product.slug || '');
  const [category, setCategory] = useState(product.category?._id || '');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState(product.description || '');

  // Pricing
  const [price, setPrice]               = useState(product.price || '');
  const [discountedPrice, setDiscountedPrice] = useState(product.discountedPrice || '');
  const [discountPercent, setDiscountPercent] = useState(product.discountPercent || 0);

  // Variations
  const [variations, setVariations] = useState(
    product.variations?.map(v => ({
      weight: v.weight,
      price: v.price,
      discountedPrice: v.discountedPrice,
      discountPercent: v.discountPercent
    })) || []
  );

  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  // Recalculate main discount%
  useEffect(() => {
    const p = parseFloat(price);
    const d = parseFloat(discountedPrice);
    if (!isNaN(p) && !isNaN(d) && p > 0) {
      setDiscountPercent(Math.round(((p - d) / p) * 100));
    } else {
      setDiscountPercent(0);
    }
  }, [price, discountedPrice]);

  // Handlers for variations
  const addVariation = () => {
    setVariations(prev => [
      ...prev,
      { weight: '', price: '', discountedPrice: '', discountPercent: 0 }
    ]);
  };

  const updateVariation = (idx, field, value) => {
    setVariations(prev => {
      const arr = [...prev];
      arr[idx][field] = value;
      // recalc discount% if price or discountedPrice changed
      const p = parseFloat(arr[idx].price);
      const d = parseFloat(arr[idx].discountedPrice);
      if (!isNaN(p) && !isNaN(d) && p > 0) {
        arr[idx].discountPercent = Math.round(((p - d) / p) * 100);
      } else {
        arr[idx].discountPercent = 0;
      }
      return arr;
    });
  };

  const removeVariation = idx => {
    setVariations(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append('name', name);
    fd.append('slug', slug);
    fd.append('category', category);
    fd.append('description', description);
    fd.append('price', price);
    fd.append('discountedPrice', discountedPrice);
    fd.append('discountPercent', discountPercent);
    fd.append('variations', JSON.stringify(variations));

    const url    = product._id ? `/products/${product._id}` : '/products';
    const method = product._id ? 'put' : 'post';

    try {
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
      {/* Basic Info */}
      <div className="card">
        <h3 className="card-header">Basic Information</h3>
        <div className="card-body two-col">
          <div className="field-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label>Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
          </div>
          <div className="field-group full-width">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="card">
        <h3 className="card-header">Pricing</h3>
        <div className="card-body grid-pricing">
          <div className="field-group">
            <label>Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Discounted Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={discountedPrice}
              onChange={e => setDiscountedPrice(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>Discount %</label>
            <input
              type="text"
              value={discountPercent + '%'}
              readOnly
            />
          </div>
          <div className="field-group">
            <label>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Variations */}
      <div className="card">
        <h3 className="card-header">
          Variations
          <button
            type="button"
            className="btn-add"
            onClick={addVariation}
          >
            <FiPlus /> Add Variation
          </button>
        </h3>
        <div className="card-body">
          {variations.map((v, i) => (
            <div key={i} className="variation-row">
              <input
                className="var-field var-weight"
                placeholder="Weight (e.g. 200g)"
                value={v.weight}
                onChange={e => updateVariation(i, 'weight', e.target.value)}
              />
              <input
                className="var-field var-price"
                placeholder="Price (₹)"
                type="number"
                step="0.01"
                value={v.price}
                onChange={e => updateVariation(i, 'price', e.target.value)}
              />
              <input
                className="var-field var-disc-price"
                placeholder="Disc. Price (₹)"
                type="number"
                step="0.01"
                value={v.discountedPrice}
                onChange={e => updateVariation(i, 'discountedPrice', e.target.value)}
              />
              <input
                className="var-field var-disc-percent"
                placeholder="% Off"
                value={v.discountPercent + '%'}
                readOnly
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeVariation(i)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save Product'}
      </button>
    </form>
  );
}
