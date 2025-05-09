import React, { useState } from 'react';
import type { CanadianImmigrationProgram, ExpressEntryProfile, DocumentType } from '@/types/canada';

interface ChecklistGeneratorProps {
  initialProgram?: CanadianImmigrationProgram;
  initialProfile?: Partial<ExpressEntryProfile>;
  onChecklistGenerated?: (documents: DocumentType[], program: CanadianImmigrationProgram) => void;
}

export const ChecklistGenerator: React.FC<ChecklistGeneratorProps> = ({
  initialProgram,
  initialProfile = {},
  onChecklistGenerated
}) => {
  const [program, setProgram] = useState<CanadianImmigrationProgram | ''>(initialProgram || '');
  const [profile, setProfile] = useState<Partial<ExpressEntryProfile>>(initialProfile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checklist, setChecklist] = useState<DocumentType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProgramChange = (selectedProgram: CanadianImmigrationProgram) => {
    setProgram(selectedProgram);
    setChecklist([]);
  };

  const handleProfileChange = (field: keyof ExpressEntryProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setChecklist([]);
  };

  const handleGenerateChecklist = async () => {
    try {
      if (!program) {
        throw new Error('Please select an immigration program');
      }
      
      setIsGenerating(true);
      setError(null);
      
      console.log('Generating document checklist for program:', program, 'with profile:', profile);
      
      
      
      
      const documents: DocumentType[] = [
        'passport',
        'educationCredential',
        'languageTest',
        'employmentReference',
        'policeCheck',
        'medicalExam',
        'proofOfFunds'
      ];
      
      if (profile.maritalStatus === 'married' || profile.maritalStatus === 'commonLaw') {
        documents.push('marriageCertificate');
      }
      
      setChecklist(documents);
      
      if (onChecklistGenerated && program) {
        onChecklistGenerated(documents, program);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const getDocumentDescription = (documentType: DocumentType): string => {
    const descriptions: Record<DocumentType, string> = {
      passport: 'Valid passport or travel document',
      educationCredential: 'Educational credentials and ECA report if applicable',
      languageTest: 'Language test results (IELTS, CELPIP, TEF, TCF)',
      employmentReference: 'Employment reference letters',
      policeCheck: 'Police clearance certificates',
      medicalExam: 'Medical examination results',
      birthCertificate: 'Birth certificate',
      marriageCertificate: 'Marriage certificate or common-law proof',
      proofOfFunds: 'Proof of funds (bank statements)',
      photoID: 'Passport-sized photographs'
    };
    
    return descriptions[documentType];
  };

  return (
    <div className="checklist-generator">
      <h2>Document Checklist Generator</h2>
      <p>Generate a personalized document checklist for your immigration application.</p>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="program">Immigration Program</label>
          <select
            id="program"
            value={program}
            onChange={(e) => handleProgramChange(e.target.value as CanadianImmigrationProgram)}
          >
            <option value="">Select Program</option>
            <option value="expressEntry">Express Entry</option>
            <option value="pnp">Provincial Nominee Program</option>
            <option value="familySponsorship">Family Sponsorship</option>
            <option value="businessImmigration">Business Immigration</option>
            <option value="temporaryResidence">Temporary Residence</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="maritalStatus">Marital Status</label>
          <select
            id="maritalStatus"
            value={profile.maritalStatus || ''}
            onChange={(e) => handleProfileChange('maritalStatus', e.target.value)}
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
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={handleGenerateChecklist}
          disabled={isGenerating || !program}
        >
          {isGenerating ? 'Generating...' : 'Generate Checklist'}
        </button>
      </div>
      
      {checklist.length > 0 && (
        <div className="checklist-results">
          <h3>Document Checklist for {program}</h3>
          
          <div className="document-list">
            {checklist.map((document, index) => (
              <div key={index} className="document-item">
                <input type="checkbox" id={`doc-${index}`} />
                <label htmlFor={`doc-${index}`}>
                  <span className="document-name">{getDocumentDescription(document)}</span>
                </label>
              </div>
            ))}
          </div>
          
          <div className="checklist-actions">
            <button className="print-button">Print Checklist</button>
            <button className="save-button">Save Checklist</button>
          </div>
          
          <p className="disclaimer">This checklist is a general guide. Additional documents may be required based on your specific circumstances.</p>
        </div>
      )}
    </div>
  );
};

export default ChecklistGenerator;
