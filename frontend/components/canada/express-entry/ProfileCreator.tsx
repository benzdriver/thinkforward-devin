import React, { useState } from 'react';
import type { ExpressEntryProfile } from '@/types/canada';

interface ProfileCreatorProps {
  initialProfile?: Partial<ExpressEntryProfile>;
  onProfileCreated?: (profile: ExpressEntryProfile) => void;
}

export const ProfileCreator: React.FC<ProfileCreatorProps> = ({
  initialProfile = {},
  onProfileCreated
}) => {
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ExpressEntryProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!profile.age || !profile.maritalStatus || !profile.languageProficiency) {
        throw new Error('Missing required fields');
      }
      
      console.log('Submitting profile:', profile);
      
      
      
      
      if (onProfileCreated) {
        onProfileCreated(profile as ExpressEntryProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="profile-step">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                value={profile.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value, 10))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="maritalStatus">Marital Status</label>
              <select
                id="maritalStatus"
                value={profile.maritalStatus || ''}
                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              >
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="commonLaw">Common Law</option>
                <option value="divorced">Divorced</option>
                <option value="separated">Separated</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <button onClick={handleNextStep}>Next</button>
          </div>
        );
      case 2:
        return (
          <div className="profile-step">
            <h3>Education</h3>
            <div className="form-group">
              <label htmlFor="educationLevel">Highest Education Level</label>
              <select
                id="educationLevel"
                value={profile.education?.[0]?.level || ''}
                onChange={(e) => handleInputChange('education', [{ level: e.target.value }])}
              >
                <option value="">Select Education Level</option>
                <option value="highSchool">High School</option>
                <option value="oneYearDiploma">One-Year Diploma</option>
                <option value="twoYearDiploma">Two-Year Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            <div className="button-group">
              <button onClick={handlePreviousStep}>Previous</button>
              <button onClick={handleNextStep}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="profile-step">
            <h3>Language Proficiency</h3>
            <div className="form-group">
              <label>Language Test</label>
              <select
                value={profile.languageProficiency?.[0]?.test || ''}
                onChange={(e) => {
                  const updatedProficiency = profile.languageProficiency?.[0] 
                    ? { ...profile.languageProficiency[0], test: e.target.value }
                    : { language: 'english', test: e.target.value, speaking: 0, listening: 0, reading: 0, writing: 0 };
                  
                  handleInputChange('languageProficiency', [updatedProficiency]);
                }}
              >
                <option value="">Select Test</option>
                <option value="IELTS">IELTS</option>
                <option value="CELPIP">CELPIP</option>
                <option value="TEF">TEF</option>
                <option value="TCF">TCF</option>
              </select>
            </div>
            <div className="button-group">
              <button onClick={handlePreviousStep}>Previous</button>
              <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Create Profile'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-creator">
      <h2>Create Express Entry Profile</h2>
      <p>Complete the following steps to create your Express Entry profile.</p>
      
      <div className="progress-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Personal Info</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Education</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Language</div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {renderStep()}
    </div>
  );
};

export default ProfileCreator;
