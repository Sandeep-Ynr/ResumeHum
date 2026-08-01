import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Shield, Briefcase, Star, HeartPulse, MapPin, Phone, Mail, FileText, CheckCircle, XCircle, Eye, Users } from 'lucide-react';

const NannyDetails = () => {
  const { id } = useParams();
  const [nanny, setNanny] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNannyDetails = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE_URL}/api/nannies/${id}`);
        setNanny(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load candidate details.');
      } finally {
        setLoading(false);
      }
    };
    fetchNannyDetails();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'var(--error)', textAlign: 'center', padding: '60px' }}>{error}</div>;
  if (!nanny) return <div style={{ color: 'white', textAlign: 'center', padding: '60px' }}>Candidate not found.</div>;

  const renderBoolean = (val) => val ? <CheckCircle size={18} color="var(--success)" /> : <XCircle size={18} color="var(--error)" />;

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/admin" className="no-print" style={{ textDecoration: 'none', color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()} 
          className="btn btn-primary no-print" 
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <FileText size={16} /> Download PDF
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', color: 'white', margin: '0 0 8px 0' }}>{nanny.full_name}</h2>
          <p style={{ color: '#9ca3af', margin: 0, display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> {nanny.mobile_number}</span>
            {nanny.email_address && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> {nanny.email_address}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {nanny.current_city || 'N/A'}</span>
          </p>
        </div>
        <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
          ID: #{nanny.id}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Personal Details */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#8b5cf6" /> Personal Information
          </h3>
          <table style={{ width: '100%', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af', width: '40%' }}>Date of Birth</td><td style={{ color: 'white' }}>{new Date(nanny.dob).toLocaleDateString()}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Gender</td><td style={{ color: 'white' }}>{nanny.gender}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Nationality</td><td style={{ color: 'white' }}>{nanny.nationality}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Current Address</td><td style={{ color: 'white' }}>{`${nanny.current_address}, ${nanny.current_area || ''}, ${nanny.current_city || ''}, ${nanny.current_state || ''} - ${nanny.current_pincode || ''}`}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Highest Qualification</td><td style={{ color: 'white' }}>{nanny.highest_qualification || 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Languages</td><td style={{ color: 'white' }}>English (Read: {renderBoolean(nanny.can_read_english)}, Speak: {renderBoolean(nanny.can_speak_english)}), Hindi (Read: {renderBoolean(nanny.can_read_hindi)})</td></tr>
            </tbody>
          </table>
        </section>

        {/* Work Details */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="#8b5cf6" /> Professional Preferences
          </h3>
          <table style={{ width: '100%', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af', width: '40%' }}>Experience</td><td style={{ color: 'white' }}>{nanny.years_experience} Years</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Job Type</td><td style={{ color: 'white' }}>{nanny.preferred_job_type}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Expected Salary</td><td style={{ color: 'white' }}>₹{nanny.expected_salary || 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Available From</td><td style={{ color: 'white' }}>{nanny.available_from ? new Date(nanny.available_from).toLocaleDateString() : 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Working Hours</td><td style={{ color: 'white' }}>{nanny.available_working_hours}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Willing to Travel</td><td style={{ color: 'white' }}>{renderBoolean(nanny.willing_to_travel)}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Live-in Option</td><td style={{ color: 'white' }}>{renderBoolean(nanny.live_in_option)}</td></tr>
            </tbody>
          </table>
        </section>

        {/* Skills */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} color="#8b5cf6" /> Verified Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {nanny.skills && nanny.skills.length > 0 ? nanny.skills.map((skill, idx) => (
              <span key={idx} style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#d8b4fe', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem' }}>
                {skill}
              </span>
            )) : <span style={{ color: '#9ca3af' }}>No specific skills selected.</span>}
          </div>
        </section>

        {/* Medical & Background */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={20} color="#8b5cf6" /> Medical & Background
          </h3>
          <table style={{ width: '100%', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af', width: '50%' }}>Medical Conditions</td><td style={{ color: 'white' }}>{renderBoolean(nanny.medical_condition)} {nanny.medical_condition_details}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Allergies</td><td style={{ color: 'white' }}>{renderBoolean(nanny.allergies)} {nanny.allergies_details}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Blood Group</td><td style={{ color: 'white' }}>{nanny.blood_group || 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Convicted of Crime</td><td style={{ color: 'white' }}>{renderBoolean(nanny.convicted_crime)}</td></tr>
              <tr><td style={{ padding: '8px 0', color: '#9ca3af' }}>Police Verification</td><td style={{ color: 'white' }}>{renderBoolean(nanny.police_verification)}</td></tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* References and Documents */}
      <div className="grid-2" style={{ gap: '24px', marginTop: '24px' }}>
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#8b5cf6" /> References
          </h3>
          {nanny.references && nanny.references.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {nanny.references.map((ref, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{ref.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '8px' }}>{ref.relationship}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d1d5db' }}><Phone size={14} /> {ref.phone_number}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ color: '#9ca3af' }}>No references provided.</div>}
        </section>

        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#8b5cf6" /> Uploaded Documents
          </h3>
          {nanny.documents && nanny.documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '8px' }}>
                <strong>ID Type:</strong> {nanny.gov_id_type} ({nanny.gov_id_number})
              </div>
              {nanny.documents.map((doc, idx) => {
                const docUrl = doc.file_path.startsWith('http') 
                  ? doc.file_path 
                  : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${doc.file_path}`;
                return (
                <a 
                  key={idx} 
                  href={docUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px', color: '#d8b4fe', textDecoration: 'none', transition: 'all 0.2s' }}
                  className="document-link"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={18} />
                    <span style={{ textTransform: 'capitalize' }}>{doc.document_type.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                  <Eye size={16} />
                </a>
                );
              })}
            </div>
          ) : <div style={{ color: '#9ca3af' }}>No documents uploaded.</div>}
        </section>
      </div>

    </div>
  );
};

export default NannyDetails;
