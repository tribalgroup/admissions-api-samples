var config = require('../../shared/modules/config.js');
var auth = require('../../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../../shared/modules/baseapi.js'); //stubs the basic api structure out
const { error } = require('console');
var referencedataconfig = require('../corereferencedata.js');
var refDataHelper = require('./referencedatahelper.js');
const shared = require('../../shared/modules/shared.js');
const scopes = `AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write ReferenceData.Api.Read ReferenceData.Api.Manage`;


async function getReferenceDataFromTenant(referenceDataType, tenant, skip, take) {
    return new Promise((resolve, reject) => {

        const refDataAPI = refDataHelper.resolvedRefDataEndpoint(referenceDataType, referencedataconfig.admissionRefData, api);

        auth.getAccessToken(config, tenant, scopes)
            .then(token => {
                refDataAPI(token, tenant, 'GET', null, entityType = referenceDataType, null, null, skip, take, filter = "InUse eq True")
                    .then(entitys => { 
                        resolve(entitys);
                    })
                    .catch(error => {
                        shared.handleError(error);

                        reject(error);

                    })
            })
            .catch(error => {
                shared.handleError(error);

                reject(error);
            });
    });
};
//Update the reference data item
async function updateReferenceDataItem(token, referenceDataType, tenant, entity) {

    return new Promise((resolve, reject) => {
        const refDataAPI = refDataHelper.resolvedRefDataEndpoint(referenceDataType, referencedataconfig.admissionRefData, api);
        //attempt a GET on the content from the tenant 

        refDataAPI(token, tenant, 'GET', null, entityType = referenceDataType, body = null, etag = null, skip = null, take = null, filter = refDataHelper.getReferenceDataFilter(entity, referenceDataType, "code"))
            .then(entitysFound => {
                if (entitysFound.body.count > 0) {
                    if (entitysFound.body.count === 1) {
                        const entityFound = entitysFound.body.collection[0];
                        //Filter collection returns should return a collection of 1.  Assume complete overwrite
                        refDataAPI(token, tenant, 'PUT', refDataHelper.getReferenceDataIdentifierValue(entityFound, referenceDataType, "identifier"), entityType = referenceDataType, entityFound, null)
                            .then(entityUpdated => {
                                //Update

                                shared.logInfo(`Updated ${referenceDataType}/${refDataHelper.getReferenceDataIdentifierValue(entityUpdated.body, referenceDataType, "identifier")}`);
                                resolve(entityUpdated);
                            })
                            .catch(error => {
                                shared.handleError(error);

                                reject(error);
                            });
                    }
                    else {
                        reject('Too many entities returned; expected 1');
                    }
                }
                else {
                    reject({ statusCode: 404 });  //Not found so fall to POST
                }
            })
            .catch(error => {
                reject(error);
            })
    });
}
//Create reference data item
async function createReferenceDataItem(token, referenceDataType, tenant, entity) {

    return new Promise((resolve, reject) => {
        const refDataAPI = refDataHelper.resolvedRefDataEndpoint(referenceDataType, referencedataconfig.admissionRefData, api);

        refDataAPI(token, tenant, 'POST', null, entityType = referenceDataType, entity, null)
            .then(entityCreated => {
                //Create 
                shared.logInfo(`Created ${referenceDataType}/${refDataHelper.getReferenceDataIdentifierValue(entityCreated.body, referenceDataType, "identifier")}`);
                resolve(entityCreated);
            })
            .catch(error => {
                shared.handleError(error);

                reject(error);
            })
    });
}

module.exports ={
    getReferenceDataFromTenant: getReferenceDataFromTenant,
    updateReferenceDataItem: updateReferenceDataItem,
    createReferenceDataItem: createReferenceDataItem,
    scopes:scopes
}