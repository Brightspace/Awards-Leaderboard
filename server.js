var 
    express = require('express'),
    request = require('superagent'),
    sessions = require('client-sessions'),
    bodyParser = require('body-parser'),
    querystring = require('querystring'),
    cookieParser = require('cookie-parser'),
    app = express();

app.enable('trust proxy');
app.use(cookieParser());
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Required for self signing cert.

var port = 3434
var clientId = "CLIENT_ID"; // OAuth2 Client Id Granted by Brightspace
var clientSecret = "CLIENT_SECRET"; // OAuth2 Client Secret Granted by Brightspace
var state = "STATE"; // Use a GUID
var instanceUrl = "INSTANCE_URL"; // Instance URL you are running against.
var authService = "https://auth-dev.proddev.d2l"; // Production: https://auth.brightspace.com;
var authCodeEndpoint = authService + "/oauth2/auth";
var tokenEndpoint = authService + "/core/connect/token";
var getRedirectUri = function(req) { return req.protocol + "://" + req.headers.host + "/callback"; };
var cookieName = "awards-leaderboard-app",
    cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.post(
    '/lti/awardsleaderboard',
    urlencodedParser,
    function (req, res) {
        console.log('Lti Launch Detected');
        res.redirect('/auth');
        return;

    });

app.get('/auth', function(req, res) {
    var authCodeParams = querystring.stringify({
        response_type: "code",
        redirect_uri: getRedirectUri(req),
        client_id: clientId,
        scope: "core:*:*",
        state: state
    });
    res.redirect(authCodeEndpoint + "?" + authCodeParams);
});

app.get('/callback', function(req, res) {
    var authorizationCode = req.query.code;

    var payload = {
        grant_type: "authorization_code",
        redirect_uri: getRedirectUri(req),
        code: authorizationCode
    };

    request
        .post(tokenEndpoint)
        .auth(clientId, clientSecret)
        .type('form')
        .send(payload)
        .end(function(err, postResponse) {
            if (err) {
                console.log(
                    'Access Token Error',
                    err.response || err
                );
                res.redirect('/auth');
            } else {
                res.cookie(
                    cookieName,
                    { accessToken: postResponse.body.access_token },
                    cookieOptions
                );
                res.redirect('/me');
            }
        });
});

app.get(
    '/me',
    function (req, res) {
        var access_token = req.cookies[cookieName].accessToken;
        var data = null;
        request
        .get(instanceUrl + '/d2l/api/lp/1.10/users/whoami')
        .set('Authorization', `Bearer ${access_token}`)
        .end(function(error, response) {
            if (error) {
                console.log("Error calling who am i", error);
            } else {
                data = JSON.stringify(JSON.parse(response.text || '{}'), null, 2);
                console.log(data);
                res.json(data);
            }
        });
    }
);

module.exports = app;