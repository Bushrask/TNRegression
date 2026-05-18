@activitySubmission
Feature: Activity submission with Rich Text Editor

  As a learner, I want to submit my work for an activity
  so that I can complete the learning requirements.

  Background:
    Given the user is on the login page

  Scenario: Candidate can see all elements of the activity when they open it
    Given the user logs in as "<ROLE>"
    When the user navigates to the Learn page and opens activity
    Then the activity should get successfully loaded and submitted
    
    Examples:
  | ROLE   |
  | NonB2B |


