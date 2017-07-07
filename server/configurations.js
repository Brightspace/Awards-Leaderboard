module.exports = {

    getRedirectUri: function(req){
        return req.protocol + "://" + req.headers.host + "/callback";
    },

    authCodeScope: process.env.AUTH_SCOPE,
    authEndpoint: process.env.AUTH_ENDPOINT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: { httpOnly: true, secure: true },
    instanceUrl: process.env.INSTANCE_URL,
    ltiSecret: process.env.LTI_SECRET,
    state: process.env.STATE,
    tokenEndpoint: process.env.TOKEN_ENDPOINT,
    configuredPort: process.env.HTTPS_PORT
};