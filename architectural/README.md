# Architectal Challenge

## Overview

This README is my solution to the architectural challenge task that can be found in [TASK.md](./TASK.md).

## Design

### Initial thoughts and considerations

Thoughts about what will be required:

- Requires a publically available static site (could probably use AWS Amplify)
- Requires somewhere to store posts (could probably use AWS AppSync / AWS DynamoDB)
- Requires some mechanism to retrieve approved posts (could probably use some API; AWS AppSync / API Gateway / AWS Lambda)
- Requires some asynchronous mechanism to approve posts (could probably use AWS DynamoDB streams and AWS Step Functions/just AWS Lambda)

Ambiguity in the challenge task:

- The challenge task does not mention if my team (or organisation) has a registered domain to use for the site or not
- The challenge task does not mention anything about authentication or authorization for submitting posts or whether any log in fucntionality should be provided as part of this site or is centralised elsewhere in the organisation
- The challenge task does not mention whether the third party API requires any credentials or tokens for use
- The challenge task does not mention whether the third party API had any rate limiting applied to it
- The challenge does not mention what degree of monitoring of the application may be required, if at all
- The challenge task does not mention anything about having to design or create a deployment pipeline, anything about source code management or application state management (AWS CloudFormation vs HashiCorp Terraform etc)
