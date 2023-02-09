import { Scene } from '@babylonjs/core'
import { Container } from '@/models/scene/ContainerManager'

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.gltf'
declare module '*.glb'

declare global {
  var scene: Scene;
  var assetContainers: Array<Container>;
}