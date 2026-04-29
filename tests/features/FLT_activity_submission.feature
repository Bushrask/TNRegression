@activitySubmission
Feature: Activity submission with Rich Text Editor

  As a learner, I want to submit my work for an activity
  so that I can complete the learning requirements.

  Background:
    Given the user is on the login page

  Scenario: Candidate can see RTE for activity submission
    When the user logs in as "<ROLE>"
    And the user navigates to the Learn page
    And the user opens the first activity with status Open or Late
    Then the activity submissions tab should show an RTE under My Work
    
    Examples:
  | ROLE   |
  | NonB2B |
  | B2B    |
  | MED    |
  | MEL    |
  | MRnG   |


