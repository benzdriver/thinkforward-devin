/**
 * TypeScript type definitions for Canadian immigration modules
 */

export type CanadianProvince = 
  | 'AB' // Alberta
  | 'BC' // British Columbia
  | 'MB' // Manitoba
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'NS' // Nova Scotia
  | 'NT' // Northwest Territories
  | 'NU' // Nunavut
  | 'ON' // Ontario
  | 'PE' // Prince Edward Island
  | 'QC' // Quebec
  | 'SK' // Saskatchewan
  | 'YT'; // Yukon

export type EducationLevel = 
  | 'highSchool'
  | 'oneYearDiploma'
  | 'twoYearDiploma'
  | 'bachelors'
  | 'twoOrMoreDegrees'
  | 'masters'
  | 'phd';

export type CLBLevel = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type LanguageTest = 'IELTS' | 'CELPIP' | 'TEF' | 'TCF';

export type MaritalStatus = 'single' | 'married' | 'commonLaw' | 'divorced' | 'separated' | 'widowed';

export type ApplicationStage = 'draft' | 'submitted' | 'invited' | 'applied' | 'approved' | 'rejected';

export interface LanguageProficiency {
  language: 'english' | 'french';
  test: LanguageTest;
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  clbEquivalent?: {
    speaking: CLBLevel;
    listening: CLBLevel;
    reading: CLBLevel;
    writing: CLBLevel;
  };
}

export interface Education {
  level: EducationLevel;
  field?: string;
  institution?: string;
  country?: string;
  completionDate?: Date;
  canadianEquivalency?: {
    hasECA: boolean;
    ecaAuthority?: string;
    ecaDate?: Date;
    ecaReport?: string;
  };
}

export interface ExpressEntryProfile {
  userId?: string;
  profileId?: string;
  age: number;
  maritalStatus: MaritalStatus;
  languageProficiency: LanguageProficiency[];
  education: Education[];
  status?: ApplicationStage;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PNPProgram {
  province: CanadianProvince;
  streamName: string;
  eligibilityCriteria: string[];
  processingTime: number; // in days
  applicationFee: number;
  requiredDocuments: string[];
}
