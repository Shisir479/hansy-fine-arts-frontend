'use client';

import React, { useState } from 'react';

interface Google3DModelPreviewProps {
  modelSrc: string;
}

// Extend JSX to include model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const Google3DModelPreview: React.FC<Google3DModelPreviewProps> = ({ modelSrc }) => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen">
      {/* Sidebar for customization */}
      {!showPreview && (
        <div className="w-full max-w-md bg-gray-100 p-4 shadow-md">
          <h2 className="text-xl font-bold mb-4">Customize 3D Model</h2>

          {/* Background Color Picker */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Background Color:</h4>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-10 p-2 rounded border border-gray-300"
            />
          </div>

          {/* Toggle Preview Button */}
          <button
            onClick={() => setShowPreview(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow w-full"
          >
            Start Preview
          </button>
        </div>
      )}

      {/* 3D Model Viewer */}
      {showPreview && (
        <div className="flex-1 w-full h-full relative">
          <model-viewer
            src={modelSrc}
            alt="3D Model"
            ar
            auto-rotate
            camera-controls
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: backgroundColor,
            }}
          ></model-viewer>

          {/* Close Preview Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default Google3DModelPreview;
