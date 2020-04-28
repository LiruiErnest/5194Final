/*
 * @Author: Rui Li
 * @Date: 2020-04-27 20:41:04
 * @LastEditTime: 2020-04-27 20:42:19
 * @Description: 
 * @FilePath: /5194Final/BDV/public/javascripts/global2.js
 */
import { VRButton } from 'https://unpkg.com/three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.115.0/examples/jsm/webxr/XRControllerModelFactory.js'
import { OrbitControls } from 'https://unpkg.com/three@0.115.0/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer;
var controller1, controller2;
var controllerGrip1, controllerGrip2;

var raycaster, intersected = [];
var tempMatrix = new THREE.Matrix4();

var controls, group;

init();
animate();


