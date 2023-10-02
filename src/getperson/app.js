var config = require('../shared/modules/config.js');
var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../shared/modules/baseapi.js'); //stubs the basic api structure out
var shared = require('../shared/modules/shared.js');
var config = require('../shared/modules/config.js');
const { error } = require('console');

const scopes = `AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write`;
const args = process.argv.slice(2);
const edgepersonguid = args[0];
if(!edgepersonguid)
{
    console.log('Please supply an edgpersonguid');
    return;
}

const callGetPersonAPI = (personIdentifier, tenant) => {
    auth.getAccessToken(config, tenant, scopes)
        .then(token => {
            api.callAdmissionsIntegrationAPI(token, tenant, 'GET', personIdentifier, entityType = 'people', null, null)
                .then(entity => {
                    console.dir(entity, { depth: 4 });
                })
                .catch(error => {
                    shared.handleError(error);
                });
        })
        .catch(error => {
            shared.handleError(error);
        });
};

callGetPersonAPI(edgepersonguid, config.tenant);