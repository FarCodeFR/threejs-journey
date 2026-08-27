import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
const parameters = { form: "vague" };

gui.add(parameters, "form", ["vague", "drap"]).name("Form");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("./textures/particles/star_04.png");

/**
 * Particles
 */

// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500000;

const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 5;
  colors[i] = Math.random();
}

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  alphaMap: particleTexture,
  alphaTest: 0.001,
  //   depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending, // Plusieurs couleurs rendu sympa / baisse de performance
  vertexColors: true,
  transparent: true,
  // Attenuation suivant la distance
  sizeAttenuation: true,
  //   color: "#c2cb47",
});

// Mise à jour
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);

// Mise à jour
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 3;
camera.position.y = 4;
camera.position.x = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  //   particles.rotation.y = elapsedTime * 0.1;
  //   particles.rotation.z = elapsedTime * 0.1;
  for (let i = 0; i < particlesCount; i++) {
    // le 3 = X Y Z
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3 + 0];
    const z = particlesGeometry.attributes.position.array[i3 + 2];

    if (parameters.form === "vague") {
      particlesGeometry.attributes.position.array[i3 + 1] = Math.abs(
        Math.sin(elapsedTime + x + z),
      );
    } else if (parameters.form === "drap") {
      particlesGeometry.attributes.position.array[i3 + 1] =
        Math.sin(elapsedTime + x) * Math.cos(elapsedTime + z);
    }
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
