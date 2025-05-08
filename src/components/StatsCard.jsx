// src/components/StatsCard.jsx
import React from 'react';
import '../styles/components/StatsCard.css';

export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="stats-card">
      <div className="stats-card__icon">
        {Icon && <Icon />}
      </div>
      <div className="stats-card__body">
        <div className="stats-card__title">{title}</div>
        <div className="stats-card__value">{value}</div>
      </div>
    </div>
  );
}
