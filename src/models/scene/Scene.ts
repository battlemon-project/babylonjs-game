import {
  Scene as BabylonScene, Engine,
  SceneLoader,
  SceneOptimizerOptions,
  SceneOptimizer,
  AbstractMesh
} from '@babylonjs/core'

import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'
import store from "@/store";
import Environment from '@/models/scene/Environment'
import { Helpers } from '@/models/Helpers'

export default class Scene {
    scene: BabylonScene
    engine: Engine
    store: any

    constructor (engine: Engine) {
        this.scene = new BabylonScene(engine)
        globalThis.scene = this.scene
        this.store = store
        this.engine = engine
    }

    async load (callbackLoad: () => void) {
      window.addEventListener('resize', () => {
        this.engine.resize()
      })
  
      SceneLoader.CleanBoneMatrixWeights = true
      SceneLoader.ShowLoadingScreen = false
  
      const fileName = 'map.babylon'
      const filePath = process.env.VUE_APP_RESOURCES_PATH + 'graphics/level_' + this.store.state.level.levelId + '/'
      
      const timestamp = await Helpers.getFileTimestamp(filePath  + fileName)
      const filePathWithTimestamp = fileName + '?timestamp=' + timestamp
  
      SceneLoader.Append(filePath, filePathWithTimestamp, this.scene, (scene) => {
        try {
          callbackLoad()
        } catch (e) {
          console.error(e)
        }
    
        this.engine.runRenderLoop(() => {
          this.scene.render()
        })
    
      }, null, (scene, message, error) => {
        console.log(error, message)
      })
    }

    static optimize () {
      const scene = globalThis.scene
      scene.autoClearDepthAndStencil = false
      scene.disablePhysicsEngine()

      const meshNotAnimate = scene.getMeshesByTags('not_animate')
  
      scene.skipPointerMovePicking = true

      meshNotAnimate.forEach(mesh => {
        mesh.freezeWorldMatrix()
        mesh.doNotSyncBoundingInfo = true
        mesh.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
  
        mesh.material?.freeze()
      })

      const options = new SceneOptimizerOptions(60, 1000)
      const optimizer = new SceneOptimizer(scene, options)
      optimizer.start()
    }
    
    setEnvironment()
    {
      const environment = new Environment()
      environment.setupHDR()
      environment.setupGlow()
      environment.setupLightAndShadow()
    }
}
