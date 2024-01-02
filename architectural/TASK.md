# Architectural Challenge Task

## Objective

Your team needs to build a static front end website that is publicly available.

The website needs to display a list of user posts, ordered by the date they were submitted, with recent posts displaying first, and older posts displaying afterwards.

The website also needs to allow a user to submit a post, which will be displayed in the list of posts.

A posts consist of a username, and a message, both of which are strings.

When a post is submitted it should not be displayed on the website until it is approved.

A third party service exists which provides an API endpoint that posts can be submitted to.

The API will return true if the post is approved, or false if it is declined.

If the post is approved then it should display on the site.

If the post is declined then it should be deleted.

The API can take up to 30 seconds to respond.

## Instructions

Please describe, using words and / or diagrams, how you would architect the solution for the above objective using AWS services.
