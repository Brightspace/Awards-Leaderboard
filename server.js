var 
    express = require('express'),
    request = require('superagent'),
    bodyParser = require('body-parser'),
    querystring = require('querystring'),
    cookieParser = require('cookie-parser'),
    ltiVerification = require('./server/lti-verification'),
    configs = require('./server/configurations'),
    app = express();

app.enable('trust proxy');
app.use('/', express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/* POST /lti/awardsleaderboard
*   This is the LTI endpoint setup in the learning environment. After
*   authenticating the request by validating the OAuth 1.0 signature
*   it redirects the user to the /auth route that will kick off the
*   OAuth 2.0 authentication workflow.
*/
app.post('/lti/awardsleaderboard', function (req, res) {
    var userId = req.body.user_id;
    var underScoreIndex = userId.lastIndexOf("_");
    userId = userId.slice(underScoreIndex + 1);
    res.cookie(configs.cookieName,{ orgUnitId: req.body.context_id, userId: userId }, configs.cookieOptions);
    var url = req.protocol + '://' + req.get('host') + '/lti/awardsleaderboard';
    if (!ltiVerification.verifyLtiRequest(url, req.body, configs.ltiSecret)) {
        console.log('Could not verify the LTI Request. OAuth 1.0 Validation Failed');
        res.status(500).send({error: 'Could not verify the LTI Request. OAuth 1.0 Validation Failed'});
    } else {
        res.redirect('/auth');
    }
});

/* GET /auth
*   This endpoint is used to redirect the user to the authentication route
*   on the learning environment side so that the user can confirm
*   that they want allow this application to make API requests on
*   their behalf.
*/
app.get('/auth', function(req, res) {
    var authCodeParams = querystring.stringify({
        response_type: "code",
        redirect_uri: configs.getRedirectUri(req),
        client_id: configs.clientId,
        scope: configs.authCodeScope,
        state: configs.state
    });
    res.redirect(configs.authEndpoint + "?" + authCodeParams);
});

/* GET /callback
*   This endpoint is the callback provided when setting up an oauth
*   client in the learning environment and is called after the user has 
*   granted permission for this application to make API requests. This
*   method takes the authorization code and exchanges it for
*   the token(stores it in a cookie) that can then be used to make API requests.
*/
app.get('/callback', function(req, res) {
    var authorizationCode = req.query.code;
    var state = req.query.state;
    if (state !== configs.state) {
        console.log("The state value from the authorization request was incorrect.");
        res.status(500).send({ error: "STATE mistmatch - authorization request could not be completed." });
        return;
    }
    var payload = { grant_type: "authorization_code", redirect_uri: configs.getRedirectUri(req), code: authorizationCode };

    request
        .post(configs.tokenEndpoint)
        .auth(configs.clientId, configs.clientSecret)
        .type('form')
        .send(payload)
        .end(function(err, postResponse) {
            if (err) {
                console.log('Access Token Error', err.response || err);
                res.redirect('/auth');
            } else {
                var accessToken = postResponse.body.access_token;
                var orgUnitId = req.cookies[configs.cookieName].orgUnitId;
                var userId = req.cookies[configs.cookieName].userId;
                res.cookie(configs.cookieName, { accessToken: accessToken, orgUnitId: orgUnitId, userId: userId }, configs.cookieOptions);
                var host = encodeURIComponent(req.protocol + '://' + req.get('host'));
                var brightspaceUrl = encodeURIComponent(configs.instanceUrl);
                res.redirect('index.html?host=' + host + '&brightspaceUrl=' + brightspaceUrl);
            }
        });
});

/* GET /leaderboard
*   This route calls the awards API that returns the classlist for the
*   requested orgunit.
*   Brightspace Route: /d2l/api/bas/{version}/orgunits/{orgUnitId}/classlist/
*   Query Params:
*       1) Sortfield - a string that represents how to sort this list (defaults to AwardsCount)
*       2) nextUrl   - a URL that represents the route that should be called, based on the
*                      paging model in place for the classlist awards route
*/
app.get('/leaderboard', function (req, res) {
    var access_token = req.cookies[configs.cookieName].accessToken;
    var orgUnitId = req.cookies[configs.cookieName].orgUnitId;
    var sortField = req.query.sortField || 'AwardCount';
    var awardsClasslistRoute;
    if (req.query.nextUrl) { 
        awardsClasslistRoute = req.query.nextUrl;
    } else {
        awardsClasslistRoute = configs.instanceUrl + '/d2l/api/bas/1.0/orgunits/' + orgUnitId + '/classlist/';
    }
    request
        .get( awardsClasslistRoute )
        .query({ sortField: sortField })
        .set('Authorization', `Bearer ${access_token}`)
        .end(function(error, response) {
            if (error) {
                console.log("Error calling the awards classlist route", error);
                res.status(500).send({ error: error });
            } else {
                var data = JSON.parse(response.text || '{}');
                res.json(data);
            }
        });
});

/* GET /myranking
*   This route calls the awards API that returns the classlist for the
*   requested orgunit and the current user.
*   Brightspace Route: /d2l/api/bas/{version}/orgunits/{orgUnitId}/classlist/users/{userId}
*   Query Params:
*       1) Sortfield - a string that represents how to sort this list (defaults to AwardsCount)
*/
app.get('/myranking', function (req, res) {
    var access_token = req.cookies[configs.cookieName].accessToken;
    var orgUnitId = req.cookies[configs.cookieName].orgUnitId;
    var userId = req.cookies[configs.cookieName].userId;
    var sortField = req.query.sortField || 'AwardCount';
    var awardsClasslistRoute = configs.instanceUrl + '/d2l/api/bas/1.0/orgunits/' + orgUnitId + '/classlist/users/' + userId;
    request
        .get( awardsClasslistRoute )
        .query({ sortField: sortField })
        .set('Authorization', `Bearer ${access_token}`)
        .end(function(error, response) {
            if (error) {
                console.log("Error calling the awards classlist route specific to a user.", error);
                res.status(500).send({ error: error });
            } else {
                var data = JSON.parse(response.text || '{}');
                res.json(data);
            }
        });
});

module.exports = app;
app.listen(configs.configuredPort);
