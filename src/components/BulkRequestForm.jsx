// src/components/BulkRequestForm.jsx
import React, { useState } from 'react';
import api from '../lib/api';
import '../styles/components/BulkRequestForm.css';

export default function BulkRequestForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/bulk-requests', {
        name, email, phone, company, details
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert('Error sending bulk request');
    }
    setLoading(false);
  };

  return (
    <form className="bulk-request-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <label>
        Phone
        <input value={phone} onChange={e => setPhone(e.target.value)} />
      </label>
      <label>
        Company
        <input value={company} onChange={e => setCompany(e.target.value)} />
      </label>
      <label>
        Details
        <textarea value={details} onChange={e => setDetails(e.target.value)} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send Request'}
      </button>
    </form>
  );
}
