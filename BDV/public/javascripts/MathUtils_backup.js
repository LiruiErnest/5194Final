/**
* @Description Math utilities
* @Author: Rui Li
* @Date: 2019-07-30
*/

/**
 * @param  {arr}  array
 * @param  {idx}  index of the values to compare
 * @return max and min value from column index
 */
function getMinMaxOf2DIndex (arr, idx) {
    return {
        min: Math.min.apply(null, arr.map(function (e) { return e[idx]})),
        max: Math.max.apply(null, arr.map(function (e) { return e[idx]}))
    }
} 