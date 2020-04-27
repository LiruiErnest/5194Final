/**
* @Description Map data to color 
color range: 0-20
* @Author: Rui Li
* @Date: 2019-07-29
*/

//color table, 18 colors
const MPL_coolwarm = [[64, 84, 199],
 [80, 107, 218],
 [99, 131, 234],
 [117, 152, 246],
 [135, 170, 252],
 [155, 187, 254],
 [175, 202, 251],
 [193, 212, 244],
 [209, 218, 232],
 [224, 218, 215],
 [236, 209, 195],
 [244, 196, 173],
 [247, 179, 151],
 [245, 160, 129],
 [239, 137, 108],
 [230, 114, 89],
 [215, 84, 68],
 [197, 50, 51]];

/**
 * mapping data to color (-1-18 to )
 * @returns {Promise<void>}
 */
function expToColor(expVal){

	var maxVal = Math.abs(g_dataObj.minVal);
	var minVal = Math.abs(g_dataObj.maxVal);
	var range = (maxVal - minVal) + 1;
	var interval = parseInt(18 / range);

	absVal = Math.abs(expVal);
	index = (absVal - minVal) * interval;
	return MPL_coolwarm[17 - index];
}

