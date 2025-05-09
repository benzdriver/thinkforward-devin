import React, { useState, useEffect } from 'react';
import type { CanadianImmigrationProgram } from '@/types/canada';

interface SuccessRateChartProps {
  program?: CanadianImmigrationProgram;
  timeframe?: 'month' | 'quarter' | 'year';
  consultantId?: string;
}

export const SuccessRateChart: React.FC<SuccessRateChartProps> = ({
  program,
  timeframe = 'quarter',
  consultantId
}) => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuccessRates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        
        let labels: string[] = [];
        let successRates: number[] = [];
        let industryAverages: number[] = [];
        
        if (timeframe === 'month') {
          labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          successRates = [85, 82, 88, 90, 87, 92];
          industryAverages = [75, 76, 78, 77, 79, 80];
        } else if (timeframe === 'quarter') {
          labels = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'];
          successRates = [84, 87, 89, 91];
          industryAverages = [76, 77, 79, 80];
        } else {
          labels = ['2020', '2021', '2022', '2023'];
          successRates = [80, 83, 87, 90];
          industryAverages = [72, 74, 77, 79];
        }
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Our Success Rate',
              data: successRates,
              backgroundColor: '#4CAF50'
            },
            {
              label: 'Industry Average',
              data: industryAverages,
              backgroundColor: '#2196F3'
            }
          ]
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuccessRates();
  }, [program, timeframe, consultantId]);

  const handleTimeframeChange = (newTimeframe: 'month' | 'quarter' | 'year') => {
    console.log('Changing timeframe to:', newTimeframe);
  };

  const handleProgramChange = (newProgram: CanadianImmigrationProgram) => {
    console.log('Changing program to:', newProgram);
  };

  const getProgramLabel = (programValue?: CanadianImmigrationProgram): string => {
    if (!programValue) return 'All Programs';
    
    const labels: Record<string, string> = {
      expressEntry: 'Express Entry',
      pnp: 'Provincial Nominee Program',
      familySponsorship: 'Family Sponsorship',
      businessImmigration: 'Business Immigration',
      temporaryResidence: 'Temporary Residence'
    };
    
    return labels[programValue] || programValue;
  };

  return (
    <div className="success-rate-chart">
      <h2>Application Success Rates</h2>
      <p className="chart-description">
        Compare our success rates with industry averages for {getProgramLabel(program)}.
      </p>
      
      <div className="chart-filters">
        <div className="filter-group">
          <label htmlFor="timeframe-filter">Timeframe:</label>
          <select
            id="timeframe-filter"
            value={timeframe}
            onChange={(e) => handleTimeframeChange(e.target.value as 'month' | 'quarter' | 'year')}
            className="filter-select"
          >
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="program-filter">Program:</label>
          <select
            id="program-filter"
            value={program || 'all'}
            onChange={(e) => handleProgramChange(e.target.value === 'all' ? undefined : e.target.value as CanadianImmigrationProgram)}
            className="filter-select"
          >
            <option value="all">All Programs</option>
            <option value="expressEntry">Express Entry</option>
            <option value="pnp">Provincial Nominee Program</option>
            <option value="familySponsorship">Family Sponsorship</option>
            <option value="businessImmigration">Business Immigration</option>
            <option value="temporaryResidence">Temporary Residence</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading chart data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : chartData ? (
        <div className="chart-container">
          {/* In a real implementation, this would use a charting library like Chart.js */}
          <div className="chart-placeholder">
            <div className="chart-legend">
              {chartData.datasets.map((dataset, index) => (
                <div key={index} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: dataset.backgroundColor }}
                  ></span>
                  <span className="legend-label">{dataset.label}</span>
                </div>
              ))}
            </div>
            
            <div className="chart-bars">
              {chartData.labels.map((label, labelIndex) => (
                <div key={labelIndex} className="chart-bar-group">
                  <div className="chart-label">{label}</div>
                  <div className="bars">
                    {chartData.datasets.map((dataset, datasetIndex) => (
                      <div 
                        key={datasetIndex} 
                        className="bar"
                        style={{ 
                          height: `${dataset.data[labelIndex]}%`,
                          backgroundColor: dataset.backgroundColor
                        }}
                      >
                        <span className="bar-value">{dataset.data[labelIndex]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="chart-insights">
            <h3>Key Insights</h3>
            <ul>
              <li>Our success rates consistently exceed industry averages by 10-15%</li>
              <li>Success rates have been steadily improving over time</li>
              <li>The most recent period shows our highest success rate yet at 92%</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuccessRateChart;
