const { configure } = require('@testing-library/react');
const { setupServer } = require('msw/node');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

configure({
  testIdAttribute: 'data-testid',
});

const server = setupServer();

module.exports = {
  server,
};
