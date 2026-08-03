import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User, Shield, Briefcase, Star, HeartPulse, FileSearch, Users, GraduationCap, Building, Info, FileText, CheckSquare, UploadCloud, Camera, ArrowRight } from 'lucide-react';
import axios from 'axios';

const RegistrationForm = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationError, setValidationError] = useState('');

  const onInvalid = (errors) => {
    setValidationError('Please fill in all required fields marked with * before submitting.');
    // Clear the error after 5 seconds
    setTimeout(() => setValidationError(''), 5000);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setValidationError('');
    
    try {
      const formData = new FormData();
      
      // Separate files from other data
      const files = {};
      const payloadData = { ...data };
      
      // Identify and append files
      ['profilePhoto', 'idFront', 'idBack', 'selfie', 'policeCert', 'experienceCert', 'firstAidCert', 'medicalCert', 'resume'].forEach(field => {
        if (payloadData[field] && payloadData[field][0]) {
          formData.append(field, payloadData[field][0]);
        }
        delete payloadData[field];
      });
      
      // Ensure skills and references are correctly formatted for JSON
      const skills = Object.keys(payloadData).filter(k => k.startsWith('skill_') && payloadData[k]).map(k => k.replace('skill_', '').replace(/_/g, ' '));
      
      const references = [
        { name: payloadData.ref1Name, relationship: payloadData.ref1Relation, phoneNumber: payloadData.ref1Phone },
        { name: payloadData.ref2Name, relationship: payloadData.ref2Relation, phoneNumber: payloadData.ref2Phone }
      ].filter(r => r.name);
      
      const finalPayload = {
        ...payloadData,
        skills,
        references
      };
      
      formData.append('data', JSON.stringify(finalPayload));
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_BASE_URL}/api/nannies`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      let errorMsg = 'Failed to submit the form. Please try again later.';
      
      if (err.message === 'Network Error') {
        errorMsg = 'Cannot connect to the server. Please ensure the backend server is running.';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
        if (errorMsg.includes('ECONNREFUSED') || errorMsg.trim() === 'Failed to register nanny.') {
          errorMsg = 'Database connection failed! Please ensure your database is running, the credentials in backend/.env are correct, and you have run the migration script.';
        }
      }
      
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="glass-container form-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckSquare size={40} color="var(--text-primary)" />
        </div>
        <h2>Registration Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Your application has been submitted and is under review.</p>
        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => window.location.reload()}>Submit Another Application</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="animate-fade-in">
      {validationError && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} /> {validationError}
        </div>
      )}
      {submitError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          {submitError}
        </div>
      )}

      {/* 1. Personal Information */}
      <section className="glass-container form-section">
        <h2 className="section-title"><User size={24} /> 1. PERSONAL INFORMATION</h2>
        <div className="grid-3">
          <div className="input-group">
            <label>Full Name *</label>
            <input type="text" placeholder="Enter your full name" {...register("fullName", { required: true })} />
          </div>
          <div className="input-group">
            <label>Date of Birth *</label>
            <input type="date" {...register("dob", { required: true })} />
          </div>
          <div className="input-group">
            <label>Gender *</label>
            <div className="radio-group-container">
              <label className="radio-group"><input type="radio" value="Female" {...register("gender", { required: true })} /> Female</label>
              <label className="radio-group"><input type="radio" value="Male" {...register("gender")} /> Male</label>
              <label className="radio-group"><input type="radio" value="Other" {...register("gender")} /> Other</label>
            </div>
          </div>
          
          <div className="input-group">
            <label>Mobile Number *</label>
            <div style={{ display: 'flex' }}>
              <input type="text" value="+91" readOnly style={{ width: '60px', marginRight: '8px', textAlign: 'center' }} />
              <input type="text" placeholder="Enter mobile number" {...register("mobileNumber", { required: true })} style={{ flex: 1 }} />
            </div>
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter email address" {...register("emailAddress")} />
          </div>
          <div className="input-group">
            <label>Nationality *</label>
            <select {...register("nationality", { required: true })}>
              <option value="">Select nationality</option>
              <option value="Indian">Indian</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '24px' }}>
          <div>
            <h4 style={{ marginBottom: '12px' }}>Current Residential Address *</h4>
            <div className="input-group">
              <input type="text" placeholder="House / Flat No., Building, Street" {...register("currentAddress", { required: true })} />
            </div>
            <div className="grid-2">
              <div className="input-group">
                <input type="text" placeholder="Area / Locality" {...register("currentArea")} />
              </div>
              <div className="input-group">
                <input type="text" placeholder="City" {...register("currentCity")} />
              </div>
            </div>
            <div className="grid-2">
              <div className="input-group">
                <select {...register("currentState")}>
                  <option value="">State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div className="input-group">
                <input type="text" placeholder="PIN Code" {...register("currentPincode")} />
              </div>
            </div>
          </div>
          <div>
             <h4 style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                Permanent Address
                <label className="checkbox-group" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                  <input type="checkbox" {...register("sameAsCurrent")} /> Same as current address
                </label>
             </h4>
             <div className="input-group">
              <input type="text" placeholder="House / Flat No., Building, Street" {...register("permanentAddress")} />
            </div>
            <div className="grid-2">
              <div className="input-group">
                <input type="text" placeholder="Area / Locality" {...register("permanentArea")} />
              </div>
              <div className="input-group">
                <input type="text" placeholder="City" {...register("permanentCity")} />
              </div>
            </div>
            <div className="grid-2">
              <div className="input-group">
                <select {...register("permanentState")}>
                  <option value="">State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div className="input-group">
                <input type="text" placeholder="PIN Code" {...register("permanentPincode")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KYC */}
      <section className="glass-container form-section">
        <h2 className="section-title"><Shield size={24} /> 2. IDENTITY VERIFICATION (KYC)</h2>
        <div className="grid-2">
          <div className="input-group">
            <label>Government ID Type *</label>
            <select {...register("govIdType", { required: true })}>
              <option value="">Select ID type</option>
              <option value="Aadhaar">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>
          <div className="input-group">
            <label>ID Number *</label>
            <input type="text" placeholder="Enter ID number" {...register("govIdNumber", { required: true })} />
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Upload Front of ID (Optional)</label>
            <label className="file-upload-btn">
              <UploadCloud size={24} />
              <span>Upload Front Side</span>
              <input type="file" {...register("idFront")} accept="image/*,.pdf" />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Upload Back of ID (Optional)</label>
            <label className="file-upload-btn">
              <UploadCloud size={24} />
              <span>Upload Back Side</span>
              <input type="file" {...register("idBack")} accept="image/*,.pdf" />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Selfie for Verification (Optional)</label>
            <label className="file-upload-btn">
              <Camera size={24} />
              <span>Take Selfie</span>
              <input type="file" {...register("selfie")} accept="image/*" capture="user" />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Resume (Optional)</label>
            <label className="file-upload-btn">
              <FileText size={24} />
              <span>Upload Resume</span>
              <input type="file" {...register("resume")} accept=".pdf,.doc,.docx" />
            </label>
          </div>
        </div>
      </section>

      {/* 3. Work Information */}
      <section className="glass-container form-section">
        <h2 className="section-title"><Briefcase size={24} /> 3. WORK INFORMATION</h2>
        <div className="grid-3">
          <div className="input-group">
            <label>Years of Experience *</label>
            <select {...register("yearsExperience", { required: true })}>
              <option value="">Select experience</option>
              <option value="0-1">0 - 1 Year</option>
              <option value="1-3">1 - 3 Years</option>
              <option value="3-5">3 - 5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
          <div className="input-group">
            <label>Preferred Job Type *</label>
            <select {...register("preferredJobType", { required: true })}>
              <option value="">Select job type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
          <div className="input-group">
            <label>Expected Salary (₹) *</label>
            <input type="number" placeholder="Enter expected salary" {...register("expectedSalary", { required: true })} />
          </div>
          <div className="input-group">
            <label>Available From Date *</label>
            <input type="date" {...register("availableFrom", { required: true })} />
          </div>
          <div className="input-group">
            <label>Available Working Hours *</label>
            <select {...register("availableWorkingHours", { required: true })}>
              <option value="">Select working hours</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div className="input-group">
            <label>Preferred Work Location *</label>
            <input type="text" placeholder="Enter city / area" {...register("preferredWorkLocation", { required: true })} />
          </div>
        </div>
        
        <div className="grid-3" style={{ marginTop: '24px' }}>
          <div>
            <label>Willing to Travel?</label>
            <div className="radio-group-container">
              <label className="radio-group"><input type="radio" value="true" {...register("willingToTravel")} /> Yes</label>
              <label className="radio-group"><input type="radio" value="false" {...register("willingToTravel")} defaultChecked /> No</label>
            </div>
          </div>
          <div>
            <label>Overnight Stay?</label>
            <div className="radio-group-container">
              <label className="radio-group"><input type="radio" value="true" {...register("overnightStay")} /> Yes</label>
              <label className="radio-group"><input type="radio" value="false" {...register("overnightStay")} defaultChecked /> No</label>
            </div>
          </div>
          <div>
            <label>Live-in Option?</label>
            <div className="radio-group-container">
              <label className="radio-group"><input type="radio" value="true" {...register("liveInOption")} /> Yes</label>
              <label className="radio-group"><input type="radio" value="false" {...register("liveInOption")} defaultChecked /> No</label>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Skills */}
      <section className="glass-container form-section">
        <h2 className="section-title"><Star size={24} /> 4. SKILLS & SERVICES</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>Select all that apply</p>
        <div className="grid-3">
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Newborn_Care")} /> Newborn Care</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_First_Aid_CPR")} /> First Aid / CPR Certified</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Infant_Care")} /> Infant Care</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Housekeeping")} /> Housekeeping</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Toddler_Care")} /> Toddler Care</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Laundry")} /> Laundry</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Special_Needs")} /> Special Needs Care</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Cooking")} /> Cooking</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Elder_Care")} /> Elder Care</label>
          <label className="checkbox-group"><input type="checkbox" {...register("skill_Driving")} /> Driving</label>
        </div>
      </section>

      {/* Checkboxes and Consent */}
      <section className="glass-container form-section">
        <h2 className="section-title"><CheckSquare size={24} /> CONSENT & DECLARATION</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label className="checkbox-group">
            <input type="checkbox" {...register("consent1", { required: true })} />
            <span>I confirm that all information provided is true and correct.</span>
          </label>
          <label className="checkbox-group">
            <input type="checkbox" {...register("consent2", { required: true })} />
            <span>I consent to the company storing my information for employment purposes.</span>
          </label>
          <label className="checkbox-group">
            <input type="checkbox" {...register("consent3", { required: true })} />
            <span>I agree to undergo background verification.</span>
          </label>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
          {isSubmitting ? 'Submitting...' : 'Submit Registration'} <ArrowRight size={20} />
        </button>
      </div>

    </form>
  );
};

export default RegistrationForm;
