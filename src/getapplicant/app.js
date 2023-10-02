var config = require('../shared/modules/config.js');
var shared = require('../shared/modules/shared.js')
var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../shared/modules/baseapi.js'); //stubs the basic api structure out


const args = process.argv.slice(2);
const applicantIdentifier = args[0];
if(!applicantIdentifier)
{
    console.log('Please supply an applicantIdentifier');
    return;
}

const scopes = `AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write`;
const callGetApplicantAPI = (tenant, applicantidentifier) => {
    auth.getAccessToken(config, tenant, scopes)
        .then(token => {
            api.callAdmissionsIntegrationAPI(token, tenant, 'GET', applicantidentifier, entityType = 'applicants', null, null)
                .then(applicantRetured => {
                    console.dir(applicantRetured, {depth: 4});
                })
                .catch(error => {
                    shared.handleError(error);
                });
        })
        .catch(error => {
            shared.handleError(error)
        });
};
callGetApplicantAPI(config.tenant, applicantIdentifier);