var config = require('../shared/modules/config.js');
var auth = require('../shared/modules/auth.js'); //import the auth function to call the auth endpoint to retrieve access token
var api = require('../shared/modules/baseapi.js'); //stubs the basic api structure out
const { error } = require('console');
var referencedataconfig = require('./corereferencedata.js');
var refDataShared = require('./modules/referencedatashared.js')
const shared = require('../shared/modules/shared.js');
const progressBar = require('../shared/modules/progressbar.js')

shared.enableLogging(false);

//Transfer from source tenant to destination tenant.  Overwrite existing entries.
async function transferReferenceDataBetweenTenants(source, destination, referencedatatype) {
    try {

        let currentTotal = -1;
        let iteration = 0;
        let entities = null;
        const takeAmount = 100
        const token = await auth.getAccessToken(config, destination, refDataShared.scopes); // Wait for the promise to resolve
        let totalCount = 0;
        let currentRecordCount = 0;
        const transferMessage = `Transferring ${referencedatatype} from ${source} to ${destination}`;
        console.log(' ');
        console.log(`Considering ${referencedatatype}.`);
    
        while (currentTotal < totalCount) {
            entities = await refDataShared.getReferenceDataFromTenant(referencedatatype, source, iteration * takeAmount, takeAmount); //Start the take
            if (totalCount === 0) {
                totalCount = entities.body.total;
                currentTotal = 0;
            }
            currentTotal += entities.body.count;

            let entityCreateOrUpdated = null;
            for (const entity of entities.body.collection) {
                try {
                    entityCreateOrUpdated = await refDataShared.updateReferenceDataItem(token, referencedatatype, destination, entity); // Wait for the promise to resolve
                } catch (error) {
                    if (error.statusCode && error.statusCode === 404) {
                        try {
                            entityCreateOrUpdated = await refDataShared.createReferenceDataItem(token, referencedatatype, destination, entity); // Wait for the promise to resolve
                        }
                        catch (error) {
                            shared.handleError(error);
                        } // Wait for the promise to resolve
                    }
                    else {
                        shared.handleError(error);
                    }
                }
                currentRecordCount++
                progressBar.updateProgressBar(transferMessage, currentRecordCount, totalCount);
            }
            iteration++;
        }
    } catch (error) {
        shared.handleError(error);
    }
}

async function mainTransfer() {
    const tenantA = config.source;
    const tenantB = config.destination;
    let simpleRefDataArray = [];
    //Call the main transfer of core reference data
    for (const coreRefDataItem of referencedataconfig.coreRefdata) {
        await transferReferenceDataBetweenTenants(tenantA, tenantB, coreRefDataItem);
    }

    //Synchronously for now (dependencies can be worked through later
    for(const admissionsRefDataItem of referencedataconfig.admissionRefData)
    {
        await transferReferenceDataBetweenTenants(tenantA, tenantB, admissionsRefDataItem);
    }

}
mainTransfer();