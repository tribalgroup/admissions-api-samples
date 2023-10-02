let _logEnabled = false;
function enableLogging(logEnabled){
    _logEnabled = logEnabled;
}

function handleError(error) {

    if (error.statusCode) {
        console.error(`${error.statusCode} : ${error.statusMessage}`);
        if (error.body){
            if(error.body.validationErrors) {
                console.error(error.body.message);
                console.dir(error.body.validationErrors, { depth: 4 });
            }
            else{
                console.error(error.body);
            }
        }
    }
    else {
        console.error(error);
    }
}

function logInfo(message) {
    if (_logEnabled) {
        console.log(message);
    }
}


module.exports = {
    handleError: handleError,
    logInfo: logInfo,
    enableLogging: enableLogging
}