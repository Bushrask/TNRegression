@mouProcess
Feature: Manage MOU Process

    As a user, I want to complete the MOU process and remove the school if needed.

    Background:
        Given the user is on the login page

    @suggestSchool
    Scenario: Candidate completes MOU flow and removes school

        Given the user logs in as "NonB2B" for mou process
        When the user navigates to the Clinical page
        And the user navigates to the Suggest School section
        And the user adds school details and mentor details
        And the user clicks on Save
        Then a confirmation pop up to send MOU to school supervisor should appear

        When the user clicks Yes on the pop up
        Then the MOU should be sent to the school supervisor
        And the MOU status section should appear

        When the user clicks on Remove School button
        Then the MoU status section should be hidden

    @viewSchool
    Scenario: B2B user selects a school from list and saves details

        Given the user logs in as "B2B" for mou process
        When the user navigates to the Clinical page
        And the user clicks on View Schools List
        And the user selects a school from the popup
        And the user fills the remaining school details
        And the user clicks on Save

        When the user clicks on Remove School button
        Then the MoU status section should be hidden
