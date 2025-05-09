import React, { useState } from 'react';
import type { CanadianProvince, ExpressEntryProfile } from '@/types/canada';

interface PNPEligibilityCheckerProps {
  initialProvince?: CanadianProvince;
  initialProfile?: Partial<ExpressEntryProfile>;
  onEligibilityChecked?: (isEligible: boolean, province: CanadianProvince, profile: Partial<ExpressEntryProfile>) => void;
}

export const PNPEligibilityChecker: React.FC<PNPEligibilityCheckerProps> = ({
  initialProvince,
  initialProfile = {},
  onEligibilityChecked
}) => {
  const [province, setProvince] = useState<CanadianProvince | ''>(initialProvince || '');
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [isChecking, setIsChecking] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{
    isEligible: boolean;
    streams: string[];
    reasons: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProvinceChange = (selectedProvince: CanadianProvince) => {
    setProvince(selectedProvince);
    setEligibilityResult(null);
  };

  const handleProfileChange = (field: keyof ExpressEntryProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setEligibilityResult(null);
  };

  const handleCheckEligibility = async () => {
    try {
      if (!province) {
        throw new Error('Please select a province');
      }
      
      setIsChecking(true);
      setError(null);
      
      console.log('Checking PNP eligibility for province:', province, 'with profile:', profile);
      
      
      
      
      const result = {
        isEligible: true,
        streams: ['Express Entry Stream', 'Skilled Worker Stream'],
        reasons: []
      };
      
      setEligibilityResult(result);
      
      if (onEligibilityChecked && province) {
        onEligibilityChecked(result.isEligible, province, profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="pnp-eligibility-checker">
      <h2>Provincial Nominee Program Eligibility Checker</h2>
      <p>Check if you're eligible for Provincial Nominee Programs.</p>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="province">Province</label>
          <select
            id="province"
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value as CanadianProvince)}
          >
            <option value="">Select Province</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="NT">Northwest Territories</option>
            <option value="NU">Nunavut</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YT">Yukon</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={profile.age || ''}
            onChange={(e) => handleProfileChange('age', parseInt(e.target.value, 10))}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="educationLevel">Highest Education Level</label>
          <select
            id="educationLevel"
            value={profile.educationLevel || ''}
            onChange={(e) => handleProfileChange('educationLevel', e.target.value)}
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
        
        <div className="form-group">
          <label htmlFor="hasJobOffer">Do you have a job offer in this province?</label>
          <select
            id="hasJobOffer"
            value={profile.hasJobOffer ? 'yes' : 'no'}
            onChange={(e) => handleProfileChange('hasJobOffer', e.target.value === 'yes')}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={handleCheckEligibility}
          disabled={isChecking || !province}
        >
          {isChecking ? 'Checking...' : 'Check Eligibility'}
        </button>
      </div>
      
      {eligibilityResult && (
        <div className={`eligibility-result ${eligibilityResult.isEligible ? 'eligible' : 'not-eligible'}`}>
          <h3>Eligibility Result for {province}</h3>
          
          {eligibilityResult.isEligible ? (
            <>
              <div className="result-status success">You may be eligible for PNP streams in {province}!</div>
              <div className="eligible-streams">
                <h4>Potential Streams:</h4>
                <ul>
                  {eligibilityResult.streams.map((stream, index) => (
                    <li key={index}>{stream}</li>
                  ))}
                </ul>
              </div>
              <p className="disclaimer">This is a preliminary assessment. Actual eligibility will be determined by the provincial authorities.</p>
            </>
          ) : (
            <>
              <div className="result-status failure">You may not be eligible for PNP streams in {province} at this time.</div>
              {eligibilityResult.reasons.length > 0 && (
                <div className="ineligibility-reasons">
                  <h4>Reasons:</h4>
                  <ul>
                    {eligibilityResult.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PNPEligibilityChecker;
