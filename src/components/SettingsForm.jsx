// src/components/SettingsForm.jsx
import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import '../styles/components/Forms.css';

export default function SettingsForm() {
  const [settings, setSettings] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#A01d46');
  const [lightColor, setLightColor] = useState('#f5f5f5');
  const [marqueeTexts, setMarqueeTexts] = useState([]);
  const [footerText, setFooterText] = useState('');
  const [socialLinks, setSocialLinks] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/site-settings').then(res => {
      setSettings(res.data);
      setPrimaryColor(res.data.primaryColor);
      setLightColor(res.data.lightColor);
      setMarqueeTexts(res.data.marqueeTexts || []);
      setFooterText(res.data.footerText || '');
      setSocialLinks(res.data.socialLinks || {});
    });
  }, []);

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
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    }
    setLoading(false);
  };

  if (!settings) return <p>Loading…</p>;

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label>
        Primary Color
        <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
      </label>
      <label>
        Light Color
        <input type="color" value={lightColor} onChange={e => setLightColor(e.target.value)} />
      </label>
      <label>
        Marquee Texts (comma-separated)
        <input
          value={marqueeTexts.join(',')}
          onChange={e => setMarqueeTexts(e.target.value.split(','))}
        />
      </label>
      <label>
        Footer Text
        <input value={footerText} onChange={e => setFooterText(e.target.value)} />
      </label>
      <fieldset>
        <legend>Social Links</legend>
        <label>
          Facebook
          <input
            value={socialLinks.facebook || ''}
            onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
          />
        </label>
        <label>
          Instagram
          <input
            value={socialLinks.instagram || ''}
            onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
          />
        </label>
        <label>
          WhatsApp
          <input
            value={socialLinks.whatsapp || ''}
            onChange={e => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
          />
        </label>
      </fieldset>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  );
}
