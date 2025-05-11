/**
 * API client for external data sources
 */
const axios = require('axios');
const { translateMessage } = require('./localization');

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Fetch data from external API
 * @param {string} url - API endpoint URL
 * @param {Object} options - Request options
 * @param {string} locale - Locale for error messages
 * @returns {Promise<Object>} - API response data
 */
async function fetchExternalData(url, options = {}, locale = 'en') {
  try {
    const { method = 'GET', data = null, headers = {}, params = {} } = options;
    
    const response = await apiClient({
      url,
      method,
      data,
      headers,
      params
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('API request failed:', error);
    
    let errorMessage = translateMessage('api_request_failed', locale);
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      
      if (statusCode === 404) {
        errorMessage = translateMessage('resource_not_found', locale);
      } else if (statusCode === 401 || statusCode === 403) {
        errorMessage = translateMessage('authentication_failed', locale);
      } else if (statusCode === 429) {
        errorMessage = translateMessage('rate_limit_exceeded', locale);
      }
    } else if (error.request) {
      errorMessage = translateMessage('no_response_from_server', locale);
    }
    
    return {
      success: false,
      error: {
        message: errorMessage,
        statusCode,
        details: error.response?.data || null
      }
    };
  }
}

/**
 * Fetch data from immigration API
 * @param {string} country - Country code
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @param {string} locale - Locale for error messages
 * @returns {Promise<Object>} - API response data
 */
async function fetchImmigrationData(country, endpoint, options = {}, locale = 'en') {
  const baseUrls = {
    ca: process.env.CANADA_IMMIGRATION_API_URL || 'https://api.canada.ca/immigration',
    us: process.env.US_IMMIGRATION_API_URL || 'https://api.usa.gov/immigration',
    au: process.env.AUSTRALIA_IMMIGRATION_API_URL || 'https://api.australia.gov.au/immigration',
    uk: process.env.UK_IMMIGRATION_API_URL || 'https://api.gov.uk/immigration',
    nz: process.env.NZ_IMMIGRATION_API_URL || 'https://api.govt.nz/immigration'
  };
  
  const baseUrl = baseUrls[country.toLowerCase()];
  
  if (!baseUrl) {
    return {
      success: false,
      error: {
        message: translateMessage('unsupported_country', locale, { country }),
        statusCode: 400
      }
    };
  }
  
  const url = `${baseUrl}/${endpoint}`;
  
  const apiKeyEnvVar = `${country.toUpperCase()}_IMMIGRATION_API_KEY`;
  const apiKey = process.env[apiKeyEnvVar];
  
  if (apiKey) {
    options.headers = {
      ...options.headers,
      'X-API-Key': apiKey
    };
  }
  
  return fetchExternalData(url, options, locale);
}

/**
 * Fetch latest immigration news
 * @param {string} country - Country code
 * @param {Object} options - Request options
 * @param {string} locale - Locale for error messages
 * @returns {Promise<Object>} - News data
 */
async function fetchImmigrationNews(country, options = {}, locale = 'en') {
  return fetchImmigrationData(country, 'news', options, locale);
}

/**
 * Fetch immigration program details
 * @param {string} country - Country code
 * @param {string} programCode - Immigration program code
 * @param {Object} options - Request options
 * @param {string} locale - Locale for error messages
 * @returns {Promise<Object>} - Program data
 */
async function fetchProgramDetails(country, programCode, options = {}, locale = 'en') {
  return fetchImmigrationData(country, `programs/${programCode}`, options, locale);
}

/**
 * Fetch processing times
 * @param {string} country - Country code
 * @param {string} programCode - Immigration program code
 * @param {Object} options - Request options
 * @param {string} locale - Locale for error messages
 * @returns {Promise<Object>} - Processing time data
 */
async function fetchProcessingTimes(country, programCode, options = {}, locale = 'en') {
  return fetchImmigrationData(country, `processing-times/${programCode}`, options, locale);
}

/**
 * Fetch document checklist
 * @param {string} country - Country code
 * @param {string} programCode - Immigration program code
 * @param {Object} options - Request options
 * @param {string} locale - Locale for error messages
 * @returns {Promise<Object>} - Document checklist data
 */
async function fetchDocumentChecklist(country, programCode, options = {}, locale = 'en') {
  return fetchImmigrationData(country, `documents/${programCode}`, options, locale);
}

module.exports = {
  fetchExternalData,
  fetchImmigrationData,
  fetchImmigrationNews,
  fetchProgramDetails,
  fetchProcessingTimes,
  fetchDocumentChecklist
};
