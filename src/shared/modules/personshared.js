function applyPerson(person, familyName, firstNames, dob){
    //update some person related properties
    if(person){
        person.legalName.familyName = familyName ?? person.legalName.familyName;
        person.legalName.givenNames = firstNames ?? person.legalName.givenNames;
        person.dateOfBirth = dob ?? person.dateOfBirth;
    }
}
function applyPrimaryContactEmailAddress(person, emailaddress){
    if(person)
    {
        if(!(person.contactDetails.find(f => f.value.toLowerCase() === emailaddress.toLowerCase())))
        {
            let primaryEmailAddressContact = {
                contactTypeCode: "EMAIL",
                value: emailaddress,
                isPreferred: false
            }
            person.contactDetails.push(primaryEmailAddressContact);
        }
    }
}
function ensureUniqueValue(value, seedDate)
{
    let nowDate = new Date(seedDate);
    let nowDateString = `${nowDate.getDate()}_${nowDate.getMonth()}`;
    return `${value}_${nowDateString}`;
}

module.exports.applyPerson = applyPerson;
module.exports.applyPrimaryContactEmailAddress = applyPrimaryContactEmailAddress;
module.exports.ensureUniqueValue = ensureUniqueValue;