const boids = require('./boids');
const MAX_FORCE = .08;
const MAX_SPEED = 0.5;
const WANDER_SPEED = 0.2;
const WANDER_RANGE = 300;
const WANDER_RADIUS = 50;

class Worm extends THREE.Mesh {
  constructor(audioBuffer, x, y, z) {
    // TODO make a proper worm shape
    var geo = new THREE.SphereGeometry(1, 8, 8);
    var mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 });
    super(geo, mat);
    this.position.set(x, y, z);
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
    this.position.copy(this.behavior.position);
  }
  setColor(hex, mix=1) {
    this.material.color.lerp(new THREE.Color(hex), mix);
  }
}

module.exports = Worm;
