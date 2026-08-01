import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import NannyDetails from './components/NannyDetails';

function App() {
  return (
    <BrowserRouter basename="/ResumeHum">
      <div className="app-container">
        <header className="app-header">
          <h1>NANNY REGISTRATION</h1>
          <p>Please fill in all the details accurately</p>
        </header>
        
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/nanny/:id" element={<NannyDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
