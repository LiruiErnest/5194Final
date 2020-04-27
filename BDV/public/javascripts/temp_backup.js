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