const boids = require('./boids');
const MAX_FORCE = .1;
const MAX_SPEED = 0.2;
const WANDER_SPEED = 0.1;
const WANDER_RANGE = 30;
const WANDER_RADIUS = 1;

const SEGMENTS = 10;

class Worm {
  constructor(audioBuffer, x, y, z) {
    
    this.arrSeg = [];
    for (var i = 0; i < SEGMENTS; i++) {
      var geo = new THREE.SphereGeometry(1, 1, 1);
      var mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 });
      var seg = new THREE.Mesh(geo, mat);
      seg.position.set(x, y, z);
      this.arrSeg.push(seg);
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
  bounce(w, h, d) {
    this.behavior.bounce(w, h, d);
  }
  update(){
    this.behavior.update();
    this.position.set(
      this.behavior.position.x, 
      this.behavior.position.y, 
      this.behavior.position.z, 
    );
  }
  setColor(hex, mix=1) {
    this.material.color.lerp(new THREE.Color(hex), mix);
  }
}

module.exports = Worm;
