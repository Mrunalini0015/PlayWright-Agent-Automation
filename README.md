# Playwright Agent Automation

Playwright test automation using TypeScript, page objects, a shared fixture, and a page manager.

## Authentication tests

The authentication implementation uses root-level sibling folders:

- `config/` - environment configuration
- `fixtures/` - custom Playwright fixtures
- `pages/` - page objects and the page manager
- `test-data/` - JSON test data
- `tests/` - Playwright specs

Copy `.env.example` to `.env` and set `SAUCE_AUTH_URL` for an authorized test tenant. Credential-based scenarios are disabled by default. To enable them, provide a dedicated test account, set `SAUCE_AUTH_SUCCESS_URL` to a stable post-login URL, and explicitly set `SAUCE_ALLOW_AUTH_SUBMISSION=true`. The credential-submission scenarios run only in Chromium and should never use production user credentials.

Run the authentication tests with:

```bash
npm run test:auth:chromium
```

The UI-only tests can run without credentials or enabling authentication submissions. Test data is loaded from `test-data/authentication.json`; environment values are loaded from `.env` by Playwright configuration.
