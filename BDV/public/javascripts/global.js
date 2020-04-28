/*
 * @Author: Rui Li
 * @Date: 2020-04-27 16:19:23
 * @LastEditTime: 2020-04-27 22:06:48
 * @Description: 
 * @FilePath: /5194Final/BDV/public/javascripts/global.js
 */


var renderer;
var camera;
var scene;
var controls;  //trackball
var stats;   //fps monitor
var container;  //canvas for presenting the scene
var height;
var width;
var g_dataObj;
// var objectCenter;
var task = 1;


// var polyfill = new WebVRPolyfill();

import { VRButton } from 'https://unpkg.com/three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.115.0/examples/jsm/webxr/XRControllerModelFactory.js'

var controller1, controller2;
var controllerGrip1, controllerGrip2;

var raycaster, intersected = [];
var tempMatrix = new THREE.Matrix4();

var group;

var task1 = [
    [{ x: 1, y: 0.2, z: 1 },
    { x: 1, y: 2.8, z: 0.2 },
    { x: -2, y: 0, z: 1 }],
    [{ x: -2, y: 1.2, z: -2.2 },
    { x: 1, y: 2.8, z: 0.2 },
    { x: -2, y: 0, z: 1 }],
    [{ x: 1, y: 0.2, z: 1 },
    { x: 4, y: -2.0, z: -3.0 },
    { x: -2, y: 0, z: 1 }],
    [{ x: -1, y: -2.8, z: -2.2 },
    { x: 2, y: -2.2, z: -2.4 },
    { x: -2, y: 0, z: 1 }]
];

var task2 = [
    [{ x: 0.3, y: 0.2, z: 1.1 },
    { x: 1, y: 0.4, z: -1.1 }],
    [{ x: -1.8, y: -2.1, z: -2.1 },
    { x: -2.8, y: -1.8, z: -1.8 }],
    [{ x: -0.8, y: 3.9, z: 1.6 },
    { x: -2.8, y: 3.7, z: 1.0 }],
    [{ x: 3.3, y: 1.2, z: 1.1 },
    { x: 3.7, y: 0.4, z: -0.1 }]
];

var task1_index = 0;
var task2_index = 0;

/**
 * program start
 */
$(document).ready(function () {


    programStart();



});

function initRenderer() {

    width = window.innerWidth;
    height = window.innerHeight;
    // init renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        stencil: false,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x52576e, 1.0); //Sets the clear color and opacity
    //renderer.vr.enabled = true;
    // init container that used to install the render the scene
    container = document.createElement('div');
    renderer.xr.enabled = true;
    document.body.appendChild(container);
    document.body.appendChild(VRButton.createButton(renderer));
    container.appendChild(renderer.domElement);

}

/**
 * initiate the camera
 */
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // camera.position.x = 0;
    // camera.position.y = 0;
    camera.position.z = 20;
    // camera.up.x = 0;
    // camera.up.y = 1;
    // camera.up.z = 0;
    // camera.lookAt(-10, -10, 0);
}

/**
 * initiate the scene
 */
function initScene() {
    scene = new THREE.Scene();
    group = new THREE.Group();
    // var axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
}


/**
 * initiate the light
 */
function initLight() {

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    var keyLight = new THREE.DirectionalLight(0xbdc3c7, 1.0);
    keyLight.position.set(-100, 0, 100);

    // var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    // fillLight.position.set(100, 0, 100);

    var backLight = new THREE.DirectionalLight(0xbdc3c7, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    scene.add(keyLight);
    //scene.add(fillLight);
    scene.add(backLight);
    //ambient light


    // var PointLight = new THREE.DirectionalLight( 0xffffff, 0.8);
    // PointLight.position.set( 20, 20, 30 );
    // scene.add( PointLight );
}


async function initContent() {
    initControls();
    await loadBrain();
    g_dataObj.translateZ(0);
    g_dataObj.scale.set(0.1, 0.1, 0.1);

    //task 1
    if (task == 1) {
        var geometry = new THREE.SphereGeometry(0.2, 32, 32);
        var material = new THREE.MeshLambertMaterial({ color: 0xee5253 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.translateX(task1[task1_index][0].x);
        sphere.translateY(task1[task1_index][0].y);
        sphere.translateZ(task1[task1_index][0].z);
        // sphere.renderOrder = 99;
        // sphere.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        var material2 = new THREE.MeshLambertMaterial({ color: 0x1dd1a1 });
        var material3 = new THREE.MeshLambertMaterial({ color: 0xfeca57 });
        var ref_shpere1 = new THREE.Mesh(geometry, material2);
        var ref_shpere2 = new THREE.Mesh(geometry, material3);
        ref_shpere1.translateX(task1[task1_index][1].x);
        ref_shpere1.translateY(task1[task1_index][1].y);
        ref_shpere1.translateZ(task1[task1_index][1].z);
        ref_shpere2.translateX(task1[task1_index][2].x);
        ref_shpere2.translateY(task1[task1_index][2].y);
        ref_shpere2.translateZ(task1[task1_index][2].z);
        // group = new THREE.Group();
        group.add(g_dataObj);
        group.add(sphere);
        group.add(ref_shpere1);
        group.add(ref_shpere2);
        group.translateZ(-1);
        group.scale.set(0.5, 0.5, 0.5);
        scene.add(group);
    }
    else if (task == 2) {
        var geometry = new THREE.SphereGeometry(0.2, 32, 32);
        var material = new THREE.MeshLambertMaterial({ color: 0xee5253 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.translateX(task2[task2_index][0].x);
        sphere.translateY(task2[task2_index][0].y);
        sphere.translateZ(task2[task2_index][0].z);
        // sphere.renderOrder = 99;
        // sphere.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        var material2 = new THREE.MeshLambertMaterial({ color: 0x1dd1a1 });
        var ref_shpere1 = new THREE.Mesh(geometry, material2);
        ref_shpere1.translateX(task2[task2_index][1].x);
        ref_shpere1.translateY(task2[task2_index][1].y);
        ref_shpere1.translateZ(task2[task2_index][1].z);
        // group = new THREE.Group();
        group.add(g_dataObj);
        group.add(sphere);
        group.add(ref_shpere1);
        group.translateZ(-1);
        group.scale.set(0.5, 0.5, 0.5);
        scene.add(group);

        // scene.add(g_dataObj);
        // scene.add(sphere);
        // scene.add(ref_shpere1);
    }



    //initXRController();
    //animate();
    renderer.setAnimationLoop(animate);



    //controls.target = objectCenter;
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);
    controls.update();


}









function loadBrain() {
    return new Promise(function (resolve, reject) {
        var loader = new THREE.OBJLoader();
        loader.setPath('public/data/');
        loader.load('neuron2.obj', function (object) {

            var objBbox = new THREE.Box3().setFromObject(object);
            // objectCenter = objBbox.getCenter();
            // Geometry vertices centering to world axis
            var bboxCenter = objBbox.getCenter().clone();
            bboxCenter.multiplyScalar(-1);

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
                }
            });

            objBbox.setFromObject(object); // Update the bounding box

            g_dataObj = object;

            resolve(object);
        })
    })
}

/**
 * VR interactions
 */
function initXRController() {
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    var controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    var geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

    var line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

    raycaster = new THREE.Raycaster();

}

function onSelectStart(event) {

    var controller = event.target;

    var intersections = getIntersections(controller);

    if (intersections.length > 0) {

        var intersection = intersections[0];

        tempMatrix.getInverse(controller.matrixWorld);

        var object = intersection.object;
        object.matrix.premultiply(tempMatrix);
        object.matrix.decompose(object.position, object.quaternion, object.scale);
        object.material.emissive.b = 1;
        controller.add(object);

        controller.userData.selected = object;

    }

}

function onSelectEnd(event) {

    var controller = event.target;

    if (controller.userData.selected !== undefined) {

        var object = controller.userData.selected;
        object.matrix.premultiply(controller.matrixWorld);
        object.matrix.decompose(object.position, object.quaternion, object.scale);
        object.material.emissive.b = 0;
        group.add(object);

        controller.userData.selected = undefined;

    }


}

function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(group.children);

}

function intersectObjects(controller) {

    // Do not highlight when already selected

    if (controller.userData.selected !== undefined) return;

    var line = controller.getObjectByName('line');
    var intersections = getIntersections(controller);

    if (intersections.length > 0) {

        var intersection = intersections[0];

        var object = intersection.object;
        object.material.emissive.r = 1;
        intersected.push(object);

        line.scale.z = intersection.distance;

    } else {

        line.scale.z = 5;

    }

}

function cleanIntersected() {

    while (intersected.length) {

        var object = intersected.pop();
        object.material.emissive.r = 0;

    }

}

/**
 * start the whole program
 */
function programStart() {

    initRenderer();
    initCamera();
    initScene();
    initLight();
    initContent();

    $("#next-btn").click(function () {
        if (task == 1)
            task1_index += 1;
        else if (task == 2)
            task2_index += 1;
        for (var i = group.children.length - 1; i >= 0; i--) {
            group.remove(group.children[i]);
        }
        initContent();
    });
    $("#comp-btn").click(function () {
        task = 1;
        for (var i = group.children.length - 1; i >= 0; i--) {
            group.remove(group.children[i]);
        }
        initContent();
    });
    $("#front-btn").click(function () {
        task = 2;
        for (var i = group.children.length - 1; i >= 0; i--) {
            group.remove(group.children[i]);
        }
        initContent();
    });

}

/**
 * animate and render the scene
 * rendering data
 */
function animate() {

    // cleanIntersected();
    // intersectObjects(controller1);
    // intersectObjects(controller2);
    renderer.render(scene, camera);

}

