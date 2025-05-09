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

export type CanadianImmigrationProgram = 
  | 'expressEntry'
  | 'pnp'
  | 'familySponsorship'
  | 'businessImmigration'
  | 'temporaryResidence';

export type DocumentType = 
  | 'passport'
  | 'educationCredential'
  | 'languageTest'
  | 'employmentReference'
  | 'policeCheck'
  | 'medicalExam'
  | 'birthCertificate'
  | 'marriageCertificate'
  | 'proofOfFunds'
  | 'photoID';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

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

export interface WorkExperience {
  occupation: {
    noc: string;
    title: string;
  };
  employer: string;
  country: string;
  isCanadianExperience: boolean;
  startDate: Date;
  endDate?: Date;
  hoursPerWeek: number;
  duties?: string[];
}

export interface ExpressEntryProfile {
  userId?: string;
  profileId?: string;
  age: number;
  maritalStatus: MaritalStatus;
  languageProficiency: LanguageProficiency[];
  education: Education[];
  workExperience?: WorkExperience[];
  hasJobOffer?: boolean;
  hasProvincialNomination?: boolean;
  educationLevel?: string;
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
  steps?: string[];
}

export interface TimelineEvent {
  date: Date;
  stage: ApplicationStage;
  description: string;
  actor: string;
}

export interface Note {
  date: Date;
  author: string;
  content: string;
  isPrivate: boolean;
}

export interface Fee {
  name: string;
  amount: number;
}

export interface Payment {
  date: Date;
  amount: number;
  description: string;
}

export interface Fees {
  governmentFees: {
    applicationFee: number;
    rightOfPermanentResidenceFee: number;
    biometricsFee: number;
    otherFees: Fee[];
  };
  consultantFees: {
    baseFee: number;
    optionalServices: Fee[];
    paymentSchedule: Payment[];
  };
  totalPaid: number;
  totalDue: number;
}

export interface ActionItem {
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
  priority: Priority;
}

export interface CanadianCase {
  caseId: string;
  clientId: string;
  consultantId: string;
  immigrationProgram: CanadianImmigrationProgram;
  currentStage: ApplicationStage;
  timeline: TimelineEvent[];
  documents: DocumentType[];
  notes: Note[];
  fees: Fees;
  nextSteps: ActionItem[];
}
