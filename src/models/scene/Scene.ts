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

export default class Scene {
    scene: BabylonScene
    engine: Engine
    resourcesPath: string
    filePath: string
    store: any

    constructor (engine: Engine) {
        this.scene = new BabylonScene(engine)
        globalThis.scene = this.scene
        this.store = store
        this.engine = engine
        this.resourcesPath = 'resources/graphics/level_' + this.store.state.level.levelId + '/'
        this.filePath = 'map.babylon' + '?time=' + Date.now()
    }

    load (callbackLoad: () => void) {
      window.addEventListener('resize', () => {
        this.engine.resize()
      })

      SceneLoader.CleanBoneMatrixWeights = true
      SceneLoader.ShowLoadingScreen = false

      SceneLoader.Append(this.resourcesPath, this.filePath, this.scene, (scene) => {
        try {
          callbackLoad()
        } catch (e) {
          console.error(e)
        }

        this.optimize(scene)
        
        this.engine.runRenderLoop(() => {
          this.scene.render()
        })
        
      }, null, (scene, message, error) => {
        console.log(error, message)
      })
    }

    private optimize (scene: BabylonScene) {
      scene.autoClearDepthAndStencil = false

      const meshNotAnimate = scene.getMeshesByTags('notAnimate')

      meshNotAnimate.forEach(mesh => {
        mesh.freezeWorldMatrix()
        mesh.doNotSyncBoundingInfo = true
        mesh.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
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
