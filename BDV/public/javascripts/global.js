/*
 * @Author: Rui Li
 * @Date: 2020-04-27 16:19:23
 * @LastEditTime: 2020-04-27 17:59:37
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
var objectCenter;

// var polyfill = new WebVRPolyfill();

import { VRButton } from '/public/lib/VRButton.js';

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
        antialias: false,
        stencil: false,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x52576e, 1.0); //Sets the clear color and opacity
    //renderer.vr.enabled = true;
    // init container that used to install the render the scene
    container = document.createElement('div');
    
    document.body.appendChild(container);
    document.body.appendChild(VRButton.createButton(renderer));
    container.appendChild(renderer.domElement);


    renderer.xr.enabled = true;

}

/**
 * initiate the camera
 */
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // camera.position.x = 0;
    // camera.position.y = 0;
    camera.position.z = 200;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(-10, -10, 0);
}

/**
 * initiate the scene
 */
function initScene() {
    scene = new THREE.Scene();
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
}


/**
 * initiate the light
 */
function initLight() {

    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
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
    await loadBrain();
    scene.add(g_dataObj);
    controls.target = objectCenter;
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

}


function update() {

    //stats.update();
    controls.update();

}

/**
 * animate and render the scene
 * rendering data
 */
function animate() {

    //vr
    // renderer.setAnimationLoop( function () {
    //     animate();
    // });

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();

}




function loadBrain() {
    return new Promise(function (resolve, reject) {
        var loader = new THREE.OBJLoader();
        loader.setPath('public/data/');
        loader.load('neuron2.obj', function(object){

            var objBbox = new THREE.Box3().setFromObject(object);
            objectCenter = objBbox.getCenter();
            // // Geometry vertices centering to world axis
            // var bboxCenter = objBbox.getCenter().clone();
            // bboxCenter.multiplyScalar(-1);
            
            // object.traverse(function (child) {
            //     if (child instanceof THREE.Mesh) {
            //         child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
            //     }
            // });

            // objBbox.setFromObject(object); // Update the bounding box
            g_dataObj = object;
            
            resolve(object);
        })
    })
}


//Apply VR stereo rendering to renderer.
function initVREffect(){
    var effect = new THREE.VREffect(renderer);
    effect.setSize(canvas.clientWidth, canvas.clientHeight, false);
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
    initControls();
    animate();
    

}