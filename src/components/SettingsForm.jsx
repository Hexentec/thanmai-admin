// src/components/SettingsForm.jsx
import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import '../styles/components/SettingsForm.css';

export default function SettingsForm() {
  const [settings, setSettings]         = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#A01d46');
  const [lightColor, setLightColor]     = useState('#f5f5f5');
  const [marqueeTexts, setMarqueeTexts] = useState([]);
  const [footerText, setFooterText]     = useState('');
  const [socialLinks, setSocialLinks]   = useState({});
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    api.get('/site-settings').then(res => {
      const s = res.data;
      setSettings(s);
      setPrimaryColor(s.primaryColor);
      setLightColor(s.lightColor);
      setMarqueeTexts(s.marqueeTexts || []);
      setFooterText(s.footerText || '');
      setSocialLinks(s.socialLinks || {});
    });
  }, []);

  if (!settings) return <p>Loading…</p>;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/site-settings', {
        primaryColor,
        lightColor,
        marqueeTexts,
        footerText,
        socialLinks
      });
      alert('Settings updated');
    } catch {
      alert('Error saving settings');
    }
    setLoading(false);
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>

      {/* Primary Color */}
      <div className="field-group color-group">
        <label>Primary Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={primaryColor}
            onChange={e => setPrimaryColor(e.target.value)}
          />
          <span className="color-code">{primaryColor}</span>
        </div>
      </div>

      {/* Light Color */}
      <div className="field-group color-group">
        <label>Light Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={lightColor}
            onChange={e => setLightColor(e.target.value)}
          />
          <span className="color-code">{lightColor}</span>
        </div>
      </div>

      {/* Marquee Texts */}
      <div className="field-group">
        <label>Marquee Texts (comma-separated)</label>
        <input
          type="text"
          value={marqueeTexts.join(',')}
          onChange={e => setMarqueeTexts(e.target.value.split(','))}
          placeholder="e.g. Free shipping,New arrivals,Seasonal sale"
        />
      </div>

      {/* Footer Text */}
      <div className="field-group">
        <label>Footer Text</label>
        <input
          type="text"
          value={footerText}
          onChange={e => setFooterText(e.target.value)}
          placeholder="© 2025 Thanmai Home Foods. All rights reserved."
        />
      </div>

      {/* Social Links */}
      <fieldset className="social-fieldset">
        <legend>Social Links</legend>
        {['facebook', 'instagram', 'whatsapp'].map(key => (
          <div className="field-group" key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              value={socialLinks[key] || ''}
              onChange={e =>
                setSocialLinks({ ...socialLinks, [key]: e.target.value })
              }
              placeholder={`https://www.${key}.com/yourpage`}
            />
          </div>
        ))}
      </fieldset>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  );
}
