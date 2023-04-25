const verifyAddress = (address)=>{
    if(!address){
        return false;
    }

    if(!address.town || !address.street){
        return false;
    }

    return true;
}

module.exports = { verifyAddress }