import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.164.1/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three@0.164.1/examples/jsm/loaders/OBJLoader.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
// Add Fog to the Scene
scene.fog = new THREE.Fog(0x87CEEB, 10, 50); // Color, near distance, far distance

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Floor for Shadows
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff0f0f, 0.5);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xff0000, 1);
spotLight.position.set(5, 15, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const hemisphereLight = new THREE.HemisphereLight(0x4040ff, 0x00ff00, 0.6);
scene.add(hemisphereLight);


// Textured Cube
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./resources/textures/wood.jpg');

// Load Cloudy Sky Texture

const skyTexture = textureLoader.load('./resources/textures/cloudy.jpg');

// Create a Sky Sphere
const skyGeometry = new THREE.SphereGeometry(500, 60, 40); // Large sphere
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);
// Create Walkway (Narrow Path Between Trees and Pool)
const walkwayGeometry = new THREE.BoxGeometry(8, 0.7, 50); // Long and narrow
const walkwayMaterial = new THREE.MeshStandardMaterial({ map: texture });
const walkway = new THREE.Mesh(walkwayGeometry, walkwayMaterial);
walkway.position.set(0, 0.1, 0); // Slightly above ground level
walkway.receiveShadow = true;
scene.add(walkway);

// Load Taj Mahal Model
const objLoader = new OBJLoader();
objLoader.load('./resources/model.obj', (object) => {
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    object.position.set(0, 0, -20); // Move back
    object.scale.set(0.02, 0.02, 0.02); // Scale it down
    scene.add(object);
});

// Create a Long Pool
const poolGeometry = new THREE.BoxGeometry(5, 0.5, 50); // Long and narrow
const poolMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.7 });
const pool = new THREE.Mesh(poolGeometry, poolMaterial);
pool.position.set(0, 0.25, 0); // Slightly above ground
pool.receiveShadow = true;
scene.add(pool);



// Load First Model (Existing)
objLoader.load('./resources/woman.obj', (object) => {
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    object.rotation.x = -190;
    object.position.set(1, 1, -15);  // Adjust position
    object.scale.set(0.1, 0.1, 0.1);
    scene.add(object);
});

// Load Second Model (New)
objLoader.load('./resources/man.obj', (object) => {
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue color
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    object.rotation.x = -190;
    object.position.set(4, -0.1, 10);  // Adjust position
    object.scale.set(0.1, 0.1, 0.1);
    scene.add(object);
});


// Function to Create Trees
function createTree(positionX, positionZ) {
    // Smaller Trunk (Cylinder)
    const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16); // Smaller trunk
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(positionX, 1.25, positionZ); // Adjust height accordingly
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);

    // Smaller Leaves (Cone)
    const leavesGeometry = new THREE.ConeGeometry(0.5, 2.5, 16); // Smaller cone
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(positionX, 3, positionZ); // Position above the trunk
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    scene.add(leaves);
}


// Add Trees Along Both Sides of the Pool
const treeSpacing = 3;
for (let i = -15; i <= 15; i += treeSpacing) {
    createTree(-5, i); // Left side
    createTree(5, i);  // Right side
}

const billboardTexture = textureLoader.load('resources/textures/billboard.png');
const billboardMaterial = new THREE.SpriteMaterial({ map: billboardTexture });

for (let i = 0; i < 5; i++) {
    const billboard = new THREE.Sprite(billboardMaterial);
    billboard.position.set(Math.random() * 59 - 5, 2, Math.random() * 68 - 5);
    billboard.scale.set(2, 2, 1);
    scene.add(billboard);
}
// Camera Position
camera.position.set(0, 5, 10);

// Raycaster for Picking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;

// Picking Event Listener
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        // Reset previous selection color
        if (selectedObject) {
            selectedObject.material.emissive.setHex(selectedObject.currentHex);
        }

        // Highlight the new selection
        selectedObject = intersects[0].object;
        selectedObject.currentHex = selectedObject.material.color.getHex(); // Save original color
        selectedObject.material.emissive = new THREE.Color(0xff0000); // Highlight color
    }
});
// Create a Sun (Glowing Sphere)
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, emissive: 0xFFFF00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Directional Light (Simulating Sunlight)
const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 50;
scene.add(sunLight);

// Sun Orbit Variables
let sunRadius = 30; // Orbit radius
let sunSpeed = 0.001; 
let sunAngle = 0;
// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Move the Sun in a Circular Path
    sunAngle += sunSpeed; // Increase angle over time
    sun.position.x = sunRadius * Math.cos(sunAngle);
    sun.position.z = sunRadius * Math.sin(sunAngle);
    sun.position.y = 20; // Keep sun at a fixed height

    // Keep the light following the sun
    sunLight.position.copy(sun.position);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize Handling
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
