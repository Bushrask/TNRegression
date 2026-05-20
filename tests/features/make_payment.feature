@paymentViaPayPal
Feature: Make payment using paypal

  As a user, I want to make payment using paypal.

  Background:
    Given the user is on the login page

  Scenario: Candidate can make payment using PayPal
    Given the user logs in as "<ROLE>"
    When the user navigates to the Manage Payment page and opens Make Payments pop up
    Then the user should be able to make successful payment using PayPal
    
    When the user navigates to the Profile page and opens Make Payments pop up
    Then the user should be able to make successful payment using PayPal
    
    Examples:
  | ROLE   |
  | NonB2B |


