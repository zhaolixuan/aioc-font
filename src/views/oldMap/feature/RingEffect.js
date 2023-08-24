import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three/dist/maptalks.three.js"; //必须按这种方式import
/**
 * custom  component
 *
 * you can customize your own components
 * */

//default values
var OPTIONS = {
  speed: 0.005,
  radius: 1,
  altitude: 0,
  interactive: false
};

/**
 * custom  component
 *
 * you can customize your own components
 * */

class RingEffect extends BaseObject {
  constructor(coordinate, options, material, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      coordinate
    });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);
    const { altitude, radius } = options;
    //generate geometry
    const r = layer.distanceToVector3(radius, radius).x;
    const geometry = new THREE.RingBufferGeometry(
      0.001,
      r,
      20,
      5,
      0,
      Math.PI * 2
    );

    //Initialize internal object3d
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L140
    // this._createMesh(geometry, material);
    this._createGroup();
    const mesh = new THREE.Mesh(geometry, material);
    this.getObject3d().add(mesh);
    //set object3d position
    const z = layer.distanceToVector3(altitude, altitude).x;
    const position = layer.coordinateToVector3(coordinate, z);
    this.getObject3d().position.copy(position);
  }

  _animation() {
    const ring = this.getObject3d().children[0];
    const speed = this.getOptions().speed;
    ring.material.uniforms.time.value += speed;
  }
}

export default RingEffect;
