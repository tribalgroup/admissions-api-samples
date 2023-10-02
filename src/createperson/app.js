var config = require('../shared/modules/config.js');
var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../shared/modules/baseapi.js'); //stubs the basic api structure out
var personShared = require('../shared/modules/personshared.js');
var shared = require('../shared/modules/shared.js')

const args = process.argv.slice(2); 
const intialPersonGuid = args[0]; 
const scopes = `AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write`;

let minimalPersonData = {
    edgePersonGuid: intialPersonGuid,
    dateOfBirth: "2002-02-11",
    genderCode: "M",
    legalName: {
        givenNames: 'Random',
        familyName: 'Person',
    },
    contactDetails: [
        {
            contactTypeCode: "EMAIL",
            value: "me@here.com",
            isPreferred: true
        }
    ],
    addresses: [
        {
            startDate: "2022-08-20",
            endDate: "2024-11-23",
            addressLine1: "123 fake Street",
            addressLine2: "Nowhere",
            addressLine3: "Somewhere",
            addressLine4: "Here",
            addressLine5: "There",
            postcode: "S24AN",
            addressTypeCode: "C",
            countryCode: "GB",
            telephoneNumber: "01234566784"
        }
    ]    
};

const callCreatePersonAPI = (tenant, person, firstNames, familyName) => {
    auth.getAccessToken(config, tenant, scopes)
        .then(token => {
            //Update the base model with our names for this person
            personShared.applyPerson(person, familyName, firstNames, null);
            //Create the person
            api.callAdmissionsIntegrationAPI(token, tenant, 'POST', null, entityType = 'people', person, null)
                .then(createdPerson => {
                    console.dir (createdPerson, {depth: 4});
                })
                .catch(error => {
                    shared.handleError(error);
                });
        })
        .catch(error => {
            shared.handleError(error);
        });
};

callCreatePersonAPI(config.tenant, minimalPersonData, 'John',personShared.ensureUniqueValue('Smith', Date.now()));