# Architectal Challenge

## Overview

This `README` is my solution to the architectural challenge task that can be found in [TASK.md](./TASK.md).

## Design

### Initial thoughts and considerations

Thoughts about what will be required:

- Requires a publically available static site (could probably use AWS Amplify)
- Requires somewhere to store posts (could probably use AWS AppSync / AWS DynamoDB)
- Requires some mechanism to retrieve approved posts (could probably use some API; AWS AppSync / API Gateway / AWS Lambda)
- Requires some asynchronous mechanism to approve posts (could probably use AWS DynamoDB streams and AWS Lambda)

Ambiguity in the challenge task:

- The challenge task does not mention if my team (or organisation) has a registered domain to use for the site or not
- The challenge task does not mention expected traffic or where traffic will come from, as to whether a CDN is required or not
- The challenge task does not mention anything about authentication or authorization for submitting posts or whether any log in fucntionality should be provided as part of this site or is centralised elsewhere in the organisation
- The challenge task does not mention whether the third party API requires any credentials or tokens for use
- The challenge task does not mention whether the third party API had any rate limiting applied to it
- The challenge does not mention what degree of monitoring of the application may be required, if at all
- The challenge task does not mention anything about having to design or create a deployment pipeline, anything about source code management or application state management (AWS CloudFormation vs HashiCorp Terraform etc)

### Assumptions and decisions

Due to some ambiguity, I have had to make some assumptions about what would be suitable for this solution. Normally with these types of decisions I would try and gain more understanding and may have more background knowledge as to how this solution fitted into the existing architecture of the organisation. I may also seek advice and guidance from colleagues to find the appropriate solution should it be necessary.

#### Assumptions

|Assumption| Consequence / Ramification |
|:---------|:---------------------------|
|A domain already exists or can be registered for this application| DNS will need to be provided as part of the design|
|Traffic and distribution of access does call for a CDN to be used|A CDN should be used as part of the design|
|Authentication is required to be able to create posts|Authentication is required as part of the design|
|The third party API does not require any credentials or tokens for use|No secrets are required to be stored for the third party API, so does not need to be part of the design|
|The third party API does not implement any rate limiting|Calls to the third party API can be in real time and do not require batching or delaying to avoid rate limiting|
|There are no specific monitoring requirements for the application|Basic monitoring will suffice in the design|
|Some mechanism for deploying to AWS already exists|There is no need to design a deployment pipeline as part of this design|

#### Decisions

- The application will use the AWS Amplify service for building and integrating the application, as well as deploying the application via CloudFormation
- As such, I would recommend using React for the front end framework to allow for easy integration of AWS Amplify client libraries
- Posts will be kept in a DynamoDB table
- The posts table will be interacted with using AppSync
- Cognito will be used for authentication and authorization
- A DynamoDB stream and Lambda function will be used to process post approvals in an asynchronous way, as this API may take more than 30 seconds to respond
- SQS will be used to store errored post approval requests

### Diagrams and explanation

#### Full design

![Full diagram](./images/Architectural%20Challenge-Diagram.drawio.png)

The above diagram shows the components that make up the design. The application is an AWS Amplify application using an AppSync integration backed by DynamoDB, with asynchronous processing using DynamoDB streams.

I will discuss the following individual aspects of the solution in more detail:

- [Deployment](#Deployment) - how the application is deployed
- [Site access](#Site%20access) - how the site is exposed and initially loaded
- [Authentication](#Authentication) - how users log into the application
- [Creating posts](#Creating%20posts) - how posts are created and subsequently approved

#### Deployment

![Deployment diagram](./images/Architectural%20Challenge-Deployment.drawio.png)

#### Site access

![Site access diagram](./images/Architectural%20Challenge-Site%20Access.drawio.png)

#### Authentication

![Authentication diagram](./images/Architectural%20Challenge-Authentication.drawio.png)

#### Creating posts

![Creating posts diagram](./images/Architectural%20Challenge-Creating%20Posts.drawio.png)

### Future extension and other potential options

- Alerting on errors
- More specific error handling such as implementing a dead letter queue for redriving failed messages etc
