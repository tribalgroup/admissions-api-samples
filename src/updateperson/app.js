var config = require('../shared/modules/config.js');
var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../shared/modules/baseapi.js');
var personShared = require('../shared/modules/personshared');
var shared = require('../shared/modules/shared.js')

const scopes = `AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write`;
var args = process.argv.slice(2); 
const edgepersonguid = args[0] ?? '78CB18A3-D456-4B2B-8710-00D808F6C665';


const updatePersonAPI = (tenant, surname, forenames, dob, emailAddress) => {
    auth.getAccessToken(config, tenant, scopes)
        .then(token => {
            //first retrieve the existing state of the entity you wish to update
            api.callAdmissionsIntegrationAPI(token, tenant, 'GET',edgepersonguid, entityType= 'people', null ,null)
                .then(entityToUpdate => {
                    //The entity and etag are returned along with the response code.
                    //Retrieval of existing entity HIGHLY RECOMMENDED; this retrieves the remote state and ensures you do not unintentionally overwrite existing values.

                    //Example: Apply any changes you want to make to the remote state
                    personShared.applyPerson(entityToUpdate.body, surname, forenames,  dob);
                    personShared.applyPrimaryContactEmailAddress (entityToUpdate.body, emailAddress);

                    //Save the changes - ensuring ETAG passed from previous GET.
                    api.callAdmissionsIntegrationAPI(token, tenant, 'PUT',edgepersonguid, entityType= 'people', entityToUpdate.body ,entityToUpdate.etag)
                        .then(updatedEntity =>
                            {
                                console.dir(updatedEntity.body, {depth:4});
                            }
                        ).catch(error =>
                            {
                                shared.handleError(error);
                            });
                })
                .catch(error => { 
                    shared.handleError(error);
                });
        })
        .catch(error => {
            shared.handleError(error);
        });
};

let nowDate = new Date(Date.now());
let nowDateString = `${nowDate.getDate()}_${nowDate.getMonth()}`;
//Example showing an update to existing entity - added datestring to make changes obvious
updatePersonAPI(config.tenant, `Kautzer_${nowDateString}`, null,"1980-12-12", `me${nowDateString}@here.com`);