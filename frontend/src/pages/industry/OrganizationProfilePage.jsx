import React from 'react';
import Card from '../../components/common/Card';

const OrganizationProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-h2 font-bold text-primary-dark">Organization Profile</h1>
      <Card>
        <p className="text-text-muted">Welcome to your organization profile. Profile management form goes here.</p>
      </Card>
    </div>
  );
};

export default OrganizationProfilePage;
