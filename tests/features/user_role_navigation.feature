Feature: User navigation based on role

  @candidate
Scenario Outline: Verify navigation for <ROLE> user
  Given the user is on the login page
  When the user logs in as "<ROLE>"
  Then the "<ROLE>" user should be able to navigate to their dashboard pages

Examples:
  | ROLE   |
  | NonB2B |
  | B2B    |
  | MED    |
  | MEL    |
  | MRnG   |


  @instructor
  Scenario: Verify navigation for Instructor user
    Given the user is on the login page
    When the user logs in as "Instructor"
    Then the "Instructor" user should be able to navigate to their dashboard pages

  @mentor
  Scenario: Verify navigation for Mentor user
    Given the user is on the login page
    When the user logs in as "Mentor"
    Then the "Mentor" user should be able to navigate to their dashboard pages
