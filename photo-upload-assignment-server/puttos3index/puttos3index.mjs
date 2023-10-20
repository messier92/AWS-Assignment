
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const BUCKET_NAME = "photobucketfortemusassignmenteugene";
const DB_NAME = "eugene-aws-temus-assignment-client-MyDynamoDBPhotosTable-1UTZYCV05H8FS";

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const s3Client = new S3Client(); // Replace with your AWS region
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    };

    try {
      const body = JSON.parse(event.body)
      let imageData = body.image;
      let imageName = body.name;
      let imagePublic = body.public;
      const buffer = Buffer.from(imageData, 'base64');

      const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: buffer,
      };
      
      await s3Client.send(new PutObjectCommand(params));
      
      const command = new PutCommand({
          TableName: DB_NAME,
          Item: {
          ImageName: imageName,
          ImageURL: `https://${BUCKET_NAME}.s3.amazonaws.com/${imageName}`,
          Public: imagePublic
        },
      });

      const DBresponse = await docClient.send(command);

      return {
        statusCode,
        body: JSON.stringify({ link: `https://${BUCKET_NAME}.s3.amazonaws.com/${imagePublic}` }),
        headers
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: err.stack }),
        headers
      }
    }
};

 