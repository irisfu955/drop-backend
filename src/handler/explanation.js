const { DynamoDBDocumentClient, PutCommand, ScanCommand } =require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } =require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
/* 
explanation: {
    id: string,
    originText: string,
    gptExplanation: string,
    documentId: string
}
*/
const { v4: uuidv4 } = require('uuid');

const createExplanation = async (event) => {
    const response = {statusCode: 200 };
    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: "explanationsTable",
            Item: {
                id: uuidv4(),
                originText: body.originText,
                gptExplanation: body.gptExplanation,
                documentId: body.documentId
                
            },
        };
        const createResult = await ddbDocClient.send(new PutCommand(params));
        response.body = JSON.stringify({
            message: "successfully created explanation.",
            createResult,
        });
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create explanation",
            errorMsg: err.message,
            errorStack: err.stack,

        });
    }
    return response;
};

const getAllExplanations = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: "explanationsTable",
            IndexName: "document",
            FilterExpression: "documentId = :documentId",
            ExpressionAttributeValues: {
                ":documentId":  event.pathParameters.documentId,
            },
        };
        const { Items } = await ddbDocClient.send(new ScanCommand(params));

        response.body = JSON.stringify({
            message: "Successfully retrieved all explanations.",
            data: Items,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve explanations.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};



module.exports = {
    createExplanation,
    getAllExplanations,
};