import { test, expect } from '../fixtures/test.fixture';
import authenticationData from '../test-data/authentication.json';
import { environment } from '../config/environment';

test.describe('Sauce Labs authentication', () => {
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName === 'webkit',
      'The Sauce Labs account page does not render its sign-in application in the configured WebKit environment.',
    );
  });

  test('shows login fields and supported authentication options', async ({ pageManager }) => {
    const authPage = pageManager.authenticationPage;
    const page = authPage.getPage();

    await authPage.open();

    await expect(authPage.usernameInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
    await expect(authPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(authPage.rememberUsernameLabel).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(authenticationData.labels.google, 'i') })).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(authenticationData.labels.github, 'i') })).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(authenticationData.labels.sso, 'i') })).toBeVisible();
    await expect(page.getByRole('link', { name: authenticationData.labels.forgotPassword })).toBeVisible();
  });

  test('accepts and clears credential input without changing field values', async ({ pageManager }) => {
    const authPage = pageManager.authenticationPage;

    await authPage.open();
    await authPage.usernameInput.fill('test-user');
    await authPage.passwordInput.fill('test-password');
    await expect(authPage.usernameInput).toHaveValue('test-user');
    await expect(authPage.passwordInput).toHaveValue('test-password');

    await authPage.usernameInput.fill('');
    await authPage.passwordInput.fill('');
    await expect(authPage.usernameInput).toHaveValue('');
    await expect(authPage.passwordInput).toHaveValue('');
  });

  test('does not authenticate an empty credential submission', async ({ pageManager }) => {
    const authPage = pageManager.authenticationPage;
    const page = authPage.getPage();

    await authPage.open();
    if (await authPage.loginButton.isEnabled()) {
      await authPage.submit();
    }

    await expect(page).toHaveURL(/#login\/?$/);
    await expect(authPage.usernameInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
  });

  test('toggles remember username and keeps password masked', async ({ pageManager }) => {
    const authPage = pageManager.authenticationPage;

    await authPage.open();
    await authPage.rememberUsernameLabel.click();
    await expect(authPage.rememberUsernameCheckbox).toBeChecked();
    await authPage.rememberUsernameLabel.click();
    await expect(authPage.rememberUsernameCheckbox).not.toBeChecked();
    await expect(authPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('opens and returns from password recovery', async ({ pageManager }) => {
    const authPage = pageManager.authenticationPage;
    const page = authPage.getPage();

    await authPage.open();
    await authPage.openPasswordReset();

    await expect(page.getByLabel(authenticationData.labels.resetUsername, { exact: true })).toBeVisible();
    await expect(page.getByLabel(authenticationData.labels.resetEmail, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', {
      name: authenticationData.labels.resetSubmit,
      exact: true,
    })).toBeDisabled();

    await authPage.openLoginFromPasswordReset();
    await expect(authPage.usernameInput).toBeVisible();
  });

  test('rejects invalid credentials without revealing account details', async ({ pageManager }, testInfo) => {
    test.skip(!environment.allowAuthSubmission, 'Enable only for an authorized test tenant with SAUCE_ALLOW_AUTH_SUBMISSION=true.');
    test.skip(testInfo.project.name !== 'chromium', 'Credential submission is limited to one browser to avoid repeated attempts.');

    const authPage = pageManager.authenticationPage;
    const page = authPage.getPage();
    await authPage.open();
    await authPage.fillCredentials(
      authenticationData.invalidCredentials.username,
      authenticationData.invalidCredentials.password,
    );
    await authPage.submit();

    const error = page.getByText(new RegExp(authenticationData.errorTextPattern, 'i')).first();
    await expect(error).toBeVisible();
    await expect(authPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('signs in with the authorized test account', async ({ pageManager }, testInfo) => {
    test.skip(!environment.allowAuthSubmission, 'Enable only for an authorized test tenant with SAUCE_ALLOW_AUTH_SUBMISSION=true.');
    test.skip(!environment.authUsername || !environment.authPassword, 'Set SAUCE_AUTH_USERNAME and SAUCE_AUTH_PASSWORD in .env.');
    test.skip(!environment.authSuccessUrl, 'Set SAUCE_AUTH_SUCCESS_URL to a stable post-login URL for the test tenant.');
    test.skip(testInfo.project.name !== 'chromium', 'Credential submission is limited to one browser to avoid repeated attempts.');

    const authPage = pageManager.authenticationPage;
    const page = authPage.getPage();
    await authPage.open();
    await authPage.fillCredentials(environment.authUsername, environment.authPassword);
    await authPage.submit();

    await expect(page).toHaveURL(new RegExp(escapeRegExp(environment.authSuccessUrl)));
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
