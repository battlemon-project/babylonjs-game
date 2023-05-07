import {
  Mesh,
  Scene,
  Camera,
  Engine,
  Vector3,
  Matrix,
  AbstractMesh,
  RollingAverage, MeshBuilder, StandardMaterial, Color3, Tags,
} from '@babylonjs/core'
import axios from 'axios'

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

  IsName (text: string, find: string, partly = false) {
    if (text === find) {
      return true
    }

    if (partly) {
      return text.search(find) !== -1
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
  },
  isFile(url: string) {
    if (url) {
      const split = url.split('/')
      if (split) {
        const pop = split.pop()
        if (pop) {
          return pop.indexOf('.') > 0
        }
      }
    }
    
    return false
  },
  async getFileTimestamp(filePath: string)
  {
    const arr = filePath.split("/") // [ "", "game", "resources", "graphics", "level_1", "map.babylon" ]
    const filePathLastFolder = arr[arr.length - 2] + "/" + arr[arr.length - 1] // "level_1/map.babylon"
    
    try {
      const response = await axios.get(process.env.VUE_APP_RESOURCES_PATH + 'graphics/manifest.json')
      const manifest = response.data
      return manifest[filePathLastFolder] ?? new Date().getTime()
    } catch (error) {
      console.error('Ошибка получения manifest.json:', error)
      return filePath
    }
  },
  getTagsFromMesh(mesh) {
    const rawTags = Tags.GetTags(mesh)
    if (!rawTags || !rawTags.length) {
      return null
    }
  
    return rawTags.split(' ')
  }
}