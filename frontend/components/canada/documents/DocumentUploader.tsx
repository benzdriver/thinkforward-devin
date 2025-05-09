import React, { useState } from 'react';
import type { DocumentType } from '@/types/canada';

interface DocumentUploaderProps {
  documentType: DocumentType;
  applicationId?: string;
  onUploadComplete?: (fileUrl: string, documentType: DocumentType) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documentType,
  applicationId,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      
      
      
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileUrl = `https://example.com/documents/${documentType}-${Date.now()}.pdf`;
      
      setUploadedFileUrl(fileUrl);
      
      if (onUploadComplete) {
        onUploadComplete(fileUrl, documentType);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    const labels: Record<DocumentType, string> = {
      passport: 'Passport',
      educationCredential: 'Educational Credential',
      languageTest: 'Language Test Result',
      employmentReference: 'Employment Reference Letter',
      policeCheck: 'Police Clearance Certificate',
      medicalExam: 'Medical Examination Result',
      birthCertificate: 'Birth Certificate',
      marriageCertificate: 'Marriage Certificate',
      proofOfFunds: 'Proof of Funds',
      photoID: 'Photo ID'
    };
    
    return labels[type];
  };

  return (
    <div className="document-uploader">
      <h3>{getDocumentTypeLabel(documentType)} Upload</h3>
      
      <div className="upload-container">
        <div className="file-input-container">
          <input
            type="file"
            id={`file-${documentType}`}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={isUploading}
          />
          <label htmlFor={`file-${documentType}`} className="file-input-label">
            {file ? file.name : 'Choose File'}
          </label>
        </div>
        
        {file && (
          <div className="file-details">
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          className="upload-button"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
        
        {isUploading && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}
        
        {uploadedFileUrl && (
          <div className="upload-success">
            <span className="success-icon">✓</span>
            <span className="success-message">Document uploaded successfully!</span>
            <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="view-document">
              View Document
            </a>
          </div>
        )}
      </div>
      
      <div className="upload-guidelines">
        <h4>Upload Guidelines:</h4>
        <ul>
          <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
          <li>Maximum file size: 10 MB</li>
          <li>Ensure documents are clear and legible</li>
          <li>Include all pages of multi-page documents</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploader;
