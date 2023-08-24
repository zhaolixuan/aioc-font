/* eslint-disable prettier/prettier */
import * as THREE from 'three'
import { getLinePosition, _getLinePosition } from '../js/geoutil'
import * as maptalks from 'maptalks'
import { MeshLine } from '../js/THREE.MeshLine'
import { BaseObject } from 'maptalks.three/dist/maptalks.three.js' //必须按这种方式import

var OPTIONS = {
  altitude: 0,
  speed: 0.01,
}
class SpriteLine extends BaseObject {
  constructor(lineString, options, material, layer) {
    super()
    options.offset = material.uniforms.offset.value
    options.clock = new THREE.Clock()
    //geoutil.js getLinePosition
    const { positions } = getLinePosition(lineString, layer)
    const positions1 = _getLinePosition(lineString, layer).positions

    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      lineString,
      positions: positions1,
    })
    this._initOptions(options)

    const geometry = new THREE.Geometry()
    for (let i = 0; i < positions.length; i += 3) {
      geometry.vertices.push(
        new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      )
    }
    const meshLine = new MeshLine()
    meshLine.setGeometry(geometry)

    const map = layer.getMap()
    const size = map.getSize()
    const width = size.width
    const height = size.height
    material.uniforms.resolution.value.set(width, height)

    const line = new THREE.Mesh(meshLine.geometry, material)
    this._createGroup()
    this.getObject3d().add(line)
    const { altitude } = options
    const z = layer.distanceToVector3(altitude, altitude).x
    const center = lineString.getCenter()
    const v = layer.coordinateToVector3(center, z)
    this.getObject3d().position.copy(v)
  }
  _animation() {
    this.options.offset.x -= this.options.speed * this.options.clock.getDelta()
  }
}
export default SpriteLine
