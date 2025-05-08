// src/pages/BulkRequests.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import api from '../lib/api';
import '../styles/pages/BulkRequests.css';

export default function BulkRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('/bulk-requests').then(res => setRequests(res.data));
  }, []);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'company', header: 'Company' },
    { key: 'sentAt', header: 'Date', render: row => new Date(row.sentAt).toLocaleString() },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Bulk Requests" />
        <div className="content-body">
          <DataTable columns={columns} data={requests} />
        </div>
      </div>
    </div>
  );
}
