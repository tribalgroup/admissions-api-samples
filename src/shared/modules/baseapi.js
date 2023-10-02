var request = require('request');
var config = require('../modules/config.js')


function callAdmissionsIntegrationAPI(token, tenant, method, entityId, entityType, body, etag, skip, take, filter)
{
    return callIntegrationAPI(config.admissionsBaseUrl.replace("{tenant}",tenant),token, method, entityId, entityType, body, etag, skip, take, filter);
}

function callAdmissionsReferenceDataIntegrationAPI(token, tenant, method, entityId, entityType, body, etag, skip, take, filter) {
    return callIntegrationAPI(config.admissionsBaseUrl.replace("{tenant}",tenant),  token, method, entityId, 'referenceData/' + entityType, body, etag, skip, take, filter);
}

function callReferenceDataAPI(token, tenant, method, entityId, entityType, body, etag, skip, take, filter){
    return callIntegrationAPI(config.referenceDataBaseUrl.replace("{tenant}",tenant), token, method, entityId, 'referenceData/' +entityType, body, etag, skip, take, filter);
}

function callIntegrationAPI(apiseturl, token, method, entityId, entityType, body, etag, skip, take, filter) 
{
     let entityUrl = (entityId ? '/': '') + (entityId ?? '')
     let pageQuery = (skip!=undefined? `skip=${skip}`:"")+(take!=undefined?(skip!=undefined?"&":"")+`take=${take}`:"")
     let filterQuery = "" + (filter? (pageQuery ? "&": "?") + filter: "")
;    let options = {
        'json': true,
        'method': method,
        'url': `${apiseturl}/api/${entityType}` + (method !== 'POST' ? entityUrl : '') + (pageQuery?`?${pageQuery}`: "") + (filterQuery ? filterQuery: ""),
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body
    };

    if (etag) {
        options.headers['If-Match'] = etag;
    }

    return new Promise((res, rej) => {
        request(options,
            function (error, response) {
                if (error) {
                    rej(error);
                }
                try {
                    var responseobject = {
                        body: response.body,
                        correlationid: response.headers['x-correlation-id'],
                        etag: response.headers['etag'],
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage
                    };

                    if (response.statusCode >= 200 && response.statusCode < 300)
                    { //if we have a 2xx response
                        res(responseobject);
                    }
                    else
                    {
                        rej(responseobject);
                    }
                } catch (ex) {
                    rej(ex);
                }
            });
    });
}

module.exports = {
    callAdmissionsIntegrationAPI:callAdmissionsIntegrationAPI,
    callReferenceDataAPI:callReferenceDataAPI,
    callAdmissionsReferenceDataIntegrationAPI: callAdmissionsReferenceDataIntegrationAPI
};
