/**
* @Description: global logic of the program, init, load, and render.
* @Author: Rui Li
* @Date: 2019-07-27
*/

var renderer;
var camera;
var scene;
var controls;  //trackball
var stats;   //fps monitor
var container;  //canvas for presenting the scene
var height;
var width;
var g_dataObj = new Object();  //gloal dataset object


/**
 * init threejs env
 */
function initRenderer(){

    width = window.innerWidth;
    height = window.innerHeight;
    // init renderer
    renderer = new THREE.WebGLRenderer({
        antialias : false,
        stencil : false,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
    renderer.setClearColor(0x52576e, 1.0); //Sets the clear color and opacity
    //renderer.vr.enabled = true;
    // init container that used to install the render the scene
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    document.body.appendChild( THREE.WEBVR.createButton( renderer ) );
    container.appendChild( renderer.domElement );

}

/**
 * initiate the camera
 */
function initCamera(){
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    // camera.position.x = 0;
    // camera.position.y = 0;
    camera.position.z = 500;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(0, 0, 0);
}

/**
 * initiate the scene
 */
function initScene(){
    scene = new THREE.Scene();
    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
}

/**
 * initiate the light
 */
function initLight(){

    //ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    var PointLight = new THREE.DirectionalLight( 0xffffff, 0.8);
    PointLight.position.set( 20, 20, 30 );
    scene.add( PointLight );


}

/**
 * initiate controls
 */
function initControls(){

    controls = new THREE.TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 2;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

}

/**
 * init the stats plugin, monitor the fps
 * @returns {{REVISION, domElement, dom, showPanel, setMode, addPanel, update, end, begin}}
 */
function initStats() {

    stats = new Stats();
    container.appendChild( stats.dom );

}


/**
 * update operation such as stats and controls
 */
function update() {

    stats.update();
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


/**
 * load content, vis pipeline
 * 1. load data
 * 2. pre-processing data
 * 3. data mapping
 * @returns {Promise<void>}
 */
async function initContent () {
    dataRange = Array.from(Array(1).keys())
    await readVTKFile('public/data/dataset1/', dataRange);  //load dataset
    await dataMergingByLayer();   //merge dataset
    await sv_Len_ColMappingV3();  //data mapping
}

/**
 * begin the program
 */
function threeStart(){

    initRenderer();
    initCamera();
    initScene();
    initLight();
    initContent();
    initControls();
    initStats();
    animate();

}





