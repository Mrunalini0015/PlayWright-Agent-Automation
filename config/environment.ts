import authenticationData from '../test-data/authentication.json';

const authUrl = process.env.SAUCE_AUTH_URL?.trim() || authenticationData.loginUrl;

export const environment = {
  authUrl,
  authUsername: process.env.SAUCE_AUTH_USERNAME?.trim() || '',
  authPassword: process.env.SAUCE_AUTH_PASSWORD || '',
  authSuccessUrl: process.env.SAUCE_AUTH_SUCCESS_URL?.trim() || '',
  allowAuthSubmission: process.env.SAUCE_ALLOW_AUTH_SUBMISSION === 'true',
} as const;
