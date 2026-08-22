import React from 'react';
import Card from '../../components/common/Card';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-h2 font-bold text-primary-dark">Student Profile</h1>
      <Card>
        <p className="text-text-muted">Welcome to your profile. Profile management form goes here.</p>
      </Card>
    </div>
  );
};

export default ProfilePage;
