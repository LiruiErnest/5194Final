/**
* @Description Data preprocessing
 * 1. merging multiple layer datasets.
* @Author: Rui Li
* @Date: 2019-07-30
*/

/**
 * merging multiple data layers into one data obj
 */
function dataMerging(){
    //console.log(g_dataObj);
    var mergeObj = g_dataObj[0];
    objLength = Object.keys(g_dataObj).length;
    if(objLength > 1){
        for(var i = 1; i < objLength; i++){
            console.log(i);
            
            mergeObj.dataLength = mergeObj.dataLength + g_dataObj[i].dataLength;
            mergeObj.point = mergeObj.point.concat(g_dataObj[i].point);
            mergeObj.velocity = mergeObj.velocity.concat(g_dataObj[i].velocity);
            mergeObj.magnitude = mergeObj.magnitude.concat(g_dataObj[i].magnitude);
        }
    }
    mergeObj.layerCount = objLength;
    g_dataObj = mergeObj;
}


/**
 * merge data by layers
 */
function dataMergingByLayer(){
    var mergeObj = g_dataObj[0];
    objLength = Object.keys(g_dataObj).length;

    var maxVal = -100;
    var minVal = 0;

    for(var i = 0; i< objLength; i++){
        const layerLength = 'layerLen' + i.toString();
        const pointLayer = 'point' + i.toString();
        const velocityLayer = 'velocity' + i.toString();
        const magLayer = 'magnitude' + i.toString();
        mergeObj[layerLength] = g_dataObj[i].dataLength;
        mergeObj[pointLayer] = g_dataObj[i].point;
        mergeObj[velocityLayer] = g_dataObj[i].velocity;
        mergeObj[magLayer] = g_dataObj[i].magnitude;
        var extreVal = getMinMaxOf2DIndex(mergeObj[magLayer], 1);
        if(extreVal.max > maxVal)
            maxVal = extreVal.max;
        if(extreVal.min < minVal)
            minVal = extreVal.min;
    }

    mergeObj.layerCount = objLength;
    mergeObj.maxVal = maxVal;
    mergeObj.minVal = minVal;

    g_dataObj = mergeObj;
}


