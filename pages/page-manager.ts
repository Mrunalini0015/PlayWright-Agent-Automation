import type { Page } from '@playwright/test';
import { AuthenticationPage } from './authentication.page';

export class PageManager {
  readonly authenticationPage: AuthenticationPage;

  constructor(page: Page) {
    this.authenticationPage = new AuthenticationPage(page);
  }
}
