const Tone = require('tone');
const boids = require('./boids');
const MAX_FORCE = .08;
const MAX_SPEED = 0.5;
const WANDER_SPEED = 0.2;
const WANDER_RANGE = 300;
const WANDER_RADIUS = 50;

const SEGMENTS = 30;

class LongWorm extends THREE.Group {
  constructor(audioBuffer, duration, x, y, z) {
    if (!audioBuffer) {
      throw new Error('audioBuffer is undefined');
    }
    super();
    this.audioBuffer = audioBuffer;
    this.duration = duration;
    this.arrSeg = [];
    for (var i = 0; i < SEGMENTS; i++) {
      var geo = new THREE.SphereGeometry(1, 1, 1);
      var mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 });
      var seg = new THREE.Mesh(geo, mat);
      seg.position.set(x, y, z);
      this.arrSeg.push(seg);
      this.add(seg);
    }

    var behavior = new boids.SteeredVehicle(x, y, z);
    behavior.velocity.x = (Math.random() - .5) * WANDER_SPEED;
    behavior.velocity.y = (Math.random() - .5) * WANDER_SPEED;
    behavior.velocity.z = (Math.random() - .5) * WANDER_SPEED;
    behavior.maxForce = MAX_FORCE;
    behavior.maxSpeed = MAX_SPEED;
    behavior.wanderRange = WANDER_RANGE;
    behavior.wanderRadius = WANDER_RADIUS;
    this.behavior = behavior;
  }
  wander() {
    this.behavior.wander();
  }
  bounce(boundSize) {
    this.behavior.bounce(
      boundSize / this.scale.x,
      boundSize / this.scale.y,
      boundSize / this.scale.z,
    );
  }
  update(){
    // update each segment with pos of prev segment,
    // starting from the end
    for (var i = this.arrSeg.length - 1; i > 0; i -= 1) {
      this.arrSeg[i].position.copy(this.arrSeg[i-1].position);
    }
    // update first with new boid pos
    this.behavior.update();
    this.arrSeg[0].position.copy(this.behavior.position);
  }
  setColor(hex, mix=1) {
    this.arrSeg.forEach((seg)=>{
      seg.material.color.lerp(new THREE.Color(hex), mix);
    });
  }
  distanceTo(worm) {
    return this.arrSeg[0].position.distanceTo( worm.arrSeg[0].position );
  }
  play() {
    if (!this.audioBuffer.length) throw new Error('audioBuffer is empty for this worm!');
    if (this.isPlaying) return; // prevent from triggering again before finished
    this.isPlaying = true;
    setTimeout(()=>{
      this.isPlaying = false;
    }, this.duration * 1000);
    const source = Tone.context.createBufferSource();
    source.connect(Tone.context.destination);
    source.buffer = this.audioBuffer;
    source.start();
  }
}

module.exports = LongWorm;
