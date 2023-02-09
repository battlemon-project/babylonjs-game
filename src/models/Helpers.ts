import {
  Mesh,
  Scene,
  Camera,
  Engine,
  Vector3,
  Matrix,
  AbstractMesh,
  RollingAverage, MeshBuilder, StandardMaterial, Color3,
} from '@babylonjs/core'


export const Helpers = {
  getRandomInt (min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  get2DCoordinatesFromMesh (mesh: Mesh, camera: Camera, scene: Scene, engine: Engine) {
    const pos = Vector3.Project(
      mesh.getAbsolutePosition(),
      Matrix.IdentityReadOnly,
      scene.getTransformMatrix(),
      camera.viewport.toGlobal(
        engine.getRenderWidth(),
        engine.getRenderHeight(),
      ),
    )

    return {
      top: pos.y,
      left: pos.x
    }
  },

  getIsSuffix (mesh: AbstractMesh, suffix: string) {
    const nameArray = mesh.id.split('_')

    if (nameArray.length) {
      if (nameArray.find(item => item === suffix)) {
        return true
      }
    }

    return false
  },

  IsName (nameForCheck: string, name: string, partly = false) {
    if (nameForCheck === name) {
      return true
    }

    if (partly) {
      const nameArray = nameForCheck.split('_')
      if (nameArray.length) {
        if (nameArray[0] === name) {
          return true
        }
      }
    }


    const nameArrayPoint = nameForCheck.split('.')
    if (nameArrayPoint.length) {
      if (nameArrayPoint[0] === name) {
        return true
      }
    }

    return false
  },

  getMeshesByName (name: string, partly = false) {
    return globalThis.scene.meshes.filter(mesh => Helpers.IsName(mesh.name, name, partly)) as Array<Mesh>
  },

  getMeshByName (scene: Scene, name: string, partly = false) {
    return scene.meshes.find(mesh => Helpers.IsName(mesh.name, name, partly)) as Mesh
  },

  getTime () {
    const date = new Date()
    return date.getTime()
  },

  getAverage () {
    const rollingAverage = new RollingAverage(60)
    rollingAverage.add(scene.getAnimationRatio())
    return rollingAverage.average
  },

  numberFixed (number: string | number, length = 10): number {
    return Number(Number(number).toFixed(length))
  },

  getNameId (meshId: string) {
    return meshId.split('.')[1]
  },
  
  drawEllipsoid (mesh: Mesh) {
    const scene = mesh.getScene()
    const ellipsoid = MeshBuilder.CreateSphere('debug', { diameterX: (mesh.ellipsoid.x * 2), diameterY: (mesh.ellipsoid.y * 2), diameterZ: (mesh.ellipsoid.z * 2), segments: 16 }, scene)
    
    scene.onBeforeRenderObservable.add(() => {
      ellipsoid.position.copyFrom(mesh.position)
      ellipsoid.position.addInPlace(mesh.ellipsoidOffset)
    })
    
    const debugmat = new StandardMaterial('debugmat', mesh.getScene())
    debugmat.diffuseColor = new Color3(0, 1, 0)
    debugmat.wireframe = true
    ellipsoid.material = debugmat
  }
}