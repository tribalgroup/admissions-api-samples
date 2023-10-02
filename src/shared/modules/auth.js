var request = require('request');

function getAccessToken(config, tenant, clientScopes){
    
    const tenantClientKey = config.clientKeys.find(f=> f.tenant.toLowerCase() === tenant)?.key ?? config.clientKey;
    
    var options = {
        'method': 'POST',
        'url': config.idsBaseUrl.replace('{tenant}',tenant) + '/connect/token',
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          'grant_type': 'client_credentials',
          'scope': clientScopes,
          'client_id': config.clientId,  //assume that client id the same for all tenants = easy to change if this differs.
          'client_secret': tenantClientKey
        }
      };

      return new Promise((res, rej) => {
        request(options, function (error, response) {
            if (error) {
                rej(error);
            }
            try
            {
              if(response.statusCode === 200)
                res(JSON.parse(response.body).access_token);
              else
              {
                rej(response);
              }
            }
            catch(ex)
            {
                rej(ex);
            }
          });
        });
}
module.exports.getAccessToken = getAccessToken;