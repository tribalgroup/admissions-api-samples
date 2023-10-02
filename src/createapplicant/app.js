var config = require('../shared/modules/config.js');
var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../shared/modules/baseapi.js');
var shared = require('../shared/modules/shared.js')

const scopes = `AdmissionsService.Api.Integration.Read AdmissionsService.Api.Integration.Write`;
const args = process.argv.slice(2);
const initialApplicantGuid = args[0];

let minimalPersonData = {
    edgePersonGuid: null,
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

let applicantData = { 
    "EdgePersonGuid": null, 
    "ApplicantIdentifier": initialApplicantGuid, 
    "AdmissionsAgencyPersonalIdentifier": "", 
    "Batch": "", 
    "ExternalReference": "", 
    "StartDate": "", 
    "EndDate": "", 
    "UkEntryDate": "", 
    "LocalEducationAuthorityCode": "", 
    "HighestQualificationLevelCode": "", 
    "SchoolCode": "", 
    "OccupationalBackgroundCode": null, 
    "CountryCode": "", 
    "InstitutionCode": "", 
    "YearLastAttendedSchool": 2010, 
    "YearLastAttendedInstitution": 2011, 
    "ReasonForFeeVariationCode": null, 
    "SchoolAppliedFromCode": "", 
    "VisaAndImmigrationMonitoring": "", 
    "MessageAlertCode": "", 
    "ParentGuardianOccupationCode": null, 
    "BatchIdentifier": ""
};


const callCreateApplicantAPI = (tenant, person, applicant) => {
    auth.getAccessToken(config, tenant, scopes)
        .then(token => {
            api.callAdmissionsIntegrationAPI(token, tenant, 'POST', null, entityType = 'people', person, null)
                .then(createdPerson => {

                    applicant.edgePersonGuid = createdPerson.body.edgePersonGuid;

                    api.callAdmissionsIntegrationAPI(token, tenant, 'POST', null, entityType = 'applicants', applicant, null)
                        .then(applicantCreated => {
                            console.log(applicantCreated);
                        })
                        .catch(error => {
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
callCreateApplicantAPI(config.tenant, minimalPersonData, applicantData);