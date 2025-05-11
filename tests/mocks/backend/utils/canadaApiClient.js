/**
 * Mock client for fetching data from Canadian immigration APIs
 */

const fetchExpressEntryDraws = async () => {
  return [
    {
      drawNumber: 123,
      drawDate: '2023-01-15',
      immigrationProgram: 'Federal Skilled Worker',
      minimumScore: 470,
      invitationsIssued: 3500
    },
    {
      drawNumber: 124,
      drawDate: '2023-02-01',
      immigrationProgram: 'Canadian Experience Class',
      minimumScore: 455,
      invitationsIssued: 4500
    }
  ];
};

const fetchProvincialPrograms = async () => {
  return [
    {
      province: 'Ontario',
      programName: 'Ontario Immigrant Nominee Program',
      streams: ['Skilled Worker', 'International Student', 'Entrepreneur'],
      website: 'https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp'
    },
    {
      province: 'British Columbia',
      programName: 'BC Provincial Nominee Program',
      streams: ['Skilled Worker', 'International Graduate', 'Entry Level and Semi-Skilled'],
      website: 'https://www.welcomebc.ca/Immigrate-to-B-C/B-C-Provincial-Nominee-Program'
    }
  ];
};

const fetchImmigrationNews = async () => {
  return [
    {
      title: 'Canada to welcome 500,000 immigrants per year by 2025',
      date: '2023-01-10',
      source: 'Immigration, Refugees and Citizenship Canada',
      url: 'https://www.canada.ca/en/immigration-news'
    },
    {
      title: 'New pathways for international students announced',
      date: '2023-02-05',
      source: 'Immigration, Refugees and Citizenship Canada',
      url: 'https://www.canada.ca/en/immigration-news'
    }
  ];
};

module.exports = {
  fetchExpressEntryDraws,
  fetchProvincialPrograms,
  fetchImmigrationNews
};
