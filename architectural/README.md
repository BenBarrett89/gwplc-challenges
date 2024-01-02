# Architectal Challenge

## Overview

This `README` is my solution to the architectural challenge task that can be found in [TASK.md](./TASK.md).

## Design

### Initial thoughts and considerations

Thoughts about what will be required:

- Requires a publicly available static site (could probably use AWS Amplify)
- Requires somewhere to store posts (could probably use AWS AppSync / AWS DynamoDB)
- Requires some mechanism to retrieve approved posts (could probably use some API; AWS AppSync / API Gateway / AWS Lambda)
- Requires some asynchronous mechanism to approve posts (could probably use AWS DynamoDB streams and AWS Lambda)

Ambiguity in the challenge task:

- The challenge task does not mention if my team (or organisation) has a registered domain to use for the site or not
- The challenge task does not mention expected traffic or where traffic will come from, as to whether a CDN is required or not
- The challenge task does not mention anything about authentication or authorization for submitting posts or whether any log in functionality should be provided as part of this site or is centralised elsewhere in the organisation
- The challenge task does not mention whether the third party API requires any credentials or tokens for use
- The challenge task does not mention whether the third party API has any rate limiting applied to it
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
- As such, I would recommend using React for the frontend library to allow for easy integration of AWS Amplify client libraries
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
- [Monitoring](#Monitoring) - how the application will be observable

#### Deployment

![Deployment diagram](./images/Architectural%20Challenge-Deployment.drawio.png)

The majority of solution can be deployed using AWS Amplify, whereas the other elements that cannot be deployed via this method can be deployed using Terraform, CloudFormation or the AWS CDK. AWS Amplify uses CloudFormation stacks to realise the deployment.

#### Site access

![Site access diagram](./images/Architectural%20Challenge-Site%20Access.drawio.png)

The site can be hosted using AWS Amplify Hosting. This simplifies the deployment and will allow for easy use of the Simple Storage Service (S3) for hosting the application code (site HTML, JavaScript, CSS) and any other static resources (images etc), CloudFront as the Content Delivery Network (CDN), Certificate Manager for a SSL/TSL certificate and Route 53 public hosted zone to provide DNS to a registered domain.

The client will enter the DNS domain name in their browser (created in the Route 53 public hosted zone), will be directed to the CloudFront distribution, which is configured to serve the application stored in the S3 bucket. CloudFront will be configured to use a certificate issued by Certificate Manager (AWS ACM) for the registered domain.

Once the resources have been received by the client's browser, the JavaScript code (React application for example) will run, and will use the AWS Amplify client to run a GraphQL query to AppSync to retrieve the posts. This can be written to retrieve the posts in the desired order (newest first) and could also limit (paginate) posts if required. The posts will have a property stating whether they have been approved or not, and only approved posts will be fetched as part of this query. For this call, prior authorization may or may not be required - in this diagram I have not required authorization for reading the posts, only for creating posts under a given username.

#### Authentication

![Authentication diagram](./images/Architectural%20Challenge-Authentication.drawio.png)

Authentication (and obtaining an access token for authorization) in the solution will be provided by AWS Cognito. AWS Amplify auth has authentication integration that can be added with the authenticator component. A log in form can be created which will post to Cognito (using the AWS Amplify auth client) and will return an ID Token (for authentication) to be stored in the browser for showing the user is logged in and an access token (for authorization) that can be sent through to the API for allowing the user to create posts. These will be stored as JSON Web Tokens (JWT).

#### Creating posts

![Creating posts diagram](./images/Architectural%20Challenge-Creating%20Posts.drawio.png)

A schema will be created in AppSync which is authorized by the Cognito user pool, that GraphQL mutations can be made to. A DynamoDB table will store the posts made by the authorized users. These posts will initially be created with a property stating that they have not been approved.

A DynamoDB stream will trigger, either in batches if required (and depending on the interface provided by the third party API) or in real time for individual post creations which will be handled by a Lambda function that will make a call to the third party approval API. If credentials or a token is required, this/these will be picked up here (access controlled by the IAM role) when the request is made to the API (this is absent from the diagram as it was assumed in the assumptions that these would not be required).

If the approval API returns true for the post (or posts, depending on interface provided by the third party) and update the the DynamoDB table will be made (the diagram shows directly, but could also use AppSync) setting the approved property to true. The post will now show in the frontend application when the posts are queried.

If the approval API returns false for the post/posts then the appropriate record will be removed from the DynamoDB table (directly, or via AppSync).

For a more distributed architecture, this Lambda function could instead be replaced with several functions and/or Step Functions to handle the triggering of the Step Functions (as these cannot be directly trigger by DynamoDB streams), the call to the third party approval API, the approved update to the record/records and the rejected (not approved) update to the record/records (and potentially error handling and retrying also).

If the approval API returns some error, or is not available, failed requests can be added to an SQS queue which can be alerted on and investigated as required.

#### Monitoring

![Monitoring](./images/Architectural%20Challenge-Monitoring.drawio.png)

The assumptions were that only basic monitoring was required, which CloudWatch should be able to provide.

The main area for observability is likely around the asynchronous post approval process, and the Lambda function can be configured to log application logs to a CloudWatch log group (which can also have CloudWatch metrics populated from it via a log group filter if necessary, which could subsequently trigger some CloudWatch alarm if existing metrics are not substantial).

CloudWatch metrics can be displayed on a CloudWatch dashboard should there be a requirement for some view of the application's performance / status.

### Future extension and other potential options

- Alerting on errors (CloudWatch alarms) through to developer communication tools (e.g. Slack, shared email inbox etc via AWS Chatbot or similar)
- More specific error handling such as implementing a dead letter queue for redriving failed messages etc, and better traceability of requests (e.g. via AWS X-Ray) 
- Some observability of unapproved posts in the database or automated cleaning process to delete (or notify on) any aged posts in the database that might not have been processed successfully by the Lambda function
- Client side logging/monitoring (e.g. a third party tool such as Sentry) could be added to observe client side errors
- Encryption of data in the database via KMS (not included in the diagram)

Should the AWS Amplify approach not be desirable, alternative solutions could be sought by building and integrating the components in a more manual way.
