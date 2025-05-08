// src/components/BlogForm.jsx
import React, { useState } from 'react';
import api from '../lib/api';
import '../styles/components/Forms.css';

export default function BlogForm({ post, onSuccess }) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('excerpt', excerpt);
      fd.append('content', content);
      fd.append('slug', slug);
      if (coverFile) fd.append('coverImage', coverFile);

      const url = post
        ? `/blog-posts/${post._id}`
        : '/blog-posts';
      const method = post ? 'put' : 'post';

      const res = await api[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert('Error saving blog post');
    }
    setLoading(false);
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Excerpt
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
        />
      </label>
      <label>
        Content
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
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
        Cover Image
        <input
          type="file"
          accept="image/*"
          onChange={e => setCoverFile(e.target.files[0])}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : post ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
