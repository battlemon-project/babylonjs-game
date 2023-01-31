import { SceneLoader, ActionManager, ExecuteCodeAction, Vector3, TransformNode, AnimationGroup, Animation, AssetContainer } from "@babylonjs/core"

interface PlatformType {
  destroy: () => void;
}

export const Platforms = async (): Promise<PlatformType> => {
  const scene = globalThis.scene
  const canvas = document.getElementById('canvas')!
  await SceneLoader.ImportMeshAsync(
    "","/resources/graphics/hub/", 'BTLMN_LemonPlatforms.glb', scene
  )

  const direction = [
    {forward: 3, backward: 2},
    {forward: 1, backward: 3},
    {forward: 2, backward: 1}
  ];

  let originalRotationAngle = 0;

  const Camera = scene.getCameraByName('Camera')
  if (Camera) {
    scene.activeCamera = Camera
  }

  ['ring', 'operator', 'target', 'showPos_feature', 'showPos_outfit'].forEach(name => {
    const mesh = scene.getMeshByName(name)
    if (mesh) mesh.visibility = 0;
  })

  const lookatObjects: string[] = ["LemonPos_1", "LemonPos_2", "LemonPos_3"];
  const lemonPositions: TransformNode[] = lookatObjects.map(pos => {
    return scene.getNodeByName(pos) as TransformNode
  })

  lemonPositions.forEach((position, index) => {
    position.rotate(new Vector3(0,1,0), Math.PI) // This is becouse new lemon rotated by default  
    const plus = scene.getMeshByName(`Plus_${index + 1}`)
    const plusStroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`)
    if (plus) {
      plus.rotation = position.rotation;
    }
    if (plusStroke) {
      plusStroke.rotation = position.rotation;
      plusStroke.visibility = 0;
    }
    position.rotate(new Vector3(0,1,0), (Math.PI + Math.PI/3)*index)
  });

  const objects: string[] = ["Plus_Back", "Plus_Cap", "Plus_Cloth", "Plus_Face", "Plus_Back_Stroke", "Plus_Cap_Stroke", "Plus_Cloth_Stroke", "Plus_Face_Stroke", "Line_Back_1", "Line_Back_2", "Line_Cap_1", "Line_Cap_2", "Line_Cloth_1", "Line_Cloth_2", "Line_Face_1", "Line_Face_2", "Point_Back", "Point_Cap", "Point_Cloth", "Point_Face", "Background_Sphere"];

  const unusedObjects: string[] = ["Point_Weapon", "Plus_Weapon", "Plus_Weapon_Stroke", "Line_Weapon_1", "Line_Weapon_2"];

  [...objects, ...unusedObjects].forEach(name => {
    const object = scene.getMeshByName(name);
    if (!object) return;
    object.visibility = 0;
    object.checkCollisions = false;
    object.isPickable = false;
  });



  ["collider1", "collider2", "collider3"].forEach((name, index) => {
    const collider = scene.getMeshByName(name);
    if (!collider) return;
    collider.actionManager = new ActionManager(scene);
    collider.visibility = 0;

    const stroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`)	
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, async function(){
      if (stroke) stroke.visibility = 1;
      scene.hoverCursor = "pointer";
    }));
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, async function(){
      if (stroke) stroke.visibility = 0;
      scene.hoverCursor = "default";
    }));
    
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, async function(){
      alert(1)
    }))
    
  });

  const currentPosition = { x: 0, y: 0 };
  let clicked = false;

  function pointerDown(evt: MouseEvent) {
    currentPosition.x = evt.clientX;
    clicked = true;
  }
  
  function pointerUp() {
    clicked = false;
  }

  function pointerMove(evt: MouseEvent) {
    if (!clicked) {
      return;
    }
    
    const dx = evt.clientX - currentPosition.x;
    const angleY = dx * 0.01;
    //lemonPositions[activePlatform - 1].rotate(new Vector3(0,1,0), angleY);
    originalRotationAngle -= angleY;
    console.log(originalRotationAngle)
    currentPosition.x = evt.clientX;
  }
  
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointermove", pointerMove);

  return {
    destroy: () => {
      canvas.removeEventListener("pointerdown", pointerDown, false);
      canvas.removeEventListener("pointerup", pointerUp, false);
      canvas.removeEventListener("pointermove", pointerMove, false);
    }
  }
}