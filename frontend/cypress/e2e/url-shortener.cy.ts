describe("URL Shortener", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should shorten a URL successfully", () => {
    cy.intercept("POST", "**/v1/urls", {
      statusCode: 200,
      body: {
        shortUrl: "https://short.king/abc123",
      },
    }).as("shortenUrl");

    cy.get('input[type="url"]').type("https://example.com/very/long/url");

    cy.get("button")
      .contains(/shorten url/i)
      .click();

    cy.wait("@shortenUrl");

    cy.contains("https://short.king/abc123").should("be.visible");
  });

  it("should handle errors gracefully", () => {
    cy.intercept("POST", "**/v1/urls", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("shortenUrlError");

    cy.get('input[type="url"]').type("https://example.com/very/long/url");

    cy.get("button")
      .contains(/shorten url/i)
      .click();

    cy.wait("@shortenUrlError");

    cy.contains(/failed to shorten url/i).should("be.visible");
  });
});
