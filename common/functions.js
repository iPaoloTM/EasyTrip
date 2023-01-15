function cleanWrtStruct(toClean,referringStruct) {
    
    let i = toClean.length;
    let isIn = referringStruct instanceof Set ? element => referringStruct.has(element)
                : Array.isArray(referringStruct) ? element => referringStruct.indexOf(element) != -1
                : element => referringStruct[element] != undefined;
    
    while (i--) {
        if (!isIn(toClean[i])) {
            toClean.splice(i, 1);
        }
    }

    return toClean;
}

function strToPoint(strPoint) {
    
    let point;
    let right = strPoint != undefined;
    let i = 0;

    if (right) {
        point = strPoint.split(",");
        while (right && i < point.length) {
            if (isNaN(point[i] = parseFloat(point[i]))) {
                right = false;
            }
            i++;
        }
    }

    return right ? point : null;
}

function pointToString(point) {
    
    let res = "";

    if (Array.isArray(point)) {
        res = point[0] + "," + point[1];
    } else {
        res = point.latitude + "," + point.longitude;
    }

    return res;
}

function arrayToStr(array,sep = "|") {
    
    let res = array[0] != undefined ? array[0] : "";
    
    for (let i = 1; i < array.length; i++) {
        res += sep + array[i];
    }

    return res;
}

function pointArrayToObj(point) {
    return {
        latitude: point[0],
        longitude: point[1]
    }
}

function pointObjToArray(point) {
    return [point.latitude,point.longitude];
}

module.exports = { cleanWrtStruct,strToPoint,pointToString,arrayToStr,pointArrayToObj,pointObjToArray }