/**
* @Description load vtk data, UNSTRUCTURED_GRID point
 * convert vtk file into json format
 ******* vtk format: https://vtk.org/wp-content/uploads/2015/04/file-formats.pdf
 * part 1: Header, vtk data version
 * part 2: title of vtk data
 * part 3: Data type, either ASCII or BINARY
 * part 4: Geometry/topology. Type is one of: STRUCTURED_POINTS, STRUCTURED_GRID, UNSTRUCTURED_GRID, POLYDATA, RECTILINEAR_GRID, FIELD
 * part 5: Dataset attributes. The number of data items n of each type must match the number of points
 *******
* @Author: Rui Li
* @Date: 2019-07-27
*/

// /**
// **** comments, load data, old version, not support async
//  * read vtk file
//  * @param fileName: vtk file name
//  * @param scale: whether to scale the data， default = 1
//  */
// function readVTKFile(fileName, scale = 1) {
//     //retrieve data from a URL, asyn
//     var request = new XMLHttpRequest();
//
//     request.onreadystatechange = function() {
//         if (request.readyState === 4 && request.status !== 404) {
//             //console.log(request.responseText);
//             onReadVTKFile(request.responseText, fileName, scale);
//             //Rui Li, 2019/07/29
//             sv_Len_ColMapping();
//         }
//     }
//     request.open('GET', fileName, true); // Create a request to acquire the file
//     request.send();                      // Send the request
// }


/**
 * read vtk file
 * @param vtkURL: vtk file location
 * @param scale: whether to scale the data， default = 1
 * @param layerRange: identify the range of layer, should be an array
 * @returns {Promise<unknown>}
 */
function readVTKFile(vtkURL, layerRange, scale = 1) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {

        // Rui, 2019/07/30 multiple files reader
        var reqs = new Array(layerRange.length);
        for(let i = 0; i < layerRange.length; i++){
            var url = vtkURL + layerRange[i].toString() + '.vtk';
            console.log(url);
            reqs[i] = new XMLHttpRequest();
            reqs[i].open('GET', url, true);
            reqs[i].onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (reqs[i].status == 200) {
                    // Resolve the promise with the response text
                    g_dataObj[i] = onReadVTKFile(reqs[i].responseText, 'data'+i.toString(), scale);
                    // read all dataset, then callback
                    if(i == layerRange.length - 1){
                        resolve(reqs[i].response);
                    }
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(reqs[i].statusText));
                }
            };
            // Handle network errors
            reqs[i].onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            reqs[i].send();

        }

    });
}

/**
 * retrive the data from filestring and store into g_dataObj
 * @param fileString: data retrived from XMLHttpRequest
 * @param fileName: filename meta infomation
 * @param scale: whether to scale the data， default = 1
 */
function onReadVTKFile(fileString, fileName, scale) {
    var dataObj = new vtkOBJ(fileName);  // Create a OBJDoc object
    var result = dataObj.parse(fileString, scale); // Parse the file
    if (!result) {
        g_dataObj = null;
        console.log("VTK file parsing error.");
        return;
    }
    return dataObj;
    //g_dataObj = dataObj;
}

/**
 * create the vtkOBJ object
 * @param fileName
 */
var vtkOBJ = function(fileName) {
    this.fileName = fileName;  //file name/URL of file
    this.title = '';       //vtk file part I: title
    this.datatype = '';    //vtk data type
    this.geometry = '';    //vtk geometry/topology
    this.dataLength = 0;   //vtk data length
    this.layerCount = 1;   //vtk data layer count
    this.point = new Array(0);  // Initialize the property for points
    this.velocity = new Array(0);   // Initialize the property for velocity
    this.magnitude = new Array(0);  // Initialize the property for Vertex
}

/**
 * parse vtk fileString into vtkOBJ object
 * @param fileString
 * @param scale
 */
vtkOBJ.prototype.parse = function(fileString, scale){

    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null); // Append null
    var index = 0;    // Initialize index of line

    // Parse line by line
    var line;         // A string in the line to be parsed
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[index++]) != null) {
        // retrive the meta information:
        if(index <= 4){
            switch (index) {
                case 1:
                    continue;
                case 2:
                    this.title = line;
                    continue;
                case 3:
                    this.datatype = line;
                    continue;
                case 4:
                    this.geometry = line;
                    continue;
            }
        }
        // retrive data attribute
        sp.init(line);   //init string parser
        var word = sp.getWord();     // get word in string(line)
        if(word == null)
            continue;
        switch(word){
            case "#":
                continue;   //skip comments
            case "POINTS":  //retrive points data
                this.dataLength = this.parseDataLength(sp);  //retrive the data length
                // read points data
                for(var i = 0; i < this.dataLength; i++){
                    var pointData = lines[i + index];
                    this.point.push(this.parsePointData(pointData, scale));
                }
                index += this.dataLength;
                continue;
            case "VECTORS": //retrive vector data
                for(var i = 0; i < this.dataLength; i++){
                    var vecData = lines[i + index];
                    this.velocity.push(this.parseVectorData(vecData));
                }
                index += this.dataLength;
                continue;
            case "LOOKUP_TABLE":  //retrive magnitude data
                for(var i = 0; i < this.dataLength; i++){
                    var magData = lines[i + index];
                    this.magnitude.push(this.parseMagData(magData));}
                index += this.dataLength;
                continue;
            default:
                continue;
        }
    }
    return true;
}


/**
 * retrive the data length of input file
 * @param sp
 */
vtkOBJ.prototype.parseDataLength = function(sp){
    var dataLength = parseInt(sp.getWord());
    return dataLength;
}

/**
 * retrive the point data from input file
 * @param line: x, y, z point data
 * @param scale: scale to point data
 * @returns {number[]}: point position
 */
vtkOBJ.prototype.parsePointData = function(line, scale){
    var position = line.split(' ');
    var x = scale * parseFloat(position[0]);
    var y = scale * parseFloat(position[1]);
    var z = scale * parseFloat(position[2]);
    return Array(x, y, z);
}

/**
 * retrive the velocity data(vectors) from input file
 * @param line
 * @returns {number[]}: velocity vectors
 */
vtkOBJ.prototype.parseVectorData = function(line){
    var velocity = line.split(' ');
    var v_x = parseFloat(velocity[0]);
    var v_y = parseFloat(velocity[1]);
    var v_z = parseFloat(velocity[2]);
    return Array(v_x, v_y, v_z);
}

/**
 * retrive the magnitude data from input file
 * store in split format: digit and exponent: e.g. 1.34e-3: [1.34, -3]
 * @param line
 */
vtkOBJ.prototype.parseMagData = function(line){
    //convert all scalar value here to scientific notation
    var sciNotation = parseFloat(line).toExponential();
    //split the scientific notation into digit and exponent
    var splitNotation = sciNotation.split('e');
    var digit = parseFloat(splitNotation[0]);
    var exponent = parseInt(splitNotation[1]);
    return Array(digit, exponent);
}

/**
 * Constructor of string parser
 * @param str
 * @constructor
 */
var StringParser = function(str) {
    this.str;   // Store the string specified by the argument
    this.index; // Position in the string to be processed
    this.init(str);
}

/**
 * Initialize StringParser object
 * @param str
 */
StringParser.prototype.init = function(str){
    this.str = str;
    this.index = 0;
}

/**
 * Skip delimiters
 */
StringParser.prototype.skipDelimiters = function()  {
    for(var i = this.index, len = this.str.length; i < len; i++){
        var c = this.str.charAt(i);
        // Skip TAB, Space, '(', ')
        if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"') continue;
        break;
    }
    this.index = i;
}

/**
 * Skip to the next word
 */
StringParser.prototype.skipToNextWord = function() {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    this.index += (n + 1);
}

/**
 * Get word
 * @returns {string|null}
 */
StringParser.prototype.getWord = function() {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    if (n == 0) return null;
    var word = this.str.substr(this.index, n);
    this.index += (n + 1);

    return word;
}

/**
 * Get integer
 * @returns {number}
 */
StringParser.prototype.getInt = function() {
    return parseInt(this.getWord());
}

/**
 * Get floating number
 * @returns {number}
 */
StringParser.prototype.getFloat = function() {
    return parseFloat(this.getWord());
}

/**
 * get the length of the word
 * @param str
 * @param start
 * @returns {number}
 */
function getWordLength(str, start) {
    var n = 0;
    for(var i = start, len = str.length; i < len; i++){
        var c = str.charAt(i);
        if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"')
            break;
    }
    return i - start;
}





















