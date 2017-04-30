global.THREE = require('three');
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var Worm = require('./lib/worm');
var flockerTweaker = require('./lib/flockerTweaker');
var randomColor = require('randomcolor');

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
app.renderer.autoClearColor = false;
// app.renderer.autoClearDepth = false;
// app.renderer.autoClearStencil = false;

var arrWorm = [];
// TODO get this from recording
var audioBuffer = [];
for (var i = 0; i < 50; i++) {
  var worm = new Worm(audioBuffer, 1, 1, 1);
  worm.scale.set(0.2,0.2,0.2);
  app.scene.add(worm);
  arrWorm.push(worm);
}

const boundSize = 50;

app.on('tick', function(dt) {
    //.. handle pre-render updates    
    arrWorm.forEach((worm)=>{
      // TODO move these into worm class's update
      worm.wander();
      worm.bounce(boundSize, boundSize, boundSize);
      worm.update();
    });
})

// just for fun YAY
setInterval(() => {
  // var randomI = Math.floor( Math.random() * arrWorm.length );
  // arrWorm[ randomI ].setColor(randomColor());
  arrWorm.forEach((worm)=>{
    // worm.setColor(randomColor({hue: 'monochrome', luminosity: 'light'}));
    worm.setColor(0x000000);
  });
}, 500);
