import React from 'react';
// Make sure this path correctly points to your actual UI component
import TechnicianDashboardComponent from '../components/TechnicianDashboard';

const TechnicianDashboardPage = () => {
  return (
    <main className="technician-page-wrapper">
      <TechnicianDashboardComponent />
    </main>
  );
};

export default TechnicianDashboardPage;