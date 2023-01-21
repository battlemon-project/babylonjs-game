import {
  CubeTexture,
  GlowLayer,
  Matrix,
  Tools,
  Scene,
  Color3,
  DirectionalLight,
  ShadowGenerator
} from '@babylonjs/core'

export default class Environment {
  shadowGenerator: ShadowGenerator | null
  scene: Scene

  constructor () {
    this.scene = globalThis.scene
    this.shadowGenerator = null
  }

  setupHDR () {
    const url = process.env.VUE_APP_CDN_DOMAIN + '/resources/graphics/textures/environment.env'
    const hdrTexture = CubeTexture.CreateFromPrefilteredData(url, this.scene)
    const hdrRotation = 0
    hdrTexture.setReflectionTextureMatrix(
      Matrix.RotationY(
        Tools.ToRadians(hdrRotation)
      )
    )

    hdrTexture.gammaSpace = false
    this.scene.environmentTexture = hdrTexture
  }

  setupGlow () {
    const gl = new GlowLayer('glow', this.scene, {
      mainTextureFixedSize: 1054,
      blurKernelSize: 70
    })
    
    gl.intensity = 0.4
  }
  
  setupFog () {
    this.scene.fogColor = new Color3(0, 0, 0)
    this.scene.fogDensity = 0.04
    this.scene.fogMode = Scene.FOGMODE_EXP
  }
  
  setupLightAndShadow () {
    const light = this.scene.getLightById('MainDirectionLight') as DirectionalLight
    
    if (!light) {
      console.info('Add a light with the ID MainDirectionLight to display the shadow')
      return
    }
    
    this.shadowGenerator = new ShadowGenerator(2064, light)
  }
}
