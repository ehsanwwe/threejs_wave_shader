import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Task2() {
    const containerRef = useRef(null);

    useEffect(() => {
        // Set up scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight)

        const geometry = new THREE.PlaneGeometry(5, 5, 20, 20);

        // Task 2 Custom shader
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { type: 'f', value: 0.0 },
                u_color: { value: new THREE.Color(0xff66ff) } ,
            },
            vertexShader: `
                uniform float u_time;
                varying vec3 vPosition;
                
                void main() {
                    vec3 pos = position;
                    float wave_x = cos(pos.x*2. + u_time) *0.5;
                    float wave_y = sin(pos.y*2. + u_time) *0.5;
                    pos += vec3(wave_y * 0.5,wave_x *0.5,wave_x + wave_y);
                    
                    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float u_time;
                uniform vec3 u_color;
                varying vec3 vPosition;
                
                void main() {
                    float wave_x = cos(vPosition.x*2. + u_time) *0.5;
                    float wave_y = sin(vPosition.y*2. + u_time) *0.5;
                    float pickColor = wave_x + wave_y;
                    vec3 color = 0.8 +  vec3(pickColor,pickColor,pickColor )*0.2 ;
                     
                    gl_FragColor = vec4(u_color * color, 1.0);
                }
            `,
            wireframe: false,
        });


        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);



        // Animation loop
        const clock = new THREE.Clock();

        const animate = () => {
            material.uniforms.u_time.value = 2*clock.getElapsedTime();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup on unmount
        return () => {

        };
    }, []);

    return <div ref={containerRef} />;
}

export default Task2;