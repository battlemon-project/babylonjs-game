import { ParticleSystem, Texture, Vector3, Color4 } from '@babylonjs/core'

export default class Sky {
  constructor () {
    const scene = globalThis.scene
    const particleSystem = new ParticleSystem("particles", 5000, scene);
    particleSystem.particleTexture = new Texture('/resources/graphics/textures/star.png', scene);

    // Where the particles come from
    particleSystem.emitter = Vector3.Zero(); // the starting location

    // Colors of all particles
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.9;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 1000;
    particleSystem.maxLifeTime = 10000;

    // Emission rate
    particleSystem.emitRate = 100;
    particleSystem.preWarmStepOffset = 100;
    particleSystem.preWarmCycles = 1000;

    /******* Emission Space ********/
    const sphereEmitter = particleSystem.createSphereEmitter(120);
    sphereEmitter.radiusRange = 0;

    // Speed
    particleSystem.minEmitPower = 0;
    particleSystem.maxEmitPower = 0;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();
  }
}