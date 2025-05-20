// src/components/ProductForm.jsx
import React, { useState, useEffect, Fragment } from 'react';
import api from '../lib/api';
import { FiUpload, FiInfo, FiPlus, FiTrash2 } from 'react-icons/fi';
import '../styles/components/ProductsForm.css';

export default function ProductForm({ product = {}, onSuccess }) {
  // State
  const [name, setName]         = useState(product.name || '');
  const [slug, setSlug]         = useState(product.slug || '');
  const [category, setCategory] = useState(product.category?._id || '');
  const [categories, setCategories] = useState([]);

  const [description, setDescription] = useState(product.description || '');
  const [ingredients, setIngredients] = useState(product.ingredients || '');

  const [isFeatured, setIsFeatured] = useState(!!product.isFeatured);
  const [isMustTry, setIsMustTry]   = useState(!!product.isMustTry);

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews]     = useState(product.images || []);

  const [variations, setVariations] = useState(
    product.variants?.map(v => ({ ...v })) || []
  );

  const [loading, setLoading] = useState(false);

  // Load categories
  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

  // Image previews
  useEffect(() => {
    if (imageFiles.length) {
      const urls = imageFiles.map(f => URL.createObjectURL(f));
      setPreviews(urls);
      return () => urls.forEach(URL.revokeObjectURL);
    }
  }, [imageFiles]);

  // Variation handlers
  const addVar = () => setVariations(v => [...v, { weight:'', price:'', discountedPrice:'', discountPercent:0 }]);
  const updateVar = (i, field, val) => {
    setVariations(v => {
      const c = [...v];
      c[i][field] = val;
      const p= parseFloat(c[i].price), d=parseFloat(c[i].discountedPrice);
      c[i].discountPercent = p>0&&!isNaN(d)?Math.round(((p-d)/p)*100):0;
      return c;
    });
  };
  const removeVar = i => setVariations(v => v.filter((_,idx)=>idx!==i));

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('slug', slug);
      fd.append('category', category);
      fd.append('description', description);
      fd.append('ingredients', ingredients);
      fd.append('isFeatured', isFeatured);
      fd.append('isMustTry', isMustTry);
      imageFiles.forEach(f => fd.append('images', f));
      fd.append('variants', JSON.stringify(variations));

      const url    = product._id ? `/products/${product._id}` : '/products';
      const method = product._id ? 'put' : 'post';
      await api[method](url, fd);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving');
    }
    setLoading(false);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {/* -- Basic Info -- */}
      <div className="card">
        <h3 className="card-header">Basic Info</h3>
        <div className="card-body two-col">
          <div className="field-group">
            <label>Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} required/>
          </div>
          <div className="field-group">
            <label>Slug *</label>
            <input value={slug} onChange={e=>setSlug(e.target.value)} required/>
          </div>
          <div className="field-group">
            <label>Category *</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} required>
              <option value="">—</option>
              {categories.map(c=>(
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field-group full-width">
            <label>Description</label>
            <textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)}/>
          </div>
          <div className="field-group full-width">
            <label>Ingredients</label>
            <textarea rows={2} value={ingredients} onChange={e=>setIngredients(e.target.value)}/>
          </div>
        </div>
      </div>

      {/* -- Features & Images -- */}
      <div className="card">
        <h3 className="card-header">Features & Images</h3>
        <div className="card-body two-col">
          <label className="checkbox-group">
            <input type="checkbox" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)}/>
            Featured <FiInfo className="info-icon"/>
          </label>
          <label className="checkbox-group">
            <input type="checkbox" checked={isMustTry} onChange={e=>setIsMustTry(e.target.checked)}/>
            Must Try <FiInfo className="info-icon"/>
          </label>
          <label className="upload-box full-width">
            <div className="upload-inner"><FiUpload/> Upload Images</div>
            <input type="file" accept="image/*" multiple onChange={e=>setImageFiles(Array.from(e.target.files))}/>
          </label>
          <div className="preview-container full-width">
            {previews.map((src,i)=><img key={i} src={src} className="preview"/>)}
          </div>
        </div>
      </div>

      {/* -- Variations -- */}
      <div className="card">
        <h3 className="card-header">
          Variations
          <button type="button" className="btn-add" onClick={addVar}><FiPlus/> Add</button>
        </h3>
        <div className="card-body variation-grid">
          {variations.map((v,i)=>(
            <Fragment key={i}>
              <input
                className="var-field"
                placeholder="Weight"
                value={v.weight}
                onChange={e=>updateVar(i,'weight',e.target.value)}
              />
              <input
                className="var-field"
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={e=>updateVar(i,'price',e.target.value)}
              />
              <input
                className="var-field"
                type="number"
                placeholder="Discounted"
                value={v.discountedPrice}
                onChange={e=>updateVar(i,'discountedPrice',e.target.value)}
              />
              <input
                className="var-field"
                placeholder="% Off"
                readOnly
                value={v.discountPercent+'%'}
              />
              <button className="btn-remove" type="button" onClick={()=>removeVar(i)}>
                <FiTrash2/>
              </button>
            </Fragment>
          ))}
        </div>
      </div>

      <button className="btn-submit" disabled={loading}>
        {loading ? 'Saving…' : product._id ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
