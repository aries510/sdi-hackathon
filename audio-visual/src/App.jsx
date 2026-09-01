import * as THREE from 'three';

// SCENE SET UP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                  );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x333333);
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(2, 2, 3);
scene.add(pointLight);
// SCENE SET UP


const subwooferGroup = new THREE.Group();
scene.add(subwooferGroup);

const coneGeometry = new THREE.SphereGeometry(
                            1,
                            32,
                            32
);

const coneMaterial = new THREE.MeshStandardMaterial({
                            color: 0x555555,
                            roughness: 0.7,
                            metalness: 0.2,
                            emissive: 0x000000
});

const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.scale.set(0.95, 0.95, 0.95)
coneMesh.position.z = 0.2;
subwooferGroup.add(coneMesh);

const surroundGeometry = new THREE.TorusGeometry(
                                1.6,
                                0.3,
                                16,
                                100
);

const surroundMaterial = new THREE.MeshStandardMaterial({
                                color: 0x555555,
                                roughness: 0.9,
                                metalness: 0.1
})

const surroundMesh = new THREE.Mesh(surroundGeometry, surroundMaterial);
surroundMesh.rotation.x = Math.PI / 2;
surroundMesh.position.z = 0.5;
subwooferGroup.add(surroundMesh);

const frameGeometry = new THREE.CylinderGeometry(
                              1.4,
                              1.4,
                              0.6,
                              32
);

const frameMaterial = new THREE.MeshStandardMaterial({
                              color: 0x777777,
                              roughness: 0.4,
                              metalness: 0.8
});

const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
frameMesh.position.z = 0.35;
subwooferGroup.add(frameMesh);
subwooferGroup.position.set(0, -1.5, 0);
subwooferGroup.rotation.x = Math.PI / 2;

coneMesh.castShadow = true;
surroundMesh.castShadow = true;
frameMesh.castShadow = true;
frameMesh.receiveShadow = true;

const eqGroup = new THREE.Group();
scene.add(eqGroup);

const numberOfBars = 12;
const barSpacing = 0.3;
const barwidth = 0.2;
const barDepth = 0.2;

for(let i = 0; i < numberOfBars; i++) {
  const barGeometry = new THREE.BoxGeometry(
                              barwidth,
                              1,
                              barDepth
  );

  const barMaterial = new THREE.MeshStandardMaterial({
                              color: new THREE.Color(`hsl(${i * (360 / numberOfBars)}, 80%, 50%)`),
                              roughness: 0.4,
                              metalness: 0.6
  });

  const barMesh = new THREE.Mesh(barGeometry, barMaterial);

  const totalWidth = numberOfBars * barSpacing;
  barMesh.position.x = i * barSpacing - totalWidth /2;
  barMesh.position.y = 1.2;
  barMesh.position.z = 0.2;
  barMesh.castShadow = true;
  barMesh.receiveShadow = true;

  eqGroup.add(barMesh)
};

eqGroup.position.set(0, 0, 0);

const tweeterGroup = new THREE.Group();
scene.add(tweeterGroup);

const tweeterRadius = 0.25;
const tweeterSpacing = 1.2;

const tweeterMaterial = new THREE.MeshStandardMaterial({
                                color: 0x999999,
                                roughness: 0.3,
                                metalness: 0.8
});

const leftTweeterGeometry = new THREE.SphereGeometry(
                                    tweeterRadius,
                                    32,
                                    32
);

const leftTweeter = new THREE.Mesh(leftTweeterGeometry, tweeterMaterial);
leftTweeter.position.set(-tweeterSpacing,  0.5, 0.2);
tweeterGroup.add(leftTweeter);

const rightTweeterGeometry = new THREE.SphereGeometry(
                                    tweeterRadius,
                                    32,
                                    32
);

const rightTweeter = new THREE.Mesh(rightTweeterGeometry, tweeterMaterial);
rightTweeter.position.set(tweeterSpacing, 0.5, 0.2);
tweeterGroup.add(rightTweeter);
leftTweeter.castShadow = true;
rightTweeter.castShadow = true;

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshStandardMaterial( {
//                       color: 0x00aaff,
// } );

// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

function animate() {

  requestAnimationFrame(animate);

  const bassLevel = Math.abs(Math.sin(Date.now() * 0.002));
  coneMesh.scale.set(
      1 + bassLevel * 0.2,
      1 + bassLevel * 0.2,
      1 + bassLevel * 0.2
  );
  coneMesh.position.z = 0.2 + bassLevel * 0.15;
  // const bassColor = new THREE.Color(
  //   0.3 + bassLevel * 0.7,
  //   0.1 + bassLevel * 0.2,
  //   0.1 + bassLevel * 0.2
  // );
  // pointLight.color = bassColor;
  // ambientLight.intensity = 0.5 + midslevel * 0.5;
  // pointLight.intensity = 1.2 + highLevel * 0.8;

 
  eqGroup.children.forEach((bar, index) => {
    const variation = Math.sin(Date.now() * 0.003 + index * 0.3);
    const midslevel = Math.abs(Math.sin(Date.now() * 0.004));
    const minHeight = 1.5;
    const maxHeight = 2.25;
    let finalScale = minHeight + (midslevel + variation) * 1.5;
    finalScale = Math.min(finalScale, maxHeight)
    bar.scale.y = finalScale;
    bar.position.y = 1.2 + (finalScale * 0.5);
  });

  const highLevel = Math.abs(Math.sin(Date.now() * 0.01));
  tweeterGroup.children.forEach((tweeter, index) => {
    const variation = Math.sin(Date.now() * 0.02 + index);
    const shimmer = 1 + (highLevel * 0.05) + (variation * 0.03);
    tweeter.scale.set(shimmer, shimmer, shimmer);
    tweeter.material.emissiveIntensity= highLevel * 0.5;
  })


  // cube.rotation.x += 0.01;
  // cube.rotation.y +=0.01;

  // const time = Date.now() * 0.0003;
  // camera.position.x = Math.sin(time) * 5;
  // camera.position.z = Math.cos(time) * 5;
  // camera.lookAt(0, 0, 0)

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  
});

export default animate
