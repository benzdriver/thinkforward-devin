import React, { useState, useEffect } from 'react';
import type { CanadianCase, ActionItem } from '@/types/canada';

interface CaseManagerProps {
  consultantId: string;
  onCaseSelected?: (caseId: string) => void;
}

export const CaseManager: React.FC<CaseManagerProps> = ({
  consultantId,
  onCaseSelected
}) => {
  const [cases, setCases] = useState<CanadianCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const mockCases: CanadianCase[] = [
          {
            caseId: 'case-001',
            clientId: 'client-001',
            consultantId: consultantId,
            immigrationProgram: 'expressEntry',
            currentStage: 'submitted',
            timeline: [
              {
                date: new Date('2023-01-15'),
                stage: 'draft',
                description: 'Profile created',
                actor: 'Client'
              },
              {
                date: new Date('2023-02-01'),
                stage: 'submitted',
                description: 'Profile submitted to Express Entry pool',
                actor: 'Consultant'
              }
            ],
            documents: [],
            notes: [
              {
                date: new Date('2023-01-20'),
                author: 'Consultant',
                content: 'Reviewed client documents, all in order',
                isPrivate: true
              }
            ],
            fees: {
              governmentFees: {
                applicationFee: 1325,
                rightOfPermanentResidenceFee: 500,
                biometricsFee: 85,
                otherFees: []
              },
              consultantFees: {
                baseFee: 3000,
                optionalServices: [],
                paymentSchedule: [
                  {
                    date: new Date('2023-01-10'),
                    amount: 1500,
                    description: 'Initial consultation and profile setup'
                  },
                  {
                    date: new Date('2023-02-15'),
                    amount: 1500,
                    description: 'Final payment upon profile submission'
                  }
                ]
              },
              totalPaid: 1500,
              totalDue: 1500
            },
            nextSteps: [
              {
                title: 'Wait for ITA',
                description: 'Monitor Express Entry draws for invitation to apply',
                dueDate: new Date('2023-05-01'),
                assignedTo: 'Consultant',
                status: 'pending',
                priority: 'medium'
              }
            ]
          },
          {
            caseId: 'case-002',
            clientId: 'client-002',
            consultantId: consultantId,
            immigrationProgram: 'pnp',
            currentStage: 'invited',
            timeline: [
              {
                date: new Date('2023-02-10'),
                stage: 'draft',
                description: 'Application started',
                actor: 'Client'
              },
              {
                date: new Date('2023-03-01'),
                stage: 'submitted',
                description: 'Application submitted to Ontario PNP',
                actor: 'Consultant'
              },
              {
                date: new Date('2023-04-15'),
                stage: 'invited',
                description: 'Nomination received from Ontario',
                actor: 'System'
              }
            ],
            documents: [],
            notes: [],
            fees: {
              governmentFees: {
                applicationFee: 1500,
                rightOfPermanentResidenceFee: 500,
                biometricsFee: 85,
                otherFees: [
                  { name: 'Provincial Fee', amount: 1500 }
                ]
              },
              consultantFees: {
                baseFee: 4000,
                optionalServices: [],
                paymentSchedule: [
                  {
                    date: new Date('2023-02-10'),
                    amount: 2000,
                    description: 'Initial payment'
                  },
                  {
                    date: new Date('2023-04-20'),
                    amount: 2000,
                    description: 'Payment upon nomination'
                  }
                ]
              },
              totalPaid: 4000,
              totalDue: 0
            },
            nextSteps: [
              {
                title: 'Submit PR Application',
                description: 'Prepare and submit permanent residence application',
                dueDate: new Date('2023-05-15'),
                assignedTo: 'Consultant',
                status: 'inProgress',
                priority: 'high'
              }
            ]
          }
        ];
        
        setCases(mockCases);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCases();
  }, [consultantId]);

  const handleCaseClick = (caseId: string) => {
    if (onCaseSelected) {
      onCaseSelected(caseId);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'newest' | 'oldest' | 'priority');
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.immigrationProgram.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || caseItem.currentStage === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timeline[b.timeline.length - 1].date).getTime() - 
             new Date(a.timeline[a.timeline.length - 1].date).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.timeline[a.timeline.length - 1].date).getTime() - 
             new Date(b.timeline[b.timeline.length - 1].date).getTime();
    } else {
      const priorityValues = { urgent: 3, high: 2, medium: 1, low: 0 };
      const aPriority = a.nextSteps.length > 0 ? priorityValues[a.nextSteps[0].priority] : 0;
      const bPriority = b.nextSteps.length > 0 ? priorityValues[b.nextSteps[0].priority] : 0;
      return bPriority - aPriority;
    }
  });

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Submitted',
      invited: 'Invited',
      applied: 'Applied',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    
    return labels[status] || status;
  };

  const getStatusClass = (status: string): string => {
    const classes: Record<string, string> = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      invited: 'status-invited',
      applied: 'status-applied',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return classes[status] || '';
  };

  const getProgramLabel = (program: string): string => {
    const labels: Record<string, string> = {
      expressEntry: 'Express Entry',
      pnp: 'Provincial Nominee Program',
      familySponsorship: 'Family Sponsorship',
      businessImmigration: 'Business Immigration',
      temporaryResidence: 'Temporary Residence'
    };
    
    return labels[program] || program;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="case-manager">
      <h2>Case Management</h2>
      
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="invited">Invited</option>
              <option value="applied">Applied</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading cases...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : sortedCases.length === 0 ? (
        <div className="no-cases-message">
          No cases found. Adjust your filters or create a new case.
        </div>
      ) : (
        <div className="cases-list">
          {sortedCases.map(caseItem => (
            <div 
              key={caseItem.caseId} 
              className="case-card"
              onClick={() => handleCaseClick(caseItem.caseId)}
            >
              <div className="case-header">
                <h3 className="case-id">Case #{caseItem.caseId}</h3>
                <span className={`case-status ${getStatusClass(caseItem.currentStage)}`}>
                  {getStatusLabel(caseItem.currentStage)}
                </span>
              </div>
              
              <div className="case-details">
                <div className="detail-item">
                  <span className="label">Client ID:</span>
                  <span className="value">{caseItem.clientId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Program:</span>
                  <span className="value">{getProgramLabel(caseItem.immigrationProgram)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Last Update:</span>
                  <span className="value">
                    {formatDate(caseItem.timeline[caseItem.timeline.length - 1].date)}
                  </span>
                </div>
              </div>
              
              {caseItem.nextSteps.length > 0 && (
                <div className="next-steps">
                  <h4>Next Step:</h4>
                  <div className={`next-step-item priority-${caseItem.nextSteps[0].priority}`}>
                    <div className="step-title">{caseItem.nextSteps[0].title}</div>
                    <div className="step-due-date">Due: {formatDate(caseItem.nextSteps[0].dueDate)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="action-buttons">
        <button className="create-case-button">Create New Case</button>
        <button className="import-cases-button">Import Cases</button>
      </div>
    </div>
  );
};

export default CaseManager;
