const firebaseAdmin = require('../config/firebaseConfig');
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} idToken
 * @returns {Promise<Token>}
 */
const verifyIdToken = async (idToken) => {
        // idToken comes from the client app
   await firebaseAdmin
    .getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
    const uid = decodedToken.uid;
      return uid;
    })
    .catch((error) => {
      throw new Error(`Error during verify id token: ${error}`);
    });
  };

  module.exports = {
    verifyIdToken,
  };