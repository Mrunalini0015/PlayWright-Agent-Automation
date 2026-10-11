import { expect, type Locator, type Page } from '@playwright/test';
import { environment } from '../config/environment';
import authenticationData from '../test-data/authentication.json';

export class AuthenticationPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberUsernameCheckbox: Locator;
  readonly rememberUsernameLabel: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByLabel(authenticationData.labels.username, { exact: true });
    this.passwordInput = page.getByLabel(authenticationData.labels.password, { exact: true });
    this.rememberUsernameCheckbox = page.getByRole('checkbox', {
      name: authenticationData.labels.rememberUsername,
    });
    this.rememberUsernameLabel = page.getByText(authenticationData.labels.rememberUsername, {
      exact: true,
    });
    this.loginButton = page.getByRole('button', {
      name: authenticationData.labels.loginButton,
      exact: true,
    });
    this.forgotPasswordLink = page.getByRole('link', {
      name: authenticationData.labels.forgotPassword,
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto(environment.authUrl);
    await expect(this.page.getByRole('heading', {
      name: authenticationData.labels.signInHeading,
      exact: true,
    })).toBeVisible();
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async openPasswordReset(): Promise<void> {
    await this.forgotPasswordLink.click();
    await expect(this.page.getByRole('heading', {
      name: authenticationData.labels.resetPasswordHeading,
      exact: true,
    })).toBeVisible();
  }

  async openLoginFromPasswordReset(): Promise<void> {
    await this.page.getByRole('link', {
      name: authenticationData.labels.returnToLogin,
      exact: true,
    }).click();
    await expect(this.page.getByRole('heading', {
      name: authenticationData.labels.signInHeading,
      exact: true,
    })).toBeVisible();
  }

  getPage(): Page {
    return this.page;
  }
}
