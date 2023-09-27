import * as DropboxSign from "@dropbox/sign";

const signatureRequestApi = new DropboxSign.SignatureRequestApi();
const axios = require('axios');
const ApiError = require('../utils/ApiError');


// Configure HTTP basic authorization: api_key
signatureRequestApi.username = "YOUR_API_KEY";

// or, configure Bearer (JWT) authorization: oauth2
// signatureRequestApi.accessToken = "YOUR_ACCESS_TOKEN";


/**
 * This function sends a request to Open AI language model
 * to generate a response to a given prompt (the input question).
 *
 * @param {Object} clientInfo The information of client.
 * @param {String} template The templateIds.
 * @returns {Promise<Object>} The response from the Dropbox Api.
 * @throws {Error} If there's an error during the API call.
 */

async function createSignatureRequestEmbeddedWithTemplate(clientInfo, template) {
   
    const signer1 = {
        role: "Client",
        emailAddress: "george@example.com",
        name: "George",
    };

    const signingOptions = {
        draw: true,
        type: true,
        upload: true,
        phone: false,
        defaultType: "draw",
    };

    const data = {
        clientId: "ec64a202072370a737edf4a0eb7f4437",
        templateIds: ["c26b8a16784a872da37ea946b9ddec7c1e11dff6"],
        subject: "Purchase Order",
        message: "Glad we could come to an agreement.",
        signers: [ signer1 ],
        signingOptions,
        testMode: true,
    };
  
    // Send the request and return the response.
    try {
        const result = await signatureRequestApi.signatureRequestCreateEmbeddedWithTemplate(data);
        return result.body;
    } catch (error) {
        throw new ApiError(`Error during Dropbox Sign API call: ${error}`);
    }
};

module.exports ={
    createSignatureRequestEmbeddedWithTemplate,
};



