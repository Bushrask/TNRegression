@paymentViaPayPal
Feature: Make payment using paypal

  As a user, I want to make payment using paypal.

  Background:
    Given the user is on the login page
@managePayment
  Scenario Outline: Candidate can make payment from Manage Payment page
    Given the user logs in as "NonB2B"
    When the user navigates to the Manage Payment page and opens Make Payments pop up
    Then the user should be able to make successful payment using PayPal
@profile
  Scenario Outline: Candidate can make payment from Profile page
    Given the user logs in as "NonB2B"
    When the user navigates to the Profile page and opens Make Payments pop up
    Then the user should be able to make successful payment using PayPal
    


