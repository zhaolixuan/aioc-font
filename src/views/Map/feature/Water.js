import * as THREE from 'three'
import WaterMaterial from './water-material'
import earcut from 'earcut'
import * as maptalks from 'maptalks'
import { BaseObject } from 'maptalks.three/dist/maptalks.three.js' //必须按这种方式import
//default values
var OPTIONS = {
  textureWidth: 512,
  textureHeight: 512,
  sunColor: 0xffffff,
  betaVersion: 0,
  waterNormals: null,
  side: THREE.DoubleSide,
  depthTest: true,
  alpha: 0.5,
  waterColor: '#00A8CE',
  noiseScale: 0.1,
  interactive: false,
  altitude: 0,
}

/**
 * custom component
 * */

class Water extends BaseObject {
  constructor(polygon, options, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, polygon })
    if (!options.waterNormals) {
      throw new Error('waterNormals is null')
    }
    super()
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options)

    const waterNormalsTexture = new THREE.TextureLoader().load(
      options.waterNormals
    )
    waterNormalsTexture.wrapS = waterNormalsTexture.wrapT = THREE.RepeatWrapping
    options.waterNormals = waterNormalsTexture

    const water = new WaterMaterial(
      layer.getThreeRenderer(),
      layer.getCamera(),
      layer.getScene(),
      options
    )
    const geometry = getOceanGeometry(polygon, layer)
    this._createMesh(geometry, water.material)

    this.getObject3d().add(water)
    this.water = water
    //set object3d position
    const { altitude } = options
    const z = layer.distanceToVector3(altitude, altitude).x
    const center = polygon.getCenter()
    const v = layer.coordinateToVector3(center, z)
    this.getObject3d().position.copy(v)
  }

  getSymbol() {
    return this.water.material
  }

  setSymbol(material) {
    this.water.material = material
    return this
  }

  _animation() {
    const water = this.water
    water.material.uniforms.time.value += 1.0 / 6.0

    water.render()
  }
}

function getSingleGeometry(polygon, layer, centerPt) {
  //if lnglats
  if (Array.isArray(polygon)) {
    polygon = new maptalks.Polygon(polygon)
  }

  const shell = polygon.getShell()
  const holes = polygon.getHoles()
  const lnglats = shell
  const positions = [],
    holesIndices = [],
    positionsV = []
  lnglats.forEach((lnglat) => {
    const v = layer.coordinateToVector3(lnglat).sub(centerPt)
    positions.push(v.x, v.y, v.z)
    positionsV.push(v)
  })
  if (holes && holes.length > 0) {
    holes.forEach((hole) => {
      holesIndices.push(positionsV.length)
      hole.forEach((lnglat) => {
        const v = layer.coordinateToVector3(lnglat).sub(centerPt)
        positions.push(v.x, v.y, v.z)
        positionsV.push(v)
      })
    })
  }
  const hole = holesIndices.length > 0 ? holesIndices : undefined
  const faces = earcut(positions, hole, 3)
  return {
    positionsV,
    faces,
  }
}

function getOceanGeometry(polygon, layer) {
  const geometry = new THREE.Geometry()
  let positions = [],
    fcs = []
  const centerPt = layer.coordinateToVector3(polygon.getCenter())
  if (polygon instanceof maptalks.Polygon) {
    const { positionsV, faces } = getSingleGeometry(polygon, layer, centerPt)
    positions = positionsV
    fcs = faces
  } else {
    const lnglats = polygon.getCoordinates()
    for (let i = 0, len = lnglats.length; i < len; i++) {
      const { positionsV, faces } = getSingleGeometry(
        lnglats[i],
        layer,
        centerPt
      )
      if (i > 0) {
        const LEN = positions.length
        for (let i = 0, len = faces.length; i < len; i++) {
          faces[i] += LEN
        }
      }
      positionsV.forEach((p) => {
        positions.push(p)
      })
      faces.forEach((f) => {
        fcs.push(f)
      })
    }
  }

  geometry.vertices = positions
  for (let i = 0, len = fcs.length; i < len; i += 3) {
    const face = new THREE.Face3(fcs[i], fcs[i + 1], fcs[i + 2])
    geometry.faces.push(face)
  }
  geometry.computeVertexNormals()
  geometry.computeFaceNormals()
  return geometry
}
export default Water
