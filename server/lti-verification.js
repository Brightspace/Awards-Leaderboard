var crypto = require('crypto');

module.exports = {

    /* verifyLtiRequest
    *    This method verifies the incoming LTI request from the Learning Environment.
    *    The LTI request is signed using OAuth 1.0, so to validate that it came from
    *    an authorized source we can reconstruct the oauth_signature and compare to 
    *    the passed in oauth signature using the LTI Secret as our key for the HMAC-SHA1
    *    hash.
    *
    *    Note: currently no query parameters are being passed in, but if that was to change
    *          we would have to add those parameters to the signatureBaseString in the same manner
    *          as the request body parameters.
    */
    verifyLtiRequest: function(url, requestBody, secret) {
        var signatureBaseString = 'POST&' + encodeURIComponent(url) + '&';
        var first = true;
        for (const key of Object.keys(requestBody).sort()) {
            if( key === 'oauth_signature'){
                continue;
            }
            if(!first){
                signatureBaseString += encodeURIComponent('&' + key + '=' + encodeURIComponent(requestBody[key]));
            } else {
                signatureBaseString += encodeURIComponent(key + '=' + encodeURIComponent(requestBody[key]));
                first = false;
            }
        }
        var computedSignature = crypto.createHmac('sha1', secret + '&').update(signatureBaseString).digest('base64');
        return requestBody.oauth_signature === computedSignature;
    }
};
