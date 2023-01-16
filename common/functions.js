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

function strToPoint(strPoint,reverse = false) {
    
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

    return right ? (reverse ? reversePointArray(point) : point) : null;
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

function reversePointArray(point) {
    return point.reverse();
}

module.exports = { fetch,cleanWrtStruct,strToPoint,pointToStr,arrayToStr,pointArrayToObj,pointObjToArray,reversePointArray }