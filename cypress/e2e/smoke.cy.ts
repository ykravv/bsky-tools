describe("smoke tests", () => {
  it("should open login form", () => {
    cy.visitAndCheck("/");

    cy.findByText("Sign in to your account").should("exist");
  });
});
