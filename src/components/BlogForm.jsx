import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import '../styles/components/BlogForm.css';

export default function BlogForm({ post = {}, onSuccess }) {
  const [title, setTitle]       = useState(post.title || '');
  const [excerpt, setExcerpt]   = useState(post.excerpt || '');
  const [content, setContent]   = useState(post.content || '');
  const [slug, setSlug]         = useState(post.slug || '');
  const [coverFile, setCoverFile] = useState(null);

  // preview URL will start as existing coverImage (if any)
  const [previewUrl, setPreviewUrl] = useState(post.coverImage || null);
  const [loading, setLoading]     = useState(false);

  // Clean up object URL when coverFile changes or unmounts
  useEffect(() => {
    return () => {
      if (coverFile && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [coverFile, previewUrl]);

  const handleCoverChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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

      const isEdit = Boolean(post && post._id);
      const url    = isEdit
        ? `/blog-posts/${post._id}`
        : '/blog-posts';
      const method = isEdit ? 'put' : 'post';

      const res = await api[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving blog post');
    }
    setLoading(false);
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label>Title <span className="required">*</span></label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Blog title"
          required
        />
      </div>

      <div className="field-group">
        <label>Excerpt</label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Short summary"
        />
      </div>

      <div className="field-group">
        <label>Content <span className="required">*</span></label>
        <textarea
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Full blog content"
          required
        />
      </div>

      <div className="field-group">
        <label>Slug <span className="required">*</span></label>
        <input
          type="text"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="blog-post-slug"
          required
        />
      </div>

      <div className="field-group">
        <label>Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
        />
      </div>

      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="Cover preview" className="preview-image" />
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : post._id ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
}
