// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// const BASE_MODEL_URL = "/models/base.glb"; // replace with your Tarnished
// const HELMET_MODEL_URL = "/models/helmet.glb"; // replace with an armor piece

// export default function ArmorCanvas() {
//     const mountRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!mountRef.current) return;

//         // Scene setup
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x1a1a1a);

//         // Camera
//         const camera = new THREE.PerspectiveCamera(
//             45,
//             mountRef.current.clientWidth / mountRef.current.clientHeight,
//             0.1,
//             1000
//         );
//         camera.position.set(0, 1.6, 3); // a little above "eye level"

//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(
//             mountRef.current.clientWidth,
//             mountRef.current.clientHeight
//         );
//         renderer.setPixelRatio(window.devicePixelRatio);
//         mountRef.current.appendChild(renderer.domElement);

//         // Lighting
//         const ambient = new THREE.AmbientLight(0xffffff, 0.6);
//         const directional = new THREE.DirectionalLight(0xffffff, 1);
//         directional.position.set(2, 4, 5);
//         scene.add(ambient, directional);

//         // Orbit controls
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;

//         // Load models
//         const loader = new GLTFLoader();
//         let baseModel: THREE.Group | null = null;

//         loader.load(
//             BASE_MODEL_URL,
//             (gltf) => {
//                 baseModel = gltf.scene;
//                 scene.add(baseModel);

//                 // After base is loaded, load helmet
//                 loader.load(
//                     HELMET_MODEL_URL,
//                     (helmetGltf) => {
//                         const helmet = helmetGltf.scene;

//                         // You’ll likely need to align helmet transforms here
//                         // For now, we just parent it under the base model
//                         baseModel!.add(helmet);
//                     },
//                     undefined,
//                     (err) => console.error("Helmet load error", err)
//                 );
//             },
//             undefined,
//             (err) => console.error("Base model load error", err)
//         );

//         // Resize handling
//         const handleResize = () => {
//             if (!mountRef.current) return;
//             camera.aspect =
//                 mountRef.current.clientWidth / mountRef.current.clientHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(
//                 mountRef.current.clientWidth,
//                 mountRef.current.clientHeight
//             );
//         };
//         window.addEventListener("resize", handleResize);

//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);
//             controls.update();
//             renderer.render(scene, camera);
//         };
//         animate();

//         return () => {
//             // window.removeEventListener("resize", handleResize);
//             renderer.dispose();
//             controls.dispose();
//             mountRef.current?.removeChild(renderer.domElement);
//         };
//     }, []);

//     return <div style={{ width: "100%", height: "70vh" }} ref={mountRef} />;
// }

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ArmorViewer() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        if (mountRef.current) {
            mountRef.current.innerHTML = ""; // clear children
            mountRef.current.appendChild(renderer.domElement);
        }

        // Cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.position.set(5, 5, 5);
        scene.add(ambient, directional);

        // Resize handling
        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect =
                mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(
                mountRef.current.clientWidth,
                mountRef.current.clientHeight
            );
        };
        window.addEventListener("resize", handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            // window.removeEventListener("resize", handleResize);
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div style={{ width: "100%", height: "70vh" }} ref={mountRef} />;
}
