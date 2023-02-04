const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

function checkStrFloatArray(strArray,sep = ",") {

    let array;
    let right = strArray != undefined;
    let i = 0;

    if (right) {
        array = strArray.split(sep);
        while (right && i < array.length) {
            if (isNaN(array[i] = parseFloat(array[i]))) {
                right = false;
            }
            i++;
        }
    }

    return right ? array : null;
}

function strToPoint(strPoint,reverse = false) {
    
    let point = checkStrFloatArray(strPoint);

    return point != null ? (reverse ? reversePointArray(point) : point) : null;
}

function strToBbox(strBbox,reverse = false) {
    
    let bbox = checkStrFloatArray(strBbox);

    return bbox != null ? (reverse ? reverseBbox(bbox) : bbox) : null;
}

function pointToStr(point) {
    
    let res = "";

    if (Array.isArray(point)) {
        res = arrayToStr(point,",");
    } else {
        res = (point.latitude != undefined ? point.latitude : point.point.lat) + ","
                + (point.longitude != undefined ? point.longitude : point.point.lng);
    }

    return res;
}

function arrayToStr(array,sep = "|",firstSep = false) {
    
    let res = array[0] != undefined ? (firstSep ? sep : "") + array[0] : "";
    
    for (let i = 1; i < array.length; i++) {
        res += sep + array[i];
    }

    return res;
}

function pointArrayToObj(point,reverse = false) {
    return {
        latitude: point[reverse ? 1 : 0],
        longitude: point[reverse ? 0 : 1]
    }
}

function pointObjToArray(point,reverse = false) {
    return [reverse ? point.longitude : point.latitude,reverse ? point.latitude : point.longitude];
}

function pointObjCompleteNames(point) {
    return {
        latitude: point.lat,
        longitude: point.lon ?? point.lng
    }
}

function reversePointArray(point) {
    return point.reverse();
}

function reverseBbox(bbox) {
    return [bbox[1],bbox[0],bbox[3],bbox[2]];
}

function parseBoolean(strBool) {

    let bool = null;
    switch (strBool) {
        case "true":
            bool = true;
            break;
        case "false":
            bool = false;
            break;
    }

    return bool;
}

module.exports = { fetch,cleanWrtStruct,checkStrFloatArray,strToPoint,strToBbox,pointToStr,arrayToStr,pointArrayToObj,pointObjToArray,pointObjCompleteNames,reversePointArray,reverseBbox,parseBoolean }