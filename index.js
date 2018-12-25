global.THREE = require('three');
const TWEEN = require('tween.js');
const createOrbitViewer = require('three-orbit-viewer')(THREE)
const randomColor = require('randomcolor');
const Recorder = require('./lib/recorder');
const LongWorm = require('./lib/longWorm');

const BOUND_MIN = 10;
const BOUND_MAX = 50;
let boundSize = BOUND_MIN;
const WORM_SCALE = 0.5;
const RECORDING_DURATION = 1;
const INTIMATE_DIST = 10;

var arrWorm = [];

/* UI */
const btnStart = document.querySelector('.btn-start');
const elLanding = document.querySelector('.landing');
btnStart.addEventListener('click', ()=>{
  Recorder.resumeAudioContext()
  elLanding.classList.add('hide');
});

const btnRecord = document.querySelector('.btn-record');
const btnRecordText = btnRecord.innerText;
const recorder = new Recorder(RECORDING_DURATION, onRecordEnd);
function onRecordEnd(rec) {
  // Expand bound to give worm free space
  boundSize = BOUND_MIN + (arrWorm.length + 1) / BOUND_MAX * (BOUND_MAX - BOUND_MIN);
  if (boundSize > BOUND_MAX) boundSize = BOUND_MAX;
  // Generate a worm that keeps track of the recording
  var worm = new LongWorm(
    rec.exportBuffer(),
    RECORDING_DURATION,
    (Math.random() - .5) * boundSize, 
    (Math.random() - .5) * boundSize, 
    (Math.random() - .5) * boundSize,
  );
  worm.scale.set(WORM_SCALE, WORM_SCALE, WORM_SCALE);
  worm.setColor(randomColor({luminosity: 'dark'}));
  app.scene.add(worm);
  arrWorm.push(worm);
  
  btnRecord.innerText = btnRecordText;
};
btnRecord.addEventListener('click', (e) => {
  if(recorder.isRecording === false) {
    recorder.start();
    btnRecord.innerText = `recording ${RECORDING_DURATION} seconds of audio...`;
  } else {
    recorder.stop();
  }
});

/* Scene */
var app = createOrbitViewer({
  clearColor: 0x000000,
  clearAlpha: 1,
  fov: 65,
  position: new THREE.Vector3(0, 0, 50), // camera
})

app.on('tick', function(dt) {
  //.. handle pre-render updates    
  TWEEN.update();
  arrWorm.forEach((worm)=>{
    // TODO move these into worm class's update
    worm.wander();
    worm.bounce(boundSize);
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
