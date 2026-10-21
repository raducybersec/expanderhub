import { expect, test } from '@playwright/test';
import { RegistrationPage } from '../pages/registration-page';
import { EmailPage } from '../pages/email-page';


const firstName = 'Razvan';
const lastName = 'Ionescu';
const email = `${firstName}${lastName}@yopmail.com`.toLowerCase();

test('E2E test', async ({ page }) => {
  await test.step('Fill out registration form and submit', async () => {
    const registrationPage = new RegistrationPage(page);


    await registrationPage.gotoEvent(2);
    await registrationPage.fillApplicantDetails(firstName, lastName, email);

    await expect(registrationPage.fullNameField).toHaveValue(
      `${firstName} ${lastName}`,
    );
    await expect(registrationPage.emailField).toHaveValue(email);
    await registrationPage.expectSecurityCheckVisible();
    const securityCheckValue = await registrationPage.solveSecurityCheck();
    await registrationPage.securityCheckAnswerField.fill(securityCheckValue);
    await registrationPage.pressRegisterButton();
    await expect(registrationPage.confirmationMessage).toBeVisible();
  })

  await test.step('Get account password', async () => {
    const emailPage = new EmailPage(page);
    await emailPage.gotoEmail();
    await emailPage.pressConsentButton();
    await emailPage.fillEmailDetails(email.split('@')[0]);
    await emailPage.pressSubmitButton();
    await emailPage.openEmail();
    const temporaryPassword = await emailPage.getTemporaryPassword();
    console.log('Temporary password:', temporaryPassword);
    const confirmationPage = await emailPage.pressConfirmationEmailButton();
    await expect(confirmationPage.locator('h1.ok')).toBeVisible();
  })

});
