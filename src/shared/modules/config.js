const path = require('path');
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../../env/', '.env')});
const keys = Object.entries(process.env).entries()

const interpolatedClientKeys = [
  {
    "tenant": process.env.CLIENT_SOURCE_TENANT,
    "key": process.env.CLIENT_SOURCE_KEY
  },
  {
    "tenant": process.env.CLIENT_DEST_TENANT,
    "key": process.env.CLIENT_DEST_KEY
  }
];

module.exports = {
  admissionsBaseUrl: process.env.ADMISSIONS_INTEGRATION_BASE_URL,
  referenceDataBaseUrl:process.env.REFERENCE_INTEGRATION_BASE_URL,
  idsBaseUrl:process.env.IDS_BASE_URL,
  clientKey: process.env.CLIENT_KEY,
  clientKeys: interpolatedClientKeys,
  clientId: process.env.CLIENT_ID,
  preview: process.env.PREVIEW_VERSION,
  stable: process.env.STABLE_VERSION,
  source: process.env.CLIENT_SOURCE_TENANT,
  tenant: process.env.CLIENT_SOURCE_TENANT,
  destination: process.env.CLIENT_DEST_TENANT
};