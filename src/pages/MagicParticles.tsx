import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { 
  Sparkles, 
  Camera, 
  CameraOff, 
  Maximize, 
  Minimize, 
  ArrowLeft, 
  Palette, 
  Layers, 
  Smile, 
  Gamepad2,
  Circle,
  Square,
  Disc,
  Dna,
  Activity,
  Globe,
  TreePine
} from 'lucide-react';

interface PatternOption {
  id: string;
  name: string;
  IconComponent: React.FC<{ size?: number; className?: string }>;
}

const patterns: PatternOption[] = [
  { id: 'sphere', name: 'Sphere', IconComponent: Circle },
  { id: 'cube', name: 'Cube', IconComponent: Square },
  { id: 'torus', name: 'Torus', IconComponent: Disc },
  { id: 'helix', name: 'Helix', IconComponent: Dna },
  { id: 'wave', name: 'Wave', IconComponent: Activity },
  { id: 'galaxy', name: 'Galaxy', IconComponent: Globe },
  { id: 'tree', name: 'Structure', IconComponent: TreePine }
];

const funnyMessages = [
  "Just click Enter to launch!",
  "Gosh you must like stress!",
  "The No button is getting shy!",
  "Why are you doing this to yourself?",
  "I'm shrinking... click Enter!",
  "Okay, you're stubborn!",
  "The Enter button is waiting!",
  "This is getting ridiculous!",
  "Are you sure about this?",
  "Fine, keep clicking..."
];

const MagicParticles: React.FC = () => {
  // Intro State
  const [showIntro, setShowIntro] = useState(true);
  const [userName, setUserName] = useState('');
  const [noCount, setNoCount] = useState(0);
  const [funnyMsg, setFunnyMsg] = useState('');
  const [userPhotos, setUserPhotos] = useState<string[]>([]);

  // Playground State
  const [selectedPattern, setSelectedPattern] = useState('sphere');
  const [selectedColor, setSelectedColor] = useState('#00ffff');
  const [assemblyFactor, setAssemblyFactor] = useState(0.85);
  const [twistSpeed, setTwistSpeed] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for Three.js
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mouse / Pointer Tracking
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });

  const handleNoClick = () => {
    const next = noCount + 1;
    setNoCount(next);
    setFunnyMsg(funnyMessages[next % funnyMessages.length]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          urls.push(evt.target.result as string);
          setUserPhotos([...urls]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Start Experience
  const handleStartExperience = () => {
    setShowIntro(false);
  };

  // Safe cleanup for media stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (showIntro || !containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Create initial particles with current pattern and color
    generateParticles(selectedPattern, selectedColor, scene);

    // Pointer events
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mousePos.current.targetX = (clientX / window.innerWidth) * 2 - 1;
      mousePos.current.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerDown = () => {
      mousePos.current.isDown = true;
    };

    const handlePointerUp = () => {
      mousePos.current.isDown = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchend', handlePointerUp);

    // Resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      clock += 0.016;

      // Smooth mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const originalPositions = (particlesRef.current.userData as any).originalPositions;

        const effectiveFactor = mousePos.current.isDown ? 0.3 : assemblyFactor;
        const scale = 0.2 + effectiveFactor * 1.1;
        const dispersion = (1 - effectiveFactor) * 45;
        const twist = mousePos.current.x * 2.5 * twistSpeed;

        for (let i = 0; i < positions.length; i += 3) {
          const idx = i / 3;
          const orig = originalPositions[idx];
          if (!orig) continue;

          const randX = Math.sin(clock * 0.7 + idx * 0.02) * dispersion;
          const randY = Math.cos(clock * 0.5 + idx * 0.02) * dispersion;
          const randZ = Math.sin(clock * 0.6 + idx * 0.015) * dispersion;

          const cosT = Math.cos(twist * (1 + orig.y * 0.04));
          const sinT = Math.sin(twist * (1 + orig.y * 0.04));
          const rotX = orig.x * cosT - orig.z * sinT;
          const rotZ = orig.x * sinT + orig.z * cosT;

          positions[i] = rotX * scale + randX + mousePos.current.x * 10;
          positions[i + 1] = orig.y * scale + randY + mousePos.current.y * 10;
          positions[i + 2] = rotZ * scale + randZ;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y += 0.003 * twistSpeed;
        particlesRef.current.rotation.x = mousePos.current.y * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [showIntro, assemblyFactor, twistSpeed, selectedPattern, selectedColor]);

  // Function to build particle geometry
  const generateParticles = (pattern: string, colorHex: string, targetScene?: THREE.Scene) => {
    const scene = targetScene || sceneRef.current;
    if (!scene) return;

    if (particlesRef.current) {
      scene.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      (particlesRef.current.material as THREE.Material).dispose();
    }

    const count = 5500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalPositions: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;

      switch (pattern) {
        case 'sphere': {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 16 + Math.random() * 6;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          break;
        }
        case 'cube': {
          x = (Math.random() - 0.5) * 32;
          y = (Math.random() - 0.5) * 32;
          z = (Math.random() - 0.5) * 32;
          break;
        }
        case 'torus': {
          const angle = Math.random() * Math.PI * 2;
          const tubeAngle = Math.random() * Math.PI * 2;
          const majorR = 18;
          const minorR = 6;
          x = (majorR + minorR * Math.cos(tubeAngle)) * Math.cos(angle);
          y = (majorR + minorR * Math.cos(tubeAngle)) * Math.sin(angle);
          z = minorR * Math.sin(tubeAngle);
          break;
        }
        case 'helix': {
          const t = (i / count) * Math.PI * 12;
          const r = 12;
          x = r * Math.cos(t);
          y = (i / count - 0.5) * 54;
          z = r * Math.sin(t);
          break;
        }
        case 'wave': {
          x = (i / count - 0.5) * 60;
          y = Math.sin(x * 0.4) * 12;
          z = Math.cos(x * 0.25) * 8 + (Math.random() - 0.5) * 6;
          break;
        }
        case 'galaxy': {
          const arms = 3;
          const arm = Math.floor(Math.random() * arms);
          const dist = Math.pow(Math.random(), 1.5) * 26;
          const spin = dist * 0.4 + (arm * (Math.PI * 2 / arms));
          x = dist * Math.cos(spin) + (Math.random() - 0.5) * 3;
          y = (Math.random() - 0.5) * 4;
          z = dist * Math.sin(spin) + (Math.random() - 0.5) * 3;
          break;
        }
        case 'tree': {
          const height = 44;
          const treeY = (Math.random() * height) - height / 2;
          const radius = (1 - (treeY + height / 2) / height) * 16;
          const angle = Math.random() * Math.PI * 2;
          const radDist = Math.random() * radius;
          x = radDist * Math.cos(angle);
          y = treeY;
          z = radDist * Math.sin(angle);
          if (Math.random() < 0.12 && treeY < -height / 3) {
            x = (Math.random() - 0.5) * 3;
            z = (Math.random() - 0.5) * 3;
          }
          break;
        }
        default:
          x = (Math.random() - 0.5) * 30;
          y = (Math.random() - 0.5) * 30;
          z = (Math.random() - 0.5) * 30;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions.push({ x, y, z });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(colorHex),
      size: 0.6,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { originalPositions };
    particlesRef.current = particles;
    scene.add(particles);
  };

  // Switch pattern
  const handleSelectPattern = (patternId: string) => {
    setSelectedPattern(patternId);
    generateParticles(patternId, selectedColor);
  };

  // Change color
  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.PointsMaterial).color.set(hex);
    }
  };

  // Toggle Camera
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err: any) {
        console.warn("Camera could not be started:", err);
        setCameraError("Camera unavailable. You can use touch, mouse movement, or sliders to play!");
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden select-none font-sans">
      {/* Intro Modal Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 backdrop-blur-xl overflow-y-auto">
          {/* Animated cosmic sparkles */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  width: `${(i % 4) + 2}px`,
                  height: `${(i % 4) + 2}px`,
                  top: `${(i * 19) % 100}%`,
                  left: `${(i * 37) % 100}%`,
                  animationDuration: `${(i % 3) + 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-xl w-full bg-white/10 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Interactive 3D Particles
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
              Control thousands of glowing 3D particles with your mouse, touch gestures, or camera.
            </p>

            {/* Customizer */}
            <div className="space-y-4 text-left bg-black/30 p-5 rounded-2xl border border-white/10 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
                  Your Codename
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Astro Kid, Junior Developer..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
                  Upload Photos to Inspect (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-white/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
                />
                {userPhotos.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {userPhotos.map((img, idx) => (
                      <img key={idx} src={img} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-cyan-400/50" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleStartExperience}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-slate-950 font-black text-lg rounded-2xl shadow-xl shadow-cyan-500/20 transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                <span>Launch Experience</span>
              </button>

              <button
                type="button"
                onClick={handleNoClick}
                style={{
                  transform: `scale(${Math.max(0.35, 1 - noCount * 0.12)})`,
                  opacity: Math.max(0.4, 1 - noCount * 0.1)
                }}
                className="w-full sm:w-auto px-6 py-4 bg-red-500/30 hover:bg-red-500/50 text-red-300 font-bold rounded-2xl border border-red-500/40 transition-all text-sm"
              >
                Not Now
              </button>
            </div>

            {funnyMsg && (
              <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-400/40 rounded-xl text-yellow-200 text-xs font-bold">
                {funnyMsg}
              </div>
            )}

            <div className="mt-6">
              <Link to="/portfolio" className="text-xs text-white/50 hover:text-white underline tracking-wider uppercase">
                Back to Showcase & Our Work
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Three.js Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header & Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            to="/portfolio"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md rounded-xl text-white/90 text-sm font-semibold border border-white/10 shadow-lg transition-colors"
          >
            <ArrowLeft size={16} /> Back to Kids Corner
          </Link>
          {userName && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 text-xs font-bold">
              <Smile size={14} /> {userName}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md rounded-xl text-white/90 border border-white/10 shadow-lg transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Control Panel (Floating Left) */}
      <div className="absolute top-20 left-4 z-20 w-72 md:w-80 bg-slate-900/85 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl space-y-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
            <Sparkles size={16} /> Pattern Engine
          </div>
          <span className="text-[10px] uppercase tracking-wider font-mono text-white/50">5,500 Pts</span>
        </div>

        {/* Patterns Grid */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
            <Layers size={13} /> Select Shape
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {patterns.map((p) => {
              const Icon = p.IconComponent;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPattern(p.id)}
                  className={`p-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center ${
                    selectedPattern === p.id
                      ? 'bg-cyan-500/30 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <Icon size={18} className="mb-1 text-cyan-400" />
                  <div className="text-[10px] truncate">{p.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
            <Palette size={13} /> Particle Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <div className="flex flex-wrap gap-1.5 flex-grow">
              {['#00ffff', '#ff007f', '#a855f7', '#fbbf24', '#10b981', '#ffffff'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-lg border transition-transform ${
                    selectedColor.toLowerCase() === c.toLowerCase() ? 'scale-110 border-white ring-2 ring-white/50' : 'border-black/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Controls */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div>
            <div className="flex justify-between text-xs font-bold text-white/70 mb-1">
              <span>Assembly Power</span>
              <span className="text-cyan-400">{(assemblyFactor * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={assemblyFactor}
              onChange={(e) => setAssemblyFactor(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-white/70 mb-1">
              <span>Swirl / Spin Speed</span>
              <span className="text-purple-400">{twistSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.2"
              value={twistSpeed}
              onChange={(e) => setTwistSpeed(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Webcam toggle */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={toggleCamera}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              cameraActive
                ? 'bg-red-500/30 text-red-300 border border-red-500/50 hover:bg-red-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30'
            }`}
          >
            {cameraActive ? <CameraOff size={15} /> : <Camera size={15} />}
            {cameraActive ? 'Stop Camera Video' : 'Enable Gesture Camera'}
          </button>
          {cameraError && (
            <p className="text-[11px] text-yellow-300 mt-2 leading-tight">{cameraError}</p>
          )}
        </div>
      </div>

      {/* Floating video feed preview when camera active */}
      {cameraActive && (
        <div className="absolute top-20 right-4 z-20 w-44 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl bg-black">
          <video ref={videoRef} className="w-full h-auto transform -scale-x-100" playsInline muted autoPlay />
          <canvas ref={canvasRef} className="hidden" />
          <div className="p-2 text-center bg-slate-900/90 text-[10px] font-bold text-cyan-300">
            Hand Camera Active
          </div>
        </div>
      )}

      {/* Bottom Floating Hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-6 py-2.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-xs md:text-sm font-medium shadow-2xl flex items-center gap-2 text-center">
          <Gamepad2 size={16} className="text-cyan-400 animate-pulse" />
          <span>Move mouse or drag to swirl & shape the 3D particles. Click to disperse!</span>
        </div>
      </div>
    </div>
  );
};

export default MagicParticles;
