var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var config = require('../shared/modules/config.js');
var shared = require('../shared/modules/shared.js')
const scopes = `AdmissionsService.Api.Integration.Sensitive.Write AdmissionsService.Api.Integration.Sensitive.Read AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write ReferenceData.Api.Read ReferenceData.Api.Manage`;

const callGetAcccessToken = (tenant) => {
    auth.getAccessToken(config, tenant, scopes)
        .then(token => { 
            console.dir(token, {depth:4});
        })
        .catch(error => {
            shared.handleError(error);
        });
};
callGetAcccessToken(config.tenant);
