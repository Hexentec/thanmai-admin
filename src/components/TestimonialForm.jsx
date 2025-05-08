// src/components/TestimonialForm.jsx
import React, { useState } from 'react';
import api from '../lib/api';
import '../styles/components/Forms.css';

export default function TestimonialForm({ testimonial, onSuccess }) {
  const [authorName, setAuthorName] = useState(testimonial?.authorName || '');
  const [quote, setQuote] = useState(testimonial?.quote || '');
  const [rating, setRating] = useState(testimonial?.rating || 5);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('authorName', authorName);
      fd.append('quote', quote);
      fd.append('rating', rating);
      if (photoFile) fd.append('authorPhoto', photoFile);

      const url = testimonial
        ? `/testimonials/${testimonial._id}`
        : '/testimonials';
      const method = testimonial ? 'put' : 'post';

      const res = await api[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert('Error saving testimonial');
    }
    setLoading(false);
  };

  return (
    <form className="testimonial-form" onSubmit={handleSubmit}>
      <label>
        Author Name
        <input
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          required
        />
      </label>
      <label>
        Quote
        <textarea
          value={quote}
          onChange={e => setQuote(e.target.value)}
          required
        />
      </label>
      <label>
        Rating
        <input
          type="number"
          min="1" max="5"
          value={rating}
          onChange={e => setRating(e.target.value)}
        />
      </label>
      <label>
        Photo
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhotoFile(e.target.files[0])}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : testimonial ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
