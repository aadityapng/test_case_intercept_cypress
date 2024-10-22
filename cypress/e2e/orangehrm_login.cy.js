import LoginPage from "../POM/login.cy.js";

describe("OrangeHRM Login E2E Tests", () => {
  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  });

  it("LOGIN_001: Should login successfully with valid credentials", () => {
    cy.intercept("GET", "**/action-summary").as("loginRequest");

    LoginPage.inputUsername().type("Admin");
    LoginPage.inputPassword().type("admin123");
    LoginPage.buttonSubmit().click();
    cy.wait("@loginRequest").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(200);
    });
    cy.url().should("include", "/dashboard");
    LoginPage.dashboardPage().should("be.visible");
  });

  it("LOGIN_002: Should show error for invalid username", () => {
    LoginPage.inputUsername().type("wronguser");
    LoginPage.inputPassword().type("admin123");
    LoginPage.buttonSubmit().click();

    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_003: Should show error for invalid password", () => {
    LoginPage.inputUsername().type("Admin");
    LoginPage.inputPassword().type("wrongpass");
    LoginPage.buttonSubmit().click();

    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_004: Should validate empty fields", () => {
    LoginPage.buttonSubmit().click();
    cy.get("form").within(() => {
      cy.contains("Required").should("be.visible");
    });
  });

  it("LOGIN_005: Should allow login using keyboard navigation", () => {
    cy.intercept("GET", "**/action-summary").as("loginRequest");

    LoginPage.inputUsername().type("Admin");
    cy.realPress("Tab");
    LoginPage.inputPassword().should("have.focus").type("admin123{enter}");

    cy.wait("@loginRequest").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(200);
    });
    cy.url().should("include", "/dashboard");
  });

  it("LOGIN_006: Should measure login response time", () => {
    cy.intercept("GET", "**/action-summary").as("loginRequest");

    const startTime = new Date().getTime();
    LoginPage.inputUsername().type("Admin");
    LoginPage.inputPassword().type("admin123");
    LoginPage.buttonSubmit().click();

    cy.wait("@loginRequest").then((intercept) => {
      const endTime = new Date().getTime();
      const responseTime = endTime - startTime;
      expect(responseTime).to.be.lessThan(5000);
      expect(intercept.response.statusCode).to.equal(200);
    });
  });

  it("LOGIN_007: Should navigate to forgot password page", () => {
    cy.intercept("GET", "**/requestPasswordResetCode").as(
      "forgotPasswordRequest"
    );

    cy.contains("Forgot your password?").click();
    cy.wait("@forgotPasswordRequest").then((intercept) => {
      expect(intercept.response.statusCode).to.equal(200);
    });
    cy.url().should("include", "/requestPasswordResetCode");
    cy.contains("Reset Password").should("be.visible");
  });

  it("LOGIN_008: Should handle very long usernames", () => {
    const longUsername = "a".repeat(100);
    LoginPage.inputUsername().type(longUsername, { delay: 0 });
    LoginPage.inputPassword().type("admin123");
    LoginPage.buttonSubmit().click();

    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_009: Should be resilient to simple SQL injection attempts", () => {
    LoginPage.inputUsername().type("' OR '1'='1");
    LoginPage.inputPassword().type("' OR '1'='1");
    LoginPage.buttonSubmit().click();

    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_010: Should handle caps lock input", () => {
    LoginPage.inputUsername().type("ADMIN");
    LoginPage.inputPassword().type("ADMIN123");
    LoginPage.buttonSubmit().click();

    cy.contains("Invalid credentials").should("be.visible");
  });
});
