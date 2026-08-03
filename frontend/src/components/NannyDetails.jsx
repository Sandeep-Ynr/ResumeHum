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

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-primary)' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'var(--error)', textAlign: 'center', padding: '60px' }}>{error}</div>;
  if (!nanny) return <div style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '60px' }}>Candidate not found.</div>;

  const renderBoolean = (val) => val ? <CheckCircle size={18} color="var(--success)" /> : <XCircle size={18} color="var(--error)" />;

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link to="/admin" className="no-print" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{nanny.full_name}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> {nanny.mobile_number}</span>
            {nanny.email_address && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> {nanny.email_address}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {nanny.current_city || 'N/A'}</span>
          </p>
        </div>
        <div style={{ background: 'var(--primary-light)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
          ID: #{nanny.id}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Personal Details */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--primary)" /> Personal Information
          </h3>
          <table style={{ width: '100%', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)', width: '40%' }}>Date of Birth</td><td style={{ color: 'var(--text-primary)' }}>{new Date(nanny.dob).toLocaleDateString()}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Gender</td><td style={{ color: 'var(--text-primary)' }}>{nanny.gender}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Nationality</td><td style={{ color: 'var(--text-primary)' }}>{nanny.nationality}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Current Address</td><td style={{ color: 'var(--text-primary)' }}>{`${nanny.current_address}, ${nanny.current_area || ''}, ${nanny.current_city || ''}, ${nanny.current_state || ''} - ${nanny.current_pincode || ''}`}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Highest Qualification</td><td style={{ color: 'var(--text-primary)' }}>{nanny.highest_qualification || 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Languages</td><td style={{ color: 'var(--text-primary)' }}>English (Read: {renderBoolean(nanny.can_read_english)}, Speak: {renderBoolean(nanny.can_speak_english)}), Hindi (Read: {renderBoolean(nanny.can_read_hindi)})</td></tr>
            </tbody>
          </table>
        </section>

        {/* Work Details */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="var(--primary)" /> Professional Preferences
          </h3>
          <table style={{ width: '100%', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)', width: '40%' }}>Experience</td><td style={{ color: 'var(--text-primary)' }}>{nanny.years_experience} Years</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Job Type</td><td style={{ color: 'var(--text-primary)' }}>{nanny.preferred_job_type}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Expected Salary</td><td style={{ color: 'var(--text-primary)' }}>₹{nanny.expected_salary || 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Available From</td><td style={{ color: 'var(--text-primary)' }}>{nanny.available_from ? new Date(nanny.available_from).toLocaleDateString() : 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Working Hours</td><td style={{ color: 'var(--text-primary)' }}>{nanny.available_working_hours}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Willing to Travel</td><td style={{ color: 'var(--text-primary)' }}>{renderBoolean(nanny.willing_to_travel)}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Live-in Option</td><td style={{ color: 'var(--text-primary)' }}>{renderBoolean(nanny.live_in_option)}</td></tr>
            </tbody>
          </table>
        </section>

        {/* Skills */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} color="var(--primary)" /> Verified Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {nanny.skills && nanny.skills.length > 0 ? nanny.skills.map((skill, idx) => (
              <span key={idx} style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid var(--border-color)', color: '#d8b4fe', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem' }}>
                {skill}
              </span>
            )) : <span style={{ color: 'var(--text-secondary)' }}>No specific skills selected.</span>}
          </div>
        </section>

        {/* Medical & Background */}
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={20} color="var(--primary)" /> Medical & Background
          </h3>
          <table style={{ width: '100%', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)', width: '50%' }}>Medical Conditions</td><td style={{ color: 'var(--text-primary)' }}>{renderBoolean(nanny.medical_condition)} {nanny.medical_condition_details}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Allergies</td><td style={{ color: 'var(--text-primary)' }}>{renderBoolean(nanny.allergies)} {nanny.allergies_details}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Blood Group</td><td style={{ color: 'var(--text-primary)' }}>{nanny.blood_group || 'N/A'}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Convicted of Crime</td><td style={{ color: 'var(--text-primary)' }}>{renderBoolean(nanny.convicted_crime)}</td></tr>
              <tr><td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Police Verification</td><td style={{ color: 'var(--text-primary)' }}>{renderBoolean(nanny.police_verification)}</td></tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* References and Documents */}
      <div className="grid-2" style={{ gap: '24px', marginTop: '24px' }}>
        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--primary)" /> References
          </h3>
          {nanny.references && nanny.references.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {nanny.references.map((ref, idx) => (
                <div key={idx} style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>{ref.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{ref.relationship}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}><Phone size={14} /> {ref.phone_number}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ color: 'var(--text-secondary)' }}>No references provided.</div>}
        </section>

        <section className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" /> Uploaded Documents
          </h3>
          {nanny.documents && nanny.documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--primary-light)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#d8b4fe', textDecoration: 'none', transition: 'all 0.2s' }}
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
          ) : <div style={{ color: 'var(--text-secondary)' }}>No documents uploaded.</div>}
        </section>
      </div>

    </div>
  );
};

export default NannyDetails;
