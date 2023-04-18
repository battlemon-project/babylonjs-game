import { IGLTFLoaderExtension } from '@babylonjs/loaders/glTF'
import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0'
import { Tags, TransformNode } from '@babylonjs/core'

class TagsExtension implements IGLTFLoaderExtension {
  public readonly name = "MyTagsExtension"
  public enabled = true;
  
  constructor(private _loader: GLTFLoader) {}
  
  public loadNodeAsync(context: string, node: any, assign: (babylonMesh: any) => void): Promise<TransformNode> {
    return this._loader.loadNodeAsync(context, node, function (babylonMesh) {
      if (babylonMesh.id == 'BTLMN_Prop_RoadSign_A') {
        console.log(babylonMesh.id, babylonMesh.metadata)
      }
 
      if (node.extras && node.extras.tags) {
        Tags.AddTagsTo(babylonMesh, node.extras.tags);
      }
      assign(babylonMesh);
    });
  }
  
  public dispose(): void {
    // Add code to dispose any resources used by the extension
  }
}

export default function RegisterTagsExtension () {
  GLTFLoader.RegisterExtension("MyTagsExtension", (loader: GLTFLoader) => {
    return new TagsExtension(loader);
  })
}
