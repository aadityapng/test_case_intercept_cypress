export default class LoginPage {
  static inputUsername() {
    return cy.get('input[name="username"]');
  }

  static inputPassword() {
    return cy.get('input[name="password"]');
  }

  static buttonSubmit() {
    return cy.get('button[type="submit"]');
  }

  static dashboardPage() {
    return cy.contains("Dashboard");
  }

  static errorMessage() {
    return cy.contains("Invalid credentials");
  }

  static requiredFieldError() {
    return cy.contains("Required");
  }

  static forgotPasswordLink() {
    return cy.contains("Forgot your password?");
  }

  static resetPasswordHeader() {
    return cy.contains("Reset Password");
  }
}