const { DynamoDBDocumentClient, PutCommand } =require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } =require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
/* 
client: {
    clientId: string,
    documents: list
}
*/
const createClient = async (event) => {
    const response = {statusCode: 200 };
    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: "clientsTable",
            Item: body,
        };
        const createResult = await ddbDocClient.send(new PutCommand(params));
        response.body = JSON.stringify({
            message: "successfully created client.",
            createResult,
        });
    } catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create client",
            errorMsg: err.message,
            errorStack: err.stack,

        });
    }
    return response;
};



module.exports = {
    createClient,
};