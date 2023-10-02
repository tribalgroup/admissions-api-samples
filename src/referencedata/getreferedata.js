var config = require('../shared/modules/config.js');
var refDataShared = require('./modules/referencedatashared.js')
var shared = require('../shared/modules/shared.js')

var args = process.argv.slice(2); //2nd param (excluding the path/app param)
const typeToDisplay = args[0] ?? "Country";

function displayReferenceData(referenceDataType, tenant)
{
    refDataShared.getReferenceDataFromTenant(referenceDataType,tenant)
    .then( refData => {
        console.dir(refData.body, {depth: 4});
    })
    .catch(error => {
        shared.handleError(error);
    })
}
displayReferenceData(typeToDisplay, config.tenant);
