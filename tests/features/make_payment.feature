@payment
Feature: Make payment using paypal

  As a user, I want to make payment using paypal.

  Background:
    Given the user is on the login page

  @managePayment
    @makePayment
    Scenario Outline: Candidate can make payment from Manage Payment page
      Given the user logs in as "NonB2B"
      When the user navigates to the Manage Payment page and opens Make Payments pop up
      Then the user should be able to make successful payment using PayPal

      @testPrep
      Scenario Outline: Candidate can purchase testPrep from Manage Payment page
      Given the user logs in as "NonB2B"
      When the user navigates to the Manage Payment page and opens Purchase TestPrep pop up
      Then the user should be able to make successful payment using PayPal

      @parchment
      Scenario Outline: Candidate can purchase parchment from Manage Payment page
      Given the user logs in as "NonB2B"
      When the user navigates to the Manage Payment page and opens Make Payment pop up and selects parchment option
      Then the user should be able to make successful payment using PayPal

  @profile
    @makePayment
    Scenario Outline: Candidate can make payment from Profile page
      Given the user logs in as "NonB2B"
      When the user navigates to the Profile page and opens Make Payments pop up
      Then the user should be able to make successful payment using PayPal
    
    @testPrep
    Scenario Outline: Candidate can purchase testPrep from Profile page
      Given the user logs in as "NonB2B"
      When the user navigates to the Profile page and opens Purchase TestPrep pop up
      Then the user should be able to make successful payment using PayPal

    @parchment
    Scenario Outline: Candidate can purchase parchment from Profile page
      Given the user logs in as "NonB2B"
      When the user navigates to the Profile page and opens Make Payment pop up and selects parchment option
      Then the user should be able to make successful payment using PayPal
  
  

