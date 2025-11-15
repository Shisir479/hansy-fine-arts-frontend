'use client';

import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import React, { useState, useMemo } from 'react';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

interface ARImageProps {
  imageUrl: string;
}

const ARImage: React.FC<ARImageProps> = ({ imageUrl }) => {
  const texture = useLoader(TextureLoader, imageUrl);
  
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const WebXRPreview: React.FC = () => {
  const [isARStarted, setIsARStarted] = useState(false);
  const store = useMemo(() => createXRStore(), []);

  const handleStartAR = () => {
    setIsARStarted(true);
    store.enterAR();
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!isARStarted && (
        <button
          onClick={handleStartAR}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Start AR Preview
        </button>
      )}

      {isARStarted && (
        <Canvas style={{ width: '100%', height: '100%' }}>
          <XR store={store}>
            <ARImage imageUrl="/cuadro-vertical-1_1.jpg" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </XR>
        </Canvas>
      )}
    </div>
  );
};

export default WebXRPreview;
