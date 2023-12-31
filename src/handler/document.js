const { DynamoDBDocumentClient, PutCommand, ScanCommand } =require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } =require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
/* 
document: {
    documentId: string,
    documentName: string,
    data: string,
    clientId: string
}
*/
const { v4: uuidv4 } = require('uuid');
const createDocument = async (event) => {
    const response = {statusCode: 200 };
    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: "documentsTable",
            Item: {
                documentId: uuidv4(),
                documentName: body.documentName,
                data: body.data,
                clientId: body.clientId
            },
        };
        const createResult = await ddbDocClient.send(new PutCommand(params));
        response.body = JSON.stringify({
            message: "successfully created document.",
            createResult,
        });
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create document",
            errorMsg: err.message,
            errorStack: err.stack,

        });
    }
    return response;
};

const getAllDocuments = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: "documentsTable",
            IndexName: "client",
            FilterExpression: "clientId = :clientId",
            ExpressionAttributeValues: {
                ":clientId":  event.pathParameters.clientId,
            },
        };
        const { Items } = await ddbDocClient.send(new ScanCommand(params));

        response.body = JSON.stringify({
            message: "Successfully retrieved all documents.",
            data: Items,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve documents.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};



module.exports = {
    createDocument,
    getAllDocuments,
};