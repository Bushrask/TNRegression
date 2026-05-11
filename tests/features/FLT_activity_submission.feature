@activitySubmission
Feature: Activity submission with Rich Text Editor

  As a learner, I want to submit my work for an activity
  so that I can complete the learning requirements.

  Background:
    Given the user is on the login page

  Scenario: Candidate can see RTE for activity submission
    Given the user logs in as "<ROLE>"
    When the user navigates to the Learn page and opens activity
    Then the activity should load all elements
    
    Examples:
  | ROLE   |
  | NonB2B |


