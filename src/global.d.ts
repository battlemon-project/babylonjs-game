import { Scene } from '@babylonjs/core'

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.gltf'
declare module '*.glb'

declare global {
  var scene: Scene;
}