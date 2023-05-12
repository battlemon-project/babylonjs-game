import { Scene } from '@babylonjs/core'
import { Container } from '@/models/scene/ContainerManager'
import Collisions from '@/models/mehanics/Collisions'

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.gltf'
declare module '*.glb'

declare global {
  var scene: Scene;
  var assetContainers: Array<Container>;
  var assetOriginContainers: Array<Container>;
  var collisions: Collisions;
}