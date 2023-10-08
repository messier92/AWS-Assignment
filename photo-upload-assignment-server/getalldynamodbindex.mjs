import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    };
    
    let body;
    try {
        if (event.httpMethod == 'POST') // only supports POST request with API Gateway integration
        {
            // Get all image results from DynamoDB
            body = await dynamo.scan({ TableName: event.queryStringParameters.TableName });
            
            // Iterate through the queryStringParameters object
            for (const key in event.queryStringParameters) {
                if (key == "EditPhotoVisibility") {
                    const editVisibilityJsonObject = JSON.parse(event.queryStringParameters.EditPhotoVisibility);
                    const imageName = editVisibilityJsonObject.ImageName;
                    const publicValue = editVisibilityJsonObject.Public;
                    const updateDynamoDBparams = {
                        TableName: event.queryStringParameters.TableName, 
                        Key: {
                            ImageName: imageName,
                            
                        },
                        UpdateExpression: 'SET #publicAttr = :newPublicValue',
                        ExpressionAttributeNames: {
                            '#publicAttr': 'Public',
                            
                        },
                        ExpressionAttributeValues: {
                            ':newPublicValue': publicValue,
                            
                        }, ReturnValues: 'UPDATED_NEW',};
                     await dynamo.update(updateDynamoDBparams);
                }
            }
        }
        else 
        {
            throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};