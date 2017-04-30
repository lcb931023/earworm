global.THREE = require('three');
var createOrbitViewer = require('three-orbit-viewer')(THREE)
// single-mesh worm
var Worm = require('./lib/worm');
// multi-mesh worm for debugging purpose that likely will make into final build
// var LongWorm = require('./lib/longWorm');
var flockerTweaker = require('./lib/flockerTweaker');
var randomColor = require('randomcolor');

const BOUND_SIZE = 50;

var app = createOrbitViewer({
    clearColor: 0x000000,
    clearAlpha: 1,
    fov: 65,
    position: new THREE.Vector3(1, 1, 70),
    contextAttributes: {
      preserveDrawingBuffer: true,
    }
})
// app.renderer.autoClear = false;
setTimeout(()=>{app.renderer.autoClearColor = false;}, 100);
// app.renderer.autoClearDepth = false;
// app.renderer.autoClearStencil = false;

var arrWorm = [];
// TODO get this from recording
var audioBuffer = [];
for (var i = 0; i < 3; i++) {
  var worm = new Worm(
    audioBuffer, 
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE,
  );
  worm.scale.set(0.5,0.5,0.5);
  worm.setColor(randomColor({luminosity: 'bright'}));
  app.scene.add(worm);
  arrWorm.push(worm);
}

app.scene.add(new THREE.Mesh(
  new THREE.BoxGeometry(BOUND_SIZE, BOUND_SIZE, BOUND_SIZE),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })
));

app.on('tick', function(dt) {
    //.. handle pre-render updates    
    arrWorm.forEach((worm)=>{
      // TODO move these into worm class's update
      worm.wander();
      worm.bounce(BOUND_SIZE, BOUND_SIZE, BOUND_SIZE);
      worm.update();
    });
})

document.addEventListener('mousedown', (e) => {
  app.renderer.autoClearColor = true;
});
document.addEventListener('mouseup', (e) => {
  app.renderer.autoClearColor = false;
});
