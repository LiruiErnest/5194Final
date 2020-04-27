/**
* @Description Map data to geometry primitives and visual channels
 * 1. linear glyph mapping
 * 2. splitvector mapping (digit and exponent)
 * 2.1 length-length
 * 2.2 length-color
 * 2.3 length-texture
* @Author: Rui Li
* @Date: 2019-07-29
*/

/**
 * splitVector mapping, length-color mapping
 Wenbing: 2019/07/31
 */
function sv_Len_ColMappingV1(){
    //radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer
    // console.log(g_dataObj);

    const material = new THREE.MeshBasicMaterial({color:0x3c3f41});

    //param of Cylinder
    const radiusTop = 0.1;
    const radiusBottom = 0.1;
    const height = 1;
    const radialSegments = 16;
    const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
    // geometry.rotateX(rot_x);
    // geometry.rotateX(rot_y);
    // geometry.rotateX(rot_z);
    // geometry.translate( pos_x, pos_y, pos_z);
    // geometries.push(geometry);

    const geometries = [];
    for(var i = 0; i < g_dataObj.dataLength; i++){

        var pos_x = g_dataObj.point[i][0];
        var pos_y = g_dataObj.point[i][1];
        var pos_z = g_dataObj.point[i][2];

        var rot_x = g_dataObj.velocity[i][0];
        var rot_y = g_dataObj.velocity[i][1];
        var rot_z = g_dataObj.velocity[i][2];


        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = rot_x;
        mesh.rotation.y = rot_y;
        mesh.rotation.z = rot_z;
        mesh.position.x = pos_x;
        mesh.position.y = pos_y;
        mesh.position.z = pos_z;


        scene.add(mesh);
    }

    // const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
    //     geometries, false);
    // const material = new THREE.MeshBasicMaterial({color:0x3c3f41});
    // const mesh = new THREE.Mesh(mergedGeometry, material);
    // scene.add(mesh);


}


/**
 * splitVector mapping, length-color mapping
 Rui: 2019/07/31
 merging geometries
 */
function sv_Len_ColMappingV2(){
    //radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer
    // console.log(g_dataObj);
    //split data into several fragments
    var layer = parseFloat(g_dataObj.dataLength / 50000);
    console.log(layer);
    if(layer < 1){
        var geometries = [];
        for(var i = 0; i < g_dataObj.dataLength; i++){
            var pos_x = g_dataObj.point[i][0];
            var pos_y = g_dataObj.point[i][1];
            var pos_z = g_dataObj.point[i][2];

            var rot_x = g_dataObj.velocity[i][0];
            var rot_y = g_dataObj.velocity[i][1];
            var rot_z = g_dataObj.velocity[i][2];

            //param of Cylinder
            const radiusTop = 0.1;
            const radiusBottom = 0.1;
            var height = g_dataObj.magnitude[i][0];
            const radialSegments = 16;
            const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
            geometry.rotateX(rot_x);
            geometry.rotateX(rot_y);
            geometry.rotateX(rot_z);
            geometry.translate( pos_x, pos_y, pos_z);
            geometries.push(geometry);
        }
        var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
            geometries, false);
        var material = new THREE.MeshBasicMaterial({color:0x3c3f41});
        var mesh = new THREE.Mesh(mergedGeometry, material);
        scene.add(mesh);
    }
    
    if(layer > 1){
        for(var j = 0; j < parseInt(layer); j++){
            var geometries = [];
            for(var i = 50000*j; i < 50000*(j+1); i++){
                //console.log(i);
                var pos_x = g_dataObj.point[i][0];
                var pos_y = g_dataObj.point[i][1];
                var pos_z = g_dataObj.point[i][2];

                var rot_x = g_dataObj.velocity[i][0];
                var rot_y = g_dataObj.velocity[i][1];
                var rot_z = g_dataObj.velocity[i][2];

                //param of Cylinder
                const radiusTop = 0.1;
                const radiusBottom = 0.1;
                var height = g_dataObj.magnitude[i][0];
                const radialSegments = 16;
                const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
                geometry.rotateX(rot_x);
                geometry.rotateX(rot_y);
                geometry.rotateX(rot_z);
                geometry.translate( pos_x, pos_y, pos_z);
                geometries.push(geometry);
            }
            var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
                geometries, false);
            var material = new THREE.MeshBasicMaterial({color:0x3c3f41});
            var mesh = new THREE.Mesh(mergedGeometry, material);
            scene.add(mesh);
        }
        //the rest of points
        var geometries = [];
        for(var i = 50000*parseInt(layer); i < g_dataObj.dataLength; i++){
            var pos_x = g_dataObj.point[i][0];
            var pos_y = g_dataObj.point[i][1];
            var pos_z = g_dataObj.point[i][2];

            var rot_x = g_dataObj.velocity[i][0];
            var rot_y = g_dataObj.velocity[i][1];
            var rot_z = g_dataObj.velocity[i][2];

            //param of Cylinder
            const radiusTop = 0.1;
            const radiusBottom = 0.1;
            var height = g_dataObj.magnitude[i][0];
            const radialSegments = 16;
            const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);
            geometry.rotateX(rot_x);
            geometry.rotateX(rot_y);
            geometry.rotateX(rot_z);
            geometry.translate( pos_x, pos_y, pos_z);
            geometries.push(geometry);
        }
        var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
            geometries, false);
        var material = new THREE.MeshBasicMaterial({color:0x3c3f41});
        var mesh = new THREE.Mesh(mergedGeometry, material);
        scene.add(mesh);
    }


}

/**
 * splitVector mapping, length-color mapping
 Rui: 2019/07/31
 merging geometries
 add color coding
 rendering by layer
 */
function sv_Len_ColMappingV3(){
    //radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer
    // layers in the dataset
    layerCount = g_dataObj.layerCount;
    // generate geometry layer by layer
    for(let i = 0; i < layerCount; i++){
        var dataLength = g_dataObj['layerLen' + i.toString()];
        var geometries = [];
        for(let j = 0; j < dataLength; j++){

            //retrive the location and velocity of each data point

            var pointLayer = 'point' + i.toString();
            var velocityLayer = 'velocity' + i.toString();
            var magLayer = 'magnitude' + i.toString();

            var pos_x = g_dataObj[pointLayer][j][0];
            var pos_y = g_dataObj[pointLayer][j][1];
            var pos_z = g_dataObj[pointLayer][j][2];

            var rot_x = g_dataObj[velocityLayer][j][0];
            var rot_y = g_dataObj[velocityLayer][j][1];
            var rot_z = g_dataObj[velocityLayer][j][2];

            //param of Cylinder
            var radiusTop = 0.1;
            var radiusBottom = 0.1;
            var height = g_dataObj[magLayer][j][0];
            var radialSegments = 8;
            var geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments);

            geometry.rotateX(rot_x);
            geometry.rotateX(rot_y);
            geometry.rotateX(rot_z);
            geometry.translate( pos_x, pos_y, pos_z);

            // make an array to store colors for each vertex
            var numVerts = geometry.getAttribute('position').count;
            var itemSize = 3;  // r, g, b
            var colors = new Uint8Array(itemSize * numVerts);
            var rgb = expToColor(g_dataObj[magLayer][j][1]);

            colors.forEach((v, ndx) => {
                colors[ndx] = rgb[ndx % 3];
            });

            const colorAttrib = new THREE.BufferAttribute(colors, itemSize, true);
            geometry.addAttribute('color', colorAttrib);

            geometries.push(geometry);
        }
        var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
            geometries, false);
        var material = new THREE.MeshLambertMaterial({
            vertexColors: THREE.VertexColors,
        });
        var mesh = new THREE.Mesh(mergedGeometry, material);
        scene.add(mesh);
    }
    

}

function sv_Len_ColMappingInstance(){

}
