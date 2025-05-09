import React, { useState } from 'react';

interface ProvinceSelectorProps {
  onProvinceSelected?: (province: string) => void;
}

export const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({ onProvinceSelected }) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  
  const provinces = [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'YT', name: 'Yukon' }
  ];
  
  const handleProvinceSelect = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    
    if (onProvinceSelected) {
      onProvinceSelected(provinceCode);
    }
  };
  
  return (
    <div className="province-selector">
      <h2>Select a Province or Territory</h2>
      <p>Choose a Canadian province or territory to explore its Provincial Nominee Program (PNP).</p>
      
      <div className="province-grid">
        {provinces.map(province => (
          <div 
            key={province.code}
            className={`province-card ${selectedProvince === province.code ? 'selected' : ''}`}
            onClick={() => handleProvinceSelect(province.code)}
          >
            <div className="province-name">{province.name}</div>
            <div className="province-code">{province.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvinceSelector;
