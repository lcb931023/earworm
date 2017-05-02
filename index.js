global.THREE = require('three');
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var randomColor = require('randomcolor');
var Recorder = require('./lib/recorder');
// single-mesh worm
var Worm = require('./lib/worm');
// multi-mesh worm for debugging purpose that likely will make into final build
var LongWorm = require('./lib/longWorm');

const BOUND_SIZE = 50;
const WORM_SCALE = 0.5;
const RECORDING_DURATION = 3;

var app = createOrbitViewer({
    clearColor: 0x000000,
    clearAlpha: 1,
    fov: 65,
    position: new THREE.Vector3(0, 0, 70),
})

app.scene.add(new THREE.Mesh(
  new THREE.BoxGeometry(BOUND_SIZE, BOUND_SIZE, BOUND_SIZE),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })
));

var arrWorm = [];

var recorder = new Recorder(RECORDING_DURATION, onRecordEnd);
function onRecordEnd(rec) {
  // Generate a worm that keeps track of the recording
  var worm = new LongWorm(
    rec.exportBuffer(),
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE,
  );
  worm.scale.set(WORM_SCALE, WORM_SCALE, WORM_SCALE);
  worm.setColor(randomColor({luminosity: 'light'}));
  app.scene.add(worm);
  arrWorm.push(worm);
};
document.addEventListener('keydown', (e) => {
  if (e.key !== ' ') return;
  console.log('start recording');
  if(recorder.isRecording === false) {
    recorder.start();
  }
});
document.addEventListener('keyup', (e) => {
  if (e.key !== ' ') return;
  console.log('stop recording');
  if(recorder.isRecording === true) {
    recorder.stop();
  }
});

app.on('tick', function(dt) {
    //.. handle pre-render updates    
    arrWorm.forEach((worm)=>{
      // TODO move these into worm class's update
      worm.wander();
      worm.bounce(BOUND_SIZE * 2, BOUND_SIZE * 2, BOUND_SIZE * 2);
      worm.update();
    });
})
