# AWS-Assignment
Architecture Diagram (simplified)

![Alt text](image-6.png)

This project showcases a simple serverless web application for an administrator to upload and share photos. The webpage allows for the administrator to upload photos directly from his/her computer to an S3 bucket and to modify the visibility setting of the photo. Access restriction is taken into consideration where some photos can be visible to the public (as a guest role). To view all the photos, the guest needs to create an account and sign in via Amazon Cognito Hosted UI. Users are able to see all photos uploaded by the administrator. Only the administrator can modify the visibility setting of the photo.

All guests will first arrive at the landing page where they will only be able to see photos that are marked as "Public". There is a "Sign In/Sign Up" button at the top header for guests to sign in. This service is handled by AWS Cognito Hosted UI. Once signed in and authenticated, the guests will be redirected to the home page, where they can view all photos. For administrators, they will be able to see the 'File Upload' button and after clicking on the image, they will also be able to change the visibility of the photo.

Photo Upload and Access Restrictions: Administrators should have the ability to upload photos to the application and set visibility. Photos marked for public viewing should be accessible to anyone, while private photos should only be viewable by signed-in users. 

User Signup and Management: AWS Cognito is used to manage the users who have signed in. Two user pools groups are created in AWS Cognito - admins. Currently, only the AWS Console administrator can set himself as the admin. 

Preferred Technology Stack: The chosen technology stack aligns with the recommended serverless architecture. It uses React for the front end and is a static website hosted on Amazon S3. Amazon Cognito is used for authentication, while the backend is implemented in Node.js using AWS Lambda. The front end interacts with the back end through API Gateway. DynamoDB serves as the database, and Amazon S3 is used for storage for website hosting and the photos. This stack ensures cost-effectiveness, scalability, and compatibility with the AWS Free Tier.

The landing page for all guests is hosted on http://webpagefortemusassignmenteugene.s3-website-ap-southeast-1.amazonaws.com/, where only public photos are available for viewing. 

![Alt text](image.png)

The Sign Up/Sign In button will direct the guest to an AWS Cognito Hosted UI page for him/her to sign up for an account, or to log in if he/she already has one. To keep the project within the AWS Free Tier, the callback URL for the hosted UI will be briefly routed to localhost:3000/authenticated. In an actual deployment, the callback URL needs to have a HTTPS protocol, which can be achieved using AWS CloudFront (which is beyond the scope of this project).

![Alt text](image-1.png)

Logging in as a user, the header will now display the username as well as both private and public photos. Logging in as an administrator, there is an additional 'Upload a photo' button where the administrator can choose a file from his/her local machine and upload it to AWS S3. The image name, URL and "Public" information will also be routed to DynamoDB.

![Alt text](image-2.png)

![Alt text](image-4.png)

The administrator can choose to change the visibility of the photos, which will call the API Gateway that is linked to a Lambda function to update the "Public" field of that image. All other users (that are not in the administrator group) will not be able to upload files or change the visibility of the photos.

![Alt text](image-3.png)

![Alt text](image-5.png)

### STEPS TO DEPLOY ###
Client
1. Run "aws cloudformation deploy --template-file client_cloudformation.yaml --stack-name eugene-aws-temus-assignment-client --capabilities CAPABILITY_NAMED_IAM" to create the following:
1. MyHostingBucket (to host React app static website) and MyHostingBucketPolicy (Policy to allow public access)
2. MyPhotosBucket (to store photos) and MyPhotosBucketPolicy (Policy to allow PUT and GET requests)
3. PhotoAppUserPool, PhotoAppUserPoolClient, PhotoAppUserPoolDomain, AdminUserPoolGroup (To setup AWS Cognito and Hosted UI) 
3a. After creating a user, remember to log into the AWS Console and manually add the user into the 'admins' group for File Upload and Change Visibility functionality
4. MyDynamoDBPhotosTable (To store photo name, URL and visibility/publicity. This could be in server too.)

Server
Pre-requisites:
* Create an S3 bucket manually to store and upload Lambda code. This allows you to also import the node_modules.
1. Run "aws cloudformation deploy --template-file server_cloudformation.yaml --stack-name eugene-aws-temus-assignment-server --capabilities CAPABILITY_NAMED_IAM"
2a. For code without node_modules (besides aws-sdk), can either write it as inline code or create an index.mjs/index.js, then .zip it up and store it in an S3 bucket, which will be referred to in CloudFormation template.
2b. For code with node_modules, run "npm init" and then "npm install" your required packages. Then do the same as 2a. When zipping the file, remember to zip it from inside the directory. 
3. MyNodeLambdaFunctionForDynamoDB (code to get DynamoDB index - contains function to get all results from DynamoDB OR update an existing entry in DynamoDB if the correct parameter is provided in queryStringParameters)
4. MyNodeLambdaFunctionForS3 (code to receive Image meta-data from React app and stores it in S3. Also stores the results in MyDynamoDBPhotosTable)
5. LambdaExecutionRoleForS3AndDynamoDB (roles to allow upload and requests to S3 and DynamoDB)
6. LambdaExecutionRoleForDynamoDB (Least Privilege principle - roles to only allow requests to DynamoDB)
7. ApiGatewayIamRole and ApiGatewayIamRoleForS3 (to allow API Gateway to assume roles to call Lambda function - can be re-used)
8. MyApiGateway, MyApiGatewayPostMethod, MyApiGatewayDeployment, MyLambdaFunctionApiGatewayInvokePOST - API Gateway resources for MyNodeLambdaFunctionForDynamoDB
9. MyApiGatewayForS3, MyApiGatewayPostMethodS3, MyApiGatewayDeploymentForS3, MyLambdaFunctionApiGatewayInvokePOSTS3 - API Gateway resources for MyNodeLambdaFunctionForDynamoDB - API Gateway resources for MyNodeLambdaFunctionForS3
10. Take note to Enable CORS for both API Gateway resources and remember to re-deploy to allow React app to call the endpoint successfully