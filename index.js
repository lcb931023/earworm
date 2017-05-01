global.THREE = require('three');
var createOrbitViewer = require('three-orbit-viewer')(THREE)
// single-mesh worm
var Worm = require('./lib/worm');
// multi-mesh worm for debugging purpose that likely will make into final build
var LongWorm = require('./lib/longWorm');
var randomColor = require('randomcolor');

const BOUND_SIZE = 50;

var app = createOrbitViewer({
    clearColor: 0x000000,
    clearAlpha: 1,
    fov: 65,
    position: new THREE.Vector3(0, 0, 70),
    contextAttributes: {
      preserveDrawingBuffer: true,
    },
})
app.renderer.autoClear = false;
setTimeout(()=>{app.renderer.autoClearColor = false;}, 100);
app.renderer.autoClearDepth = false;
app.renderer.autoClearStencil = false;

document.addEventListener('mousedown', (e) => {
  app.renderer.autoClearColor = true;
});
document.addEventListener('mouseup', (e) => {
  app.renderer.autoClearColor = false;
});

var arrWorm = [];
// TODO get this from recording
var audioBuffer = [];
for (var i = 0; i < 2; i++) {
  var worm = new LongWorm(
    audioBuffer, 
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE,
  );
  worm.scale.set(0.5,0.5,0.5);
  worm.setColor(randomColor({hue: 'monochrome', luminosity: 'dark'}));
  app.scene.add(worm);
  arrWorm.push(worm);
}

// TODO remove reference box
// app.scene.add(new THREE.Mesh(
//   new THREE.BoxGeometry(BOUND_SIZE, BOUND_SIZE, BOUND_SIZE),
//   new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })
// ));

let rot = 0;
app.on('tick', function(dt) {
  //.. handle pre-render updates    
  arrWorm.forEach((worm)=>{
    // TODO move these into worm class's update
    worm.wander();
    worm.bounce(BOUND_SIZE * 2, BOUND_SIZE * 2, BOUND_SIZE * 2);
    worm.update();
  });
  
  // slowly move camera around center
  rot += dt / 1000;
  var rotten = new THREE.Vector3(0, 0, 70);
  rotten.applyAxisAngle(
    new THREE.Vector3(0, 1, 0), 
    rot / 2,
  );
  app.camera.position.copy(rotten);
  app.camera.lookAt(new THREE.Vector3());
})
