# Purpose
Samples that demonstrate the use of the Admissions Integration API suite.

This repository provides information on using the API, along with some samples that you can download and execute to demonstrate the functionality.  

# Using the samples

## Pre-requisites/Requirements

- Node (> 18.4.0 ) - https://nodejs.org/en/download/ - install for your platform.
- The base url of the Integration API for both Admissions and Reference Data (if you are working with reference data) e.g. Admissions - https://api-master.edge.tribaldev.net/emea/admissions/{tenant}/, Reference Data = https://api-master.edge.tribaldev.net/emea/referencedata/{tenant}/ 
- Your Edge Identity Server url e.g. https://identity-master.edge.tribaldev.net/emea/ids/{tenant}/
- Client details (id/secret) for a client created with the ```AdmissionsService.Api.Integration.Read, AdmissionsService.Api.Integration.Sensitive.Read, AdmissionsService.Api.Integration.Sensitive.Write, AdmissionsService.Api.Integration.Write, ReferenceData.Api.Manage, ReferenceData.Api.Read``` scopes; for samples across 2 tenants you will need a client/secret for each tenant.  Please use the same Client ID for both secrets when generating e.g. api_samples.   Please see the relevant section with details of how to configure a client.  Note that you may not need all scopes for all API operations, the above scopes are created in a single client for the sake of simplicity.  NOTE: This can be obtained by using the "API client credentials" feature of the Admin app in the Gateway.

## Running 

1. In a terminal session, from within the ```src``` folder run: 

```powershell
npm install
```

This should install all dependencies for the samples; you only have to do this the first time, unless a new version of a sample requires new dependencies.

2. In the ```src/env``` folder, copy and rename one of the env templates, for example  ```empty.env.template```  to create a ```.env``` file.  You then need to update this file with your own environment details.  The IDS_BASE_URL, ADMISSIONS_INTEGRATION_BASE_URL and REFERENCE_INTEGRATION_BASE_URL all require "{tenant}" in the URL so that the tenant passed in code can be interpolated into the URL. 

|Item                     |Value                        |
|-------------------------|-----------------------------|
|IDS_BASE_URL| Url of Edge Identity Server with {tenant} in place of your actual tenant e.g. ``` https://identity-master.edge.tribaldev.net/emea/ids/{tenant}/ ``` would be  ``` https://identity-master.edge.tribaldev.net/emea/ids/{tenant}/ ```.  Some of the samples require to connect to more than 1 tenant.
|ADMISSIONS_INTEGRATION_BASE_URL| Base URL for all Admissions Integration API with {tenant} in place of your actual tenant e.g. ``` https://api-master.edge.tribaldev.net/emea/admissions/caltech/``` would be  ``` https://api-master.edge.tribaldev.net/emea/admissions/{tenant}/```.  Some of the samples require to connect to more than 1 tenant.|
|REFERENCE_INTEGRATION_BASE_URL| Base URL for all Reference Data Integration API with {tenant} in place of your actual tenant e.g. ``` https://api-master.edge.tribaldev.net/emea/referencedata/caltech/``` would be  ``` https://api-master.edge.tribaldev.net/emea/referencedata/{tenant}```.  Some of the samples require to connect to more than 1 tenant.|
|CLIENT_ID | Client ID created via the Edge Admin application.   Will start with ```api_``` if generated via the Edge Admin application; this may differ if you have been provided one by Tribal directly.|
|CLIENT_KEY| Client Secret created via the Edge Admin application.  This is normally the same as the CLIENT_SOURCE_KEY and is duplicated for the sake of simplicity.  Please enclose your key with quotes to avoid and parsing issues.|
|CLIENT_SOURCE_TENANT| When running the reference data transfer samples this is the tenant code of the source tenant e.g. caltechtest.  This is also the sole tenant when not using samples that are multiple tenants; this can be accessed in code as config.tenant or config.source.|
|CLIENT_DEST_TENANT| When running the reference data transfer sample this is the tentant code of the destination tenant e.g. caltechlive; this can be accessed in code as config.destination.|
|CLIENT_SOURCE_KEY| When running the reference data transfer samples this is the client key setup on the source tenant; it is assumed both source and destination tenants have the same CLIENT_ID.  Please enclose your key with quotes to avoid and parsing issues.|
|CLIENT_DEST_KEY| When running the reference data transfer sample this is the client key setup on the destination tenant; it is assumed both source and destination tenants have the same CLIENT_ID.  Please enclose your key with quotes to avoid and parsing issues.|

3. To run a sample, in your terminal window, type:
```
node app.js
```
If running from a sample directory, or:
```
node .\getaccesstoken\app.js
```
If running from the root src/ folder (remember to target the correct sample folder).
