import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import heroWatermarkLogo from "../../assets/FINAL_LOGO_JDI-removebg-preview.png";

const GlobeMesh = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      heroWatermarkLogo,
      (loadedTexture) => {
        if (isMounted) {
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          loadedTexture.repeat.set(2, 1);
          loadedTexture.needsUpdate = true;
          setTexture(loadedTexture);
        }
      },
      undefined,
      (err) => {
        console.error("Error loading watermark texture", err);
      },
    );
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Inner Sphere Core: Sleek midnight titanium */}
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshStandardMaterial 
          color="#0d1117" 
          roughness={0.2} 
          metalness={0.85} 
        />
      </mesh>

      {/* Subtle Inner Glow Rim */}
      <mesh>
        <sphereGeometry args={[1.16, 64, 64]} />
        <meshStandardMaterial 
          color="#df4627" 
          roughness={0.4} 
          metalness={0.2} 
          transparent={true} 
          opacity={0.15} 
          wireframe={true}
        />
      </mesh>

      {/* Outer Watermark Texture Mesh */}
      {texture && (
        <mesh>
          <sphereGeometry args={[1.18, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            transparent={true}
            alphaTest={0.03}
            roughness={0.15}
            metalness={0.4}
            color="#ffffff"
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const LogoGlobe: React.FC = () => {
  return (
    <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center relative group">
      <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(223,70,39,0.25)] bg-brand-red animate-ping opacity-15 z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }}>
          <ambientLight intensity={1.8} />
          <directionalLight position={[10, 10, 10]} intensity={2.2} />
          <directionalLight position={[-10, -10, -10]} intensity={1.2} />
          <pointLight position={[0, 0, 5]} intensity={2.0} color="#ffffff" />
          <GlobeMesh />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={2.8}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default LogoGlobe;
