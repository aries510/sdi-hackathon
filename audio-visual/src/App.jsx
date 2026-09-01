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
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(5, 5, 5);
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
                            color: 0x111111,
                            roughness: 0.7,
                            metalness: 0.2,
                            emissive: 0x000000
});

const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.z = 0.2;
subwooferGroup.add(coneMesh);

const surroundGeometry = new THREE.TorusGeometry(
                                1.2,
                                0.15,
                                16,
                                100
);

const surroundMaterial = new THREE.MeshStandardMaterial({
                                color: 0x222222,
                                roughness: 0.9,
                                metalness: 0.1
})

const surroundMesh = new THREE.Mesh(surroundGeometry, surroundMaterial);
surroundMesh.rotation.x = Math.PI / 2;
subwooferGroup.add(surroundMesh);

const frameGeometry = new THREE.CylinderGeometry(
                              1.4,
                              1.4,
                              0.6,
                              32
);

const frameMaterial = new THREE.MeshStandardMaterial({
                              color: 0x333333,
                              roughness: 0.4,
                              metalness: 0.8
});

const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
frameMesh.position.z = -0.3;
subwooferGroup.add(frameMesh);
subwooferGroup.position.set(0, -0.5, 0);

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

eqGroup.position.set(0, 0.5, 0);

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
      1 + bassLevel * 0.3,
      1 + bassLevel * 0.3,
      1 + bassLevel * 0.3
  );
  coneMesh.position.z = 0.2 + bassLevel * 0.15;



  // cube.rotation.x += 0.01;
  // cube.rotation.y +=0.01;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspec = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

export default animate
