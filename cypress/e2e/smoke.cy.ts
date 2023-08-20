describe("smoke tests", () => {
  it("should open login form", () => {
    cy.visit("/");

    cy.findByText("Sign in to your account").should("exist");
  });
});
