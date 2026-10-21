import { expect, type Locator, type Page } from '@playwright/test';
import { solveMathFromText } from '../helpers/solveMathFromText';

export class RegistrationPage {
  readonly fullNameField: Locator;
  readonly emailField: Locator;
  readonly securityCheckQuestion: Locator;
  readonly securityCheckAnswerField: Locator;
  readonly registerButton: Locator;
  readonly confirmationMessage: Locator;

  constructor(private readonly page: Page) {
    this.fullNameField = page.getByRole('textbox', { name: 'Full name' });
    this.emailField = page.getByRole('textbox', { name: 'Email address' });
    this.securityCheckQuestion = page.getByText(/^Security check:\s*.+$/);
    this.securityCheckAnswerField = page.getByRole('spinbutton', { name: /^Security check:/ });
    this.registerButton = page.getByRole('button', { name: 'Register for this event' });
    this.confirmationMessage = page.locator('.signup-message', { hasText: 'Check your inbox. Use the confirmation button in the email to complete your registration.' });
  }

  async gotoEvent(eventId: number): Promise<void> {
    await this.page.goto(`https://expanderhub.com/event.php?id=${eventId}`);
  }

  async fillApplicantDetails(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<void> {
    await this.fullNameField.fill(`${firstName} ${lastName}`);
    await this.emailField.fill(email);
  }

  async expectSecurityCheckVisible(): Promise<void> {
    await expect(this.securityCheckQuestion).toBeVisible();
  }

  async solveSecurityCheck(): Promise<string> {
    const securityQuestion = await this.securityCheckQuestion.textContent({ timeout: 5000 });
    if (!securityQuestion) {
      throw new Error('Security check question is empty');
    }
    return String(solveMathFromText(securityQuestion));
  }

  async pressRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }
}