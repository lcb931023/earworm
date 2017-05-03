global.THREE = require('three');
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var randomColor = require('randomcolor');
var Recorder = require('./lib/recorder');
var LongWorm = require('./lib/longWorm');

let BOUND_SIZE = 20;
const WORM_SCALE = 0.5;
const RECORDING_DURATION = 1;
const INTIMATE_DIST = 10;

var arrWorm = [];

/* UI */
var btnStart = document.querySelector('.btn-start');
var elLanding = document.querySelector('.landing');
btnStart.addEventListener('click', ()=>{
  elLanding.classList.add('hide');
});

var btnRecord = document.querySelector('.btn-record');
var recorder = new Recorder(RECORDING_DURATION, onRecordEnd);
function onRecordEnd(rec) {
  // Generate a worm that keeps track of the recording
  var worm = new LongWorm(
    rec.exportBuffer(),
    RECORDING_DURATION,
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE, 
    (Math.random() - .5) * BOUND_SIZE,
  );
  worm.scale.set(WORM_SCALE, WORM_SCALE, WORM_SCALE);
  worm.setColor(randomColor({luminosity: 'light'}));
  app.scene.add(worm);
  arrWorm.push(worm);
  
  btnRecord.innerText = `done!`;
  setTimeout(()=>{ btnRecord.innerText = 'record' }, 500);
};
btnRecord.addEventListener('click', (e) => {
  if(recorder.isRecording === false) {
    recorder.start();
    btnRecord.innerText = `recording audio that is ${RECORDING_DURATION} seconds long...`;
  } else {
    recorder.stop();
  }
});

/* Scene */
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

app.on('tick', function(dt) {
  //.. handle pre-render updates    
  arrWorm.forEach((worm)=>{
    // TODO move these into worm class's update
    worm.wander();
    worm.bounce(BOUND_SIZE);
    worm.update();
  });
})

setInterval(detectIntimacy, 200);
/**
* NOTE crude detection of intimacy
* @param bI: base worm's index
* @param tI: target worm's index
* O( (n-1)*n/2 ), where n is arrWorm.length
*/
function detectIntimacy() {
  for (let bI = 0; bI < arrWorm.length - 1; bI++) {
    for (let tI = bI + 1; tI < arrWorm.length; tI++) {
      var dist = arrWorm[bI].distanceTo(arrWorm[tI]);
      if (dist < INTIMATE_DIST) {
        arrWorm[bI].play();
        arrWorm[tI].play(); // TODO play with delaying this worm
      }
    }
  }
}
