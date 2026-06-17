 @leave
Feature: Apply Leave Flow

  Scenario: User applies for leave successfully
    Given the user logs in as "NonB2B" to apply for leave
    When user navigates to apply leave page
    And user fills leave form
    And user submits leave request
    Then leave should be applied successfully
