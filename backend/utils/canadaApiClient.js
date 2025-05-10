/**
 * Client for fetching data from Canadian immigration APIs
 */
const axios = require('axios');

/**
 * Fetch latest Express Entry draws
 * @returns {Promise<Array>} - Latest Express Entry draws
 */
exports.fetchLatestDraws = async () => {
  try {
    return getMockDraws();
  } catch (error) {
    console.error('Error fetching Express Entry draws:', error);
    throw new Error('Failed to fetch Express Entry draws');
  }
};

/**
 * Get mock Express Entry draws
 * @returns {Array} - Mock Express Entry draws
 */
function getMockDraws() {
  return [
    {
      drawNumber: 265,
      drawDate: '2025-05-08T12:00:00Z',
      program: 'All programs',
      invitationsIssued: 3,
      lowestScore: 491,
      tieBreakDate: '2025-04-15T12:00:00Z'
    },
    {
      drawNumber: 264,
      drawDate: '2025-04-24T12:00:00Z',
      program: 'Provincial Nominee Program',
      invitationsIssued: 1,
      lowestScore: 783,
      tieBreakDate: '2025-04-10T12:00:00Z'
    },
    {
      drawNumber: 263,
      drawDate: '2025-04-10T12:00:00Z',
      program: 'All programs',
      invitationsIssued: 5,
      lowestScore: 488,
      tieBreakDate: '2025-03-28T12:00:00Z'
    },
    {
      drawNumber: 262,
      drawDate: '2025-03-27T12:00:00Z',
      program: 'All programs',
      invitationsIssued: 5,
      lowestScore: 483,
      tieBreakDate: '2025-03-15T12:00:00Z'
    },
    {
      drawNumber: 261,
      drawDate: '2025-03-13T12:00:00Z',
      program: 'Provincial Nominee Program',
      invitationsIssued: 1,
      lowestScore: 778,
      tieBreakDate: '2025-02-28T12:00:00Z'
    }
  ];
}

/**
 * Fetch NOC codes and descriptions
 * @returns {Promise<Array>} - NOC codes and descriptions
 */
exports.fetchNOCCodes = async () => {
  try {
    return getMockNOCCodes();
  } catch (error) {
    console.error('Error fetching NOC codes:', error);
    throw new Error('Failed to fetch NOC codes');
  }
};

/**
 * Get mock NOC codes
 * @returns {Array} - Mock NOC codes
 */
function getMockNOCCodes() {
  return [
    {
      code: '00011',
      title: 'Legislators',
      category: '0',
      description: 'Legislators participate in the activities of a federal, provincial, territorial or local government legislative body or executive council, band council or school board as elected or appointed members.'
    },
    {
      code: '00012',
      title: 'Senior government managers and officials',
      category: '0',
      description: 'Senior government managers and officials plan, organize, direct, control and evaluate, through middle managers, the major activities of municipal or regional governments or of provincial, territorial or federal departments, boards, agencies or commissions.'
    },
    {
      code: '10010',
      title: 'Financial managers',
      category: '1',
      description: 'Financial managers plan, organize, direct, control and evaluate the operation of financial and accounting departments. They develop and implement the financial policies and systems of establishments.'
    },
    {
      code: '20012',
      title: 'Computer and information systems managers',
      category: '2',
      description: 'Computer and information systems managers plan, organize, direct, control and evaluate the activities of organizations that analyze, design, develop, implement, operate and administer computer and telecommunications software, networks and information systems.'
    },
    {
      code: '30010',
      title: 'Telecommunication carriers managers',
      category: '3',
      description: 'Telecommunication carriers managers plan, organize, direct, control and evaluate the operations of a telecommunications establishment, department or facility.'
    }
  ];
}

/**
 * Fetch Canadian provinces and territories
 * @returns {Promise<Array>} - Canadian provinces and territories
 */
exports.fetchProvinces = async () => {
  try {
    return getMockProvinces();
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Failed to fetch provinces');
  }
};

/**
 * Get mock Canadian provinces and territories
 * @returns {Array} - Mock Canadian provinces and territories
 */
function getMockProvinces() {
  return [
    {
      code: 'AB',
      name: 'Alberta',
      capital: 'Edmonton',
      population: 4371316
    },
    {
      code: 'BC',
      name: 'British Columbia',
      capital: 'Victoria',
      population: 5071336
    },
    {
      code: 'MB',
      name: 'Manitoba',
      capital: 'Winnipeg',
      population: 1369465
    },
    {
      code: 'NB',
      name: 'New Brunswick',
      capital: 'Fredericton',
      population: 776827
    },
    {
      code: 'NL',
      name: 'Newfoundland and Labrador',
      capital: 'St. John\'s',
      population: 521542
    },
    {
      code: 'NS',
      name: 'Nova Scotia',
      capital: 'Halifax',
      population: 969383
    },
    {
      code: 'NT',
      name: 'Northwest Territories',
      capital: 'Yellowknife',
      population: 44826
    },
    {
      code: 'NU',
      name: 'Nunavut',
      capital: 'Iqaluit',
      population: 38780
    },
    {
      code: 'ON',
      name: 'Ontario',
      capital: 'Toronto',
      population: 14570000
    },
    {
      code: 'PE',
      name: 'Prince Edward Island',
      capital: 'Charlottetown',
      population: 156947
    },
    {
      code: 'QC',
      name: 'Quebec',
      capital: 'Quebec City',
      population: 8501833
    },
    {
      code: 'SK',
      name: 'Saskatchewan',
      capital: 'Regina',
      population: 1174000
    },
    {
      code: 'YT',
      name: 'Yukon',
      capital: 'Whitehorse',
      population: 41000
    }
  ];
}
