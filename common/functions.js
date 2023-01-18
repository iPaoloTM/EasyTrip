function cleanWrtStruct(toClean,referringStruct) {
<<<<<<< HEAD

=======
    
>>>>>>> path_search
    let i = toClean.length;
    let isIn = referringStruct instanceof Set ? element => referringStruct.has(element)
                : Array.isArray(referringStruct) ? element => referringStruct.indexOf(element) != -1
                : element => referringStruct[element] != undefined;
<<<<<<< HEAD

=======
    
>>>>>>> path_search
    while (i--) {
        if (!isIn(toClean[i])) {
            toClean.splice(i, 1);
        }
    }

    return toClean;
}

function strToPoint(strPoint) {
<<<<<<< HEAD

=======
    
>>>>>>> path_search
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
<<<<<<< HEAD
=======

>>>>>>> path_search
    return right ? point : null;
}

function pointToString(point) {
<<<<<<< HEAD

=======
    
>>>>>>> path_search
    let res = "";

    if (Array.isArray(point)) {
        res = point[0] + "," + point[1];
    } else {
        res = point.latitude + "," + point.longitude;
    }

    return res;
}

function arrayToStr(array,sep = "|") {
<<<<<<< HEAD

    let res = array[0] != undefined ? array[0] : "";

=======
    
    let res = array[0] != undefined ? array[0] : "";
    
>>>>>>> path_search
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

<<<<<<< HEAD
module.exports = { cleanWrtStruct,strToPoint,pointToString,arrayToStr,pointArrayToObj,pointObjToArray }
=======
module.exports = { cleanWrtStruct,strToPoint,pointToString,arrayToStr,pointArrayToObj,pointObjToArray }
>>>>>>> path_search
