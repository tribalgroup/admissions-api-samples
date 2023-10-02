var referencedataconfig = require('../corereferencedata.js');
const { error } = require('console');

function toSingular(plural) {
    let singular = plural;
    
    if (singular.endsWith('ies')) {
        singular = singular.slice(0, -3) + 'y';
    } else if (singular.endsWith('ses')) {
        singular = singular.slice(0, -2);
    } else if (singular.endsWith('s')) {
        singular = singular.slice(0, -1);
    }
    
    return singular;
}

function getReferenceDataPropertyName(entity, referenceDataType, property) {
    let referenceDataIndentifier = null;
    let entityMember = null;

    if (referencedataconfig.coreRefdata.find(f => f.toLowerCase() === referenceDataType.toLowerCase())) {
        referenceDataIndentifier = "value";
    }
    else {
        referenceDataIndentifier = toSingular(referenceDataType.toLowerCase());
    }
    referenceDataIndentifier += property;
    for (const member in entity) {
        if (member.toLowerCase() === referenceDataIndentifier) {
            entityMember = member;
        }
    }
    return entityMember ?? property;
}
//Retrieve identifer value based on naming convention that the identifier is the singular version of the pluralised type 
function getReferenceDataIdentifierValue(entity, referenceDataType, indentifierproperty) {
    let referenceDataIndentifier = getReferenceDataPropertyName(entity, referenceDataType, indentifierproperty)?.toLowerCase();
    let entityValue = null;
    try {
        for (const member in entity) {
            if (member.toLowerCase() === referenceDataIndentifier) {
                entityValue = entity[member];
            }

        }
    }
    catch (error) {
        console.error(error);
    }
    return entityValue;
}

function getReferenceDataFilter(entity, referenceDataType, indentifierproperty) {
    const refDataPropertyName = getReferenceDataPropertyName(entity, referenceDataType, indentifierproperty);
    const refDataPropertyValue = getReferenceDataIdentifierValue(entity, referenceDataType, indentifierproperty);
    return `filter=${refDataPropertyName} eq '${encodeURIComponent(refDataPropertyValue)}'`;
}

//Decide whether we're calling admissions ref data or core reference data
function resolvedRefDataEndpoint(referenceDataType, referenceDataConfig, api) {
    if (referencedataconfig.coreRefdata.find(f => f.toLowerCase() === referenceDataType.toLowerCase())) {
        return api.callReferenceDataAPI;
    }
    else {
        return api.callAdmissionsReferenceDataIntegrationAPI;
    }
}

module.exports ={
    resolvedRefDataEndpoint: resolvedRefDataEndpoint,
    getReferenceDataPropertyName: getReferenceDataPropertyName,
    getReferenceDataFilter: getReferenceDataFilter,
    getReferenceDataIdentifierValue: getReferenceDataIdentifierValue,
    getReferenceDataPropertyName: getReferenceDataPropertyName
}