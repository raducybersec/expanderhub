import { expect, type Locator, type Page } from '@playwright/test';

export class EmailPage {
  readonly usernameTextField: Locator;
  readonly submitButton: Locator;
  readonly consentButton: Locator;
  readonly emailReceivedMessage: Locator;
  readonly confirmationEmailHeading: Locator;
  readonly temporaryPasswordLocator: Locator;
  readonly confirmationEmailButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameTextField = page.getByPlaceholder('Enter your inbox here');
    this.submitButton = page.getByRole('button', { name: '' });
    this.consentButton = page.getByRole('button', { name: 'Consent' });

    this.emailReceivedMessage = page
      .frameLocator('iframe[name="ifinbox"]')
      .getByRole('button', { name: /ExpanderHub Confirm your registration/ });

    this.confirmationEmailHeading = page
      .frameLocator('iframe[name="ifmail"]')
      .getByRole('heading', { name: 'Confirm your event registration' });
    this.temporaryPasswordLocator = page
      .frameLocator('iframe[name="ifmail"]')
      .getByText('Temporary password:', { exact: true });
    this.confirmationEmailButton = page
      .frameLocator('iframe[name="ifmail"]')
      .getByRole('link', { name: 'Confirm email and register' });
  }

  async gotoEmail(): Promise<void> {
    await this.page.goto('https://yopmail.com/');
  }

  async fillEmailDetails(username: string): Promise<void> {
    await this.usernameTextField.fill(username);
  }

  async pressSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  async pressConsentButton(): Promise<void> {
    await this.consentButton.click();
  }

  async openEmail(): Promise<void> {
    await this.emailReceivedMessage.click();
    await expect(this.confirmationEmailHeading).toBeVisible();
  }

  async getTemporaryPassword(): Promise<string> {
    const password = await this.temporaryPasswordLocator.evaluate((label) => {
      const value = label.nextSibling?.textContent?.trim();
      return value?.split(/\s+/)[0] ?? '';
    });
    if (!password) {
      throw new Error('Temporary password was not found in the confirmation email');
    }
    return password;
  }

  async pressConfirmationEmailButton(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.confirmationEmailButton.click();
    return await popupPromise;
  }

}