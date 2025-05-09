import React, { useState } from 'react';

interface EligibilityCheckerProps {
  initialData?: any;
  onEligibilityChecked?: (isEligible: boolean, programs: string[]) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  initialData = {},
  onEligibilityChecked
}) => {
  const [formData, setFormData] = useState(initialData);
  const [eligibilityResult, setEligibilityResult] = useState<{
    isEligible: boolean;
    programs: string[];
    reasons: string[];
  } | null>(null);

  const handleCheckEligibility = () => {
    console.log('Checking eligibility for:', formData);
    
    const result = {
      isEligible: true,
      programs: ['Federal Skilled Worker', 'Canadian Experience Class'],
      reasons: ['Meets minimum requirements for Express Entry']
    };
    
    setEligibilityResult(result);
    
    if (onEligibilityChecked) {
      onEligibilityChecked(result.isEligible, result.programs);
    }
  };

  return (
    <div className="eligibility-checker">
      <h2>Express Entry Eligibility Checker</h2>
      <p>Check if you're eligible for Express Entry immigration programs.</p>
      
      {/* Form fields would go here */}
      
      <button onClick={handleCheckEligibility}>
        Check Eligibility
      </button>
      
      {eligibilityResult && (
        <div className="eligibility-result">
          <h3>Eligibility Result</h3>
          <p>
            {eligibilityResult.isEligible 
              ? 'You may be eligible for the following programs:' 
              : 'You may not be eligible for Express Entry at this time.'}
          </p>
          
          {eligibilityResult.isEligible && (
            <ul>
              {eligibilityResult.programs.map((program, index) => (
                <li key={index}>{program}</li>
              ))}
            </ul>
          )}
          
          <div className="reasons">
            <h4>Details:</h4>
            <ul>
              {eligibilityResult.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
