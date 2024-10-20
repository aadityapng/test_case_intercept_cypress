describe("OrangeHRM Login E2E Tests", () => {
  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  });

  it("LOGIN_001: Should login successfully with valid credentials", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  });

  it("LOGIN_002: Should show error for invalid username", () => {
    cy.get('input[name="username"]').type("wronguser");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_003: Should show error for invalid password", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_004: Should validate empty fields", () => {
    cy.get('button[type="submit"]').click();
    cy.get("form").within(() => {
      cy.contains("Required").should("be.visible");
    });
  });

  it("LOGIN_005: Should allow login using keyboard navigation", () => {
    cy.get('input[name="username"]').type("Admin");

    // Simulasikan penekanan Tab plugin cypress-real-events
    cy.realPress("Tab");

    cy.get('input[name="password"]')
      .should("have.focus")
      .type("admin123{enter}");

    cy.url().should("include", "/dashboard");
  });

  it("LOGIN_006: Should measure login response time", () => {
    const startTime = new Date().getTime();
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url()
      .should("include", "/dashboard")
      .then(() => {
        const endTime = new Date().getTime();
        const responseTime = endTime - startTime;
        expect(responseTime).to.be.lessThan(3000);
      });
  });

  // Additional test cases

  it("LOGIN_007: Should navigate to forgot password page", () => {
    cy.contains("Forgot your password?").click();
    cy.url().should("include", "/requestPasswordResetCode");
    cy.contains("Reset Password").should("be.visible");
  });

  it("LOGIN_008: Should handle very long usernames", () => {
    const longUsername = "a".repeat(100);
    cy.get('input[name="username"]').type(longUsername, { delay: 0 });
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_009: Should be resilient to simple SQL injection attempts", () => {
    cy.get('input[name="username"]').type("' OR '1'='1");
    cy.get('input[name="password"]').type("' OR '1'='1");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  it("LOGIN_010: Should handle caps lock input", () => {
    cy.get('input[name="username"]').type("ADMIN");
    cy.get('input[name="password"]').type("ADMIN123");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });
});
