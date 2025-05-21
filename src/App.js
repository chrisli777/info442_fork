import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ElderCheckInPage from './component/ElderCheckInPage';
import CaregiverDashboard from './component/CaregiverDashboard';
import FamilyDashboard from './component/FamilyDashboard';
import ElderProfilePage from './component/ElderProfilePage';
import LoginPage from './component/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Show LoginPage at startup */}
        <Route path="/" element={<LoginPage />} />

        {/* Other routes after login */}
        <Route path="/caregiver" element={<CaregiverDashboard />} />
        <Route path="/family" element={<FamilyDashboard />} />
        <Route path="/elder" element={<ElderCheckInPage />} />
        <Route path="/profile" element={<ElderProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
