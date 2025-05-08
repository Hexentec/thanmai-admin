// src/components/Header.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/components/Header.css';

export default function Header({ title }) {
  const { logout } = useContext(AuthContext);
  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
      <button className="header__logout" onClick={logout}>
        Logout
      </button>
    </header>
  );
}
