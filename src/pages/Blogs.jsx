// src/pages/Blogs.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import BlogForm from '../components/BlogForm';
import api from '../lib/api';
import '../styles/pages/Blogs.css';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetch = async () => setPosts((await api.get('/blog-posts')).data);

  useEffect(() => { fetch(); }, []);

  const handleSuccess = () => {
    setEditing(null);
    fetch();
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    { key: 'publishedAt', header: 'Published', render: row => new Date(row.publishedAt).toLocaleDateString() },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Blogs" />
        <div className="content-body">
          <button className="btn-new" onClick={() => setEditing({})}>
            + New Post
          </button>
          {editing && (
            <BlogForm post={editing} onSuccess={handleSuccess} />
          )}
          <DataTable columns={columns} data={posts} />
        </div>
      </div>
    </div>
  );
}
