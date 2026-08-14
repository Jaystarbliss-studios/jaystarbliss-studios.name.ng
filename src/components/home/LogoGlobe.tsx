import jaystarblissLogo from "../../assets/favicon.png";
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const GlobeMesh = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      jaystarblissLogo,
      (loadedTexture) => {
        if (isMounted) {
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.repeat.x = 2;
          setTexture(loadedTexture);
        }
      },
      undefined,
      (err) => {
        console.error("Error loading texture", err);
      },
    );
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.7} />
      </mesh>

      {texture && (
        <mesh>
          <sphereGeometry args={[1.18, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            transparent={true}
            alphaTest={0.05}
            roughness={0.2}
            metalness={0.3}
            color="#ffffff"
          />
        </mesh>
      )}
    </group>
  );
};

const LogoGlobe: React.FC = () => {
  return (
    <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center relative group">
      <div className="absolute inset-0 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] bg-brand-red animate-ping opacity-10 z-0"></div>

      <div className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={2.0} />
          <directionalLight position={[-10, -10, -10]} intensity={1.0} />
          <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" />
          <GlobeMesh />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={3.0}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default LogoGlobe;
