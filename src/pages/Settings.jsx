// src/pages/Settings.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SettingsForm from '../components/SettingsForm';
import '../styles/pages/Settings.css';

export default function Settings() {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Settings" />
        <div className="content-body">
          <SettingsForm />
        </div>
      </div>
    </div>
  );
}
