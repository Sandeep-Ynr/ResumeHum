import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Eye, Search, Calendar, Briefcase, Phone, Mail } from 'lucide-react';

const AdminPanel = () => {
  const [nannies, setNannies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Settings State
  const [receiverEmail, setReceiverEmail] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE_URL}/api/nannies`);
        setNannies(response.data);
        
        // Fetch Settings
        const settingsRes = await axios.get(`${API_BASE_URL}/api/settings`);
        if (settingsRes.data && settingsRes.data.receiver_email) {
          setReceiverEmail(settingsRes.data.receiver_email);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load nanny data. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchNannies();
  }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE_URL}/api/settings`, { receiver_email: receiverEmail });
      setSettingsMessage('Settings saved successfully!');
      setTimeout(() => setSettingsMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSettingsMessage('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredNannies = nannies.filter(nanny => 
    nanny.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nanny.mobile_number?.includes(searchTerm) ||
    nanny.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} color="var(--primary)" /> Admin Dashboard
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
          <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 40px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--input-bg)',
              color: 'var(--text-primary)',
              outline: 'none'
            }} 
          />
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Settings Section */}
      <div className="glass-container" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.2rem' }}>Email Notifications</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Set the receiver email address for new nanny registrations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="email" 
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            placeholder="admin@example.com"
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--input-bg)',
              color: 'var(--text-primary)',
              outline: 'none',
              width: '250px'
            }} 
          />
          <button 
            className="btn" 
            onClick={saveSettings}
            disabled={savingSettings}
            style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}
          >
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
          {settingsMessage && (
            <span style={{ color: settingsMessage.includes('successfully') ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>
              {settingsMessage}
            </span>
          )}
        </div>
      </div>

      <div className="glass-container" style={{ padding: '24px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading data...</div>
        ) : filteredNannies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No registrations found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>ID</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Candidate Name</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Contact Info</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Experience</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Registered On</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNannies.map((nanny) => (
                <tr key={nanny.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>#{nanny.id}</td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{nanny.full_name}</td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Phone size={14} color="var(--primary)" /> {nanny.mobile_number}
                    </div>
                    {nanny.email_address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Mail size={14} color="var(--primary)" /> {nanny.email_address}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Briefcase size={16} color="var(--primary)" /> {nanny.years_experience} Years
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="var(--primary)" /> 
                      {new Date(nanny.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <Link to={`/admin/nanny/${nanny.id}`} style={{ textDecoration: 'none' }}>
                      <button className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <Eye size={16} /> View Profile
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
