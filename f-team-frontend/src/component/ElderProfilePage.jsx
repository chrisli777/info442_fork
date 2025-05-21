import React from 'react';
import Chat from "./chat"

const ElderProfilePage = () => {
  return (
    <div className="profile-container">
      <header className="profile-header">
        <h2>CareCircle</h2>
        <button className="logout-btn">Logout</button>
      </header>

      <main className="profile-main">
        <div className="profile-left">
          <img
            src="/elder.jpg"
            alt="Elder"
            className="profile-photo"
          />
          <h3>Olivia Thompson</h3>
          <p>Age: 82</p>
          <p>Room: B-103</p>
          <p>Contact: (555) 123-4567</p>
        </div>

        <div className="profile-right">
          <div className="tabs">
            <button className="active">Contact</button>
            <button>History</button>
            <button>Care Plan</button>
          </div>

          <div className="tab-content">
            <h4>Care Team</h4>
            <ul className="care-team">
              <li>👩‍⚕️ Nurse Joy - Primary Caregiver</li>
              <li>👨‍⚕️ Dr. Ahmed - Family Doctor</li>
              <li>👨‍👩‍👧‍👦 Emma Thompson - Daughter</li>
              <li>📞 John Thompson - Emergency Contact</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ElderProfilePage;
