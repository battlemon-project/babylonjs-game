import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Color4 } from '@babylonjs/core'
import { Platforms } from '@/models/hub/Platforms'
import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'

export default class Hub {
  init () {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const engine = new Engine(canvas, true, {preserveDrawingBuffer: false, stencil: true})
    const scene = new Scene(engine);
    globalThis.scene = scene;
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.1,
      450,
      new Vector3(0,0,0),
      scene
    )
  
    camera.lowerAlphaLimit = camera.alpha;
    camera.upperAlphaLimit = camera.alpha;
    camera.upperBetaLimit = camera.beta;
    camera.lowerBetaLimit = camera.beta;
    camera.wheelPrecision = 0.5;
    camera.lowerRadiusLimit = 2450;
    camera.upperRadiusLimit = 2450;
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 1), scene);
    light.intensity = 1
    scene.clearColor = new Color4(0,0,0,0.001);


    Platforms()

    scene.executeWhenReady(() => {
      //engine.resize();
    });

    engine.runRenderLoop(function () {
      scene.render()
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });
  }
}
