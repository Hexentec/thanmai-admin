import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import '../styles/components/CategoryForm.css'; // same styles

export default function TestimonialForm({ testimonial = {}, onSuccess }) {
  const [authorName, setAuthorName] = useState(testimonial.authorName || '');
  const [quote, setQuote]           = useState(testimonial.quote || '');
  const [rating, setRating]         = useState(testimonial.rating || 5);
  const [photoFile, setPhotoFile]   = useState(null);

  // Start with existing photo URL if editing
  const [previewUrl, setPreviewUrl] = useState(testimonial.authorPhoto || null);
  const [loading, setLoading]       = useState(false);

  // Clean up URL object on unmount or change
  useEffect(() => {
    return () => {
      if (photoFile && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [photoFile, previewUrl]);

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('authorName', authorName);
      fd.append('quote', quote);
      fd.append('rating', rating);
      if (photoFile) fd.append('authorPhoto', photoFile);

      const isEdit = Boolean(testimonial._id);
      const url    = isEdit
        ? `/testimonials/${testimonial._id}`
        : '/testimonials';
      const method = isEdit ? 'put' : 'post';

      const res = await api[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving testimonial');
    }
    setLoading(false);
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label>Author Name <span className="required">*</span></label>
        <input
          type="text"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          placeholder="e.g. Jane Doe"
          required
        />
      </div>

      <div className="field-group">
        <label>Quote <span className="required">*</span></label>
        <textarea
          rows={3}
          value={quote}
          onChange={e => setQuote(e.target.value)}
          placeholder="What they said..."
          required
        />
      </div>

      <div className="field-group">
        <label>Rating (1–5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(e.target.value)}
        />
      </div>

      <div className="field-group">
        <label>Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </div>

      {previewUrl && (
        <div className="preview-container">
          <img
            src={previewUrl}
            alt="Author preview"
            className="preview-image"
          />
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading
          ? 'Saving…'
          : testimonial._id
            ? 'Update Testimonial'
            : 'Create Testimonial'
        }
      </button>
    </form>
  );
}
