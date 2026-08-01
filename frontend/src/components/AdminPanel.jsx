import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Eye, Search, Calendar, Briefcase, Phone, Mail } from 'lucide-react';

const AdminPanel = () => {
  const [nannies, setNannies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE_URL}/api/nannies`);
        setNannies(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load nanny data. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchNannies();
  }, []);

  const filteredNannies = nannies.filter(nanny => 
    nanny.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nanny.mobile_number?.includes(searchTerm) ||
    nanny.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} color="#8b5cf6" /> Admin Dashboard
        </h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
          <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 40px', 
              borderRadius: '8px', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              background: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
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

      <div className="glass-container" style={{ padding: '24px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading data...</div>
        ) : filteredNannies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No registrations found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', color: '#9ca3af', fontWeight: '500' }}>ID</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontWeight: '500' }}>Candidate Name</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontWeight: '500' }}>Contact Info</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontWeight: '500' }}>Experience</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontWeight: '500' }}>Registered On</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontWeight: '500', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNannies.map((nanny) => (
                <tr key={nanny.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '16px', color: 'white' }}>#{nanny.id}</td>
                  <td style={{ padding: '16px', color: 'white', fontWeight: 'bold' }}>{nanny.full_name}</td>
                  <td style={{ padding: '16px', color: '#d1d5db' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Phone size={14} color="#8b5cf6" /> {nanny.mobile_number}
                    </div>
                    {nanny.email_address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Mail size={14} color="#8b5cf6" /> {nanny.email_address}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: '#d1d5db' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Briefcase size={16} color="#8b5cf6" /> {nanny.years_experience} Years
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#d1d5db' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#8b5cf6" /> 
                      {new Date(nanny.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <Link to={`/admin/nanny/${nanny.id}`} style={{ textDecoration: 'none' }}>
                      <button className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa' }}>
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
