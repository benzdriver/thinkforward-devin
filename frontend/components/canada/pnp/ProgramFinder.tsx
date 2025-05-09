import React, { useState } from 'react';
import type { CanadianProvince, PNPProgram, ExpressEntryProfile } from '@/types/canada';

interface ProgramFinderProps {
  initialProvince?: CanadianProvince;
  initialProfile?: Partial<ExpressEntryProfile>;
  onProgramsFound?: (programs: PNPProgram[]) => void;
}

export const ProgramFinder: React.FC<ProgramFinderProps> = ({
  initialProvince,
  initialProfile = {},
  onProgramsFound
}) => {
  const [province, setProvince] = useState<CanadianProvince | ''>('');
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [isSearching, setIsSearching] = useState(false);
  const [programs, setPrograms] = useState<PNPProgram[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProvinceChange = (selectedProvince: CanadianProvince) => {
    setProvince(selectedProvince);
    setPrograms([]);
  };

  const handleProfileChange = (field: keyof ExpressEntryProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setPrograms([]);
  };

  const handleFindPrograms = async () => {
    try {
      if (!province) {
        throw new Error('Please select a province');
      }
      
      setIsSearching(true);
      setError(null);
      
      console.log('Finding PNP programs for province:', province, 'with profile:', profile);
      
      
      
      
      const foundPrograms: PNPProgram[] = [
        {
          province: province,
          streamName: 'Express Entry Stream',
          eligibilityCriteria: [
            'Express Entry profile',
            'Job offer from provincial employer',
            'Intention to reside in the province'
          ],
          processingTime: 90,
          applicationFee: 300,
          requiredDocuments: [
            'Express Entry profile number',
            'Job offer letter',
            'Educational credentials',
            'Language test results'
          ],
          steps: [
            'Submit expression of interest',
            'Receive nomination',
            'Accept nomination in Express Entry profile',
            'Receive ITA from IRCC',
            'Submit permanent residence application'
          ]
        },
        {
          province: province,
          streamName: 'Skilled Worker Stream',
          eligibilityCriteria: [
            'Work experience in an in-demand occupation',
            'Language proficiency',
            'Education credentials',
            'Settlement funds'
          ],
          processingTime: 120,
          applicationFee: 350,
          requiredDocuments: [
            'Educational credentials',
            'Language test results',
            'Work experience letters',
            'Proof of funds'
          ],
          steps: [
            'Submit application to provincial program',
            'Receive nomination certificate',
            'Apply for permanent residence'
          ]
        }
      ];
      
      setPrograms(foundPrograms);
      
      if (onProgramsFound) {
        onProgramsFound(foundPrograms);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="program-finder">
      <h2>Provincial Nominee Program Finder</h2>
      <p>Find provincial immigration programs that match your profile.</p>
      
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
          <label htmlFor="occupation">Occupation (NOC)</label>
          <input
            type="text"
            id="occupation"
            value={profile.workExperience?.[0]?.occupation?.noc || ''}
            onChange={(e) => {
              const updatedWorkExperience = profile.workExperience?.[0]
                ? [{ ...profile.workExperience[0], occupation: { ...profile.workExperience[0].occupation, noc: e.target.value } }]
                : [{ occupation: { noc: e.target.value, title: '' }, employer: '', country: '', isCanadianExperience: false, startDate: new Date(), hoursPerWeek: 0 }];
              
              handleProfileChange('workExperience', updatedWorkExperience);
            }}
            placeholder="e.g., 21223"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={handleFindPrograms}
          disabled={isSearching || !province}
        >
          {isSearching ? 'Searching...' : 'Find Programs'}
        </button>
      </div>
      
      {programs.length > 0 && (
        <div className="programs-results">
          <h3>Available Programs in {province}</h3>
          
          {programs.map((program, index) => (
            <div key={index} className="program-card">
              <h4>{program.streamName}</h4>
              
              <div className="program-details">
                <div className="detail-item">
                  <span className="label">Processing Time:</span>
                  <span className="value">{program.processingTime} days</span>
                </div>
                <div className="detail-item">
                  <span className="label">Application Fee:</span>
                  <span className="value">${program.applicationFee}</span>
                </div>
              </div>
              
              <div className="eligibility-criteria">
                <h5>Eligibility Criteria:</h5>
                <ul>
                  {program.eligibilityCriteria.map((criteria, i) => (
                    <li key={i}>{criteria}</li>
                  ))}
                </ul>
              </div>
              
              <div className="required-documents">
                <h5>Required Documents:</h5>
                <ul>
                  {program.requiredDocuments.map((document, i) => (
                    <li key={i}>{document}</li>
                  ))}
                </ul>
              </div>
              
              <button className="learn-more-button">Learn More</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramFinder;
