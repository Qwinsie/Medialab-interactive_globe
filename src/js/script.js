import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";

let THREEx
let isRotating = true;
let pauseStatus = false;
const scene = new THREE.Scene();

let rotationSpeed = 5
let direction = 1;

let counterClockwise = document.getElementById('counterClockwise');
let pause = document.getElementById('pause');
let clockwise = document.getElementById('clockwise');

THREEx = THREEx || {}
THREEx.Planets	= {}

THREEx.Planets.createEarth	= function() {
    let geometry    = new THREE.SphereGeometry(1, 36, 18),
        loader      = new THREE.TextureLoader(),
        material    = new THREE.MeshBasicMaterial({});

    function setTexture(tx) {
        //material.wireframe = true;
        material.map = tx;
        material.map.minFilter = THREE.LinearFilter;
        material.needsUpdate = true;
    }

    setTexture(loader.load('assets/globe.png'));

    let mesh = new THREE.Mesh(geometry, material)
    return mesh;
}

let renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });;
document.body.appendChild( renderer.domElement );

let onRenderFcts= [];
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

camera.position.set(6, 1, -.2);

function resize() {
    let aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.fov = 45/((aspect+1)/2);
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth,innerHeight)
}
window.addEventListener('resize', resize, false);
resize();

var ambientLight = new THREE.AmbientLight( 0xF8F8F8, 1,100 );
scene.add( ambientLight );

let earthMesh = THREEx.Planets.createEarth()
scene.add(earthMesh)

onRenderFcts.push(function(delta, now){
    if(isRotating) {
        earthMesh.rotateY((rotationSpeed * direction) / 32 * delta)
    }
})

let controls = new OrbitControls( camera,renderer.domElement );
function initControls() {
    //*
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.enablePan = false;
    let rotateSpeed = .08,
        zoomSpeed = .2;

    function usesMouse(e) {

        if(!e.targetTouches) {
            console.log('Mouse detected!');
            rotateSpeed = .2;
            zoomSpeed = 1;
        }

        window.removeEventListener('touchstart', usesMouse, true);
        window.removeEventListener('mousedown', usesMouse, true);
        window.removeEventListener('wheel', usesMouse, true);
    }

    window.addEventListener('touchstart', usesMouse, true);
    window.addEventListener('mousedown', usesMouse, true);
    window.addEventListener('wheel', usesMouse, true);

    window.addEventListener('dblclick', function(e) {

    }, true);

    window.addEventListener('pointerdown', function(e) {
        if(e.target.tagName.toLowerCase() === 'canvas'){
            isRotating = false
        }
    }, true);

    window.addEventListener('pointerup', function(e) {

        if(!pauseStatus){
            if(e.target.tagName.toLowerCase() === 'canvas'){
                isRotating = true
            }
        }

    }, true);

    onRenderFcts.push(function(delta) {
        let dist = camera.position.length();

        //More consistent UX at different zoom levels:
        controls.rotateSpeed = rotateSpeed * dist * dist;
        controls.zoomSpeed = zoomSpeed * dist;
        controls.update(delta);
    });

}

initControls();

onRenderFcts.push(function(){
    renderer.render( scene, camera );
})

let lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
    let deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec	= nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
    });
});

//---------------------------------------------

function getLocation() {
    console.log('getting location')
    if (navigator.geolocation) {
        console.log('location is obtainable')
        return navigator.geolocation.getCurrentPosition(usePosition);

    } else {
       //something if geolocation is not supported

    }
}

function usePosition(position){

    let spriteMap = new THREE.TextureLoader().load( "assets/among_us.png" );
    let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    let sprite = new THREE.Sprite( spriteMaterial );

    let location = latLongToVector3(position.coords.latitude,position.coords.longitude,1,0.02)
    sprite.position.set(location['x'],location['y'],location['z'])

    sprite.addEventListener('click',function (){console.log('hello')})
    sprite.scale.set(0.1, 0.1, 1)
    earthMesh.add( sprite );
}

function latLongToVector3(lat, lon, radius, heigth) {
    var phi = (lat)*Math.PI/180;
    var theta = (lon-180)*Math.PI/180;

    var x = -(radius+heigth) * Math.cos(phi) * Math.cos(theta);
    var y = (radius+heigth) * Math.sin(phi);
    var z = (radius+heigth) * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x,y,z);
}

getLocation()

pause.addEventListener('click',function (event) {

    let pauseIcon = pause.getElementsByClassName('fa')[0]

    if(pauseStatus){
        pauseStatus = false
        pauseIcon.classList.remove('fa-play')
        pauseIcon.classList.add('fa-pause')
    }else{
        pauseStatus = true
        pauseIcon.classList.add('fa-play')
        pauseIcon.classList.remove('fa-pause')
    }

    if(isRotating) {
        isRotating = false
    }else{
        isRotating = true
    }

})

clockwise.addEventListener('click',function (){
    direction = 1;
})

counterClockwise.addEventListener('click',function (){
    direction = -1;
})

function addModel() {

    //let texture = new THREE.TextureLoader();
    let texture = new THREE.TextureLoader().load( 'assets/liberty.png' );
    texture.flipY = false;
    texture.encoding = THREE.sRGBEncoding;

    console.log(texture)

    const loader = new GLTFLoader();
    loader.load( 'assets/models/untitled.glb', function ( gltf ) {

        var model = gltf.scene;

        model.position.set(0.6286700768275177, 0.8019206556034664, -0.04579515933141644)
        model.scale.set(0.1, 0.1, 0.1)

        model.traverse ( ( o ) => {
            if ( o.isMesh ) {
                // note: for a multi-material mesh, `o.material` may be an array,
                // in which case you'd need to set `.map` on each value.
                console.log(o.material)
                o.material.map = texture;
            }
        } );

        earthMesh.add( model );

    }, undefined, function ( error ) {

        console.error( error );

    } );

}

addModel();

