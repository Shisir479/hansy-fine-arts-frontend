"use client";
import React, { useEffect, useRef, useState } from "react";
import { Monitor, Grid, X, Maximize, Minimize } from "lucide-react";

interface LivePreviewARModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

// সাইজ লিস্ট
const AVAILABLE_SIZES = [
  { label: "12x18", width: 12, height: 18 },
  { label: "14x21", width: 14, height: 21 },
  { label: "16x24", width: 16, height: 24 },
  { label: "24x36", width: 24, height: 36 },
  { label: "25x38", width: 25, height: 38 },
  { label: "29x44", width: 29, height: 44 },
  { label: "32x48", width: 32, height: 48 },
  { label: "38x57", width: 38, height: 57 },
];

export default function LivePreviewARModal({
  isOpen,
  onClose,
  imageSrc,
}: LivePreviewARModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // Draggable State
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // 1. Handle Camera Stream
  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Camera access denied. Please allow camera permissions.");
          onClose();
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 2. Toggle Full Screen Function
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  // 3. Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 4. Dynamic Size Calculation
  const PIXELS_PER_UNIT = 12; 
  const currentWidth = AVAILABLE_SIZES[selectedSizeIndex].width * PIXELS_PER_UNIT;
  const currentHeight = AVAILABLE_SIZES[selectedSizeIndex].height * PIXELS_PER_UNIT;

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef} 
      className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300"
    >
      {/* --- HEADER BAR --- */}
      <div className={`bg-white h-16 flex items-center justify-between px-4 shadow-md z-10 shrink-0 ${isFullScreen ? 'absolute top-0 left-0 right-0 bg-opacity-90' : ''}`}>
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="border-2 border-black p-1 rounded text-xs">AR</div>
          <span>LivePreview</span>
        </div>

        <div className="flex items-center gap-4">
          {/* SIZE DROPDOWN */}
          <div className="hidden md:flex items-center border rounded px-2 py-1 text-sm bg-gray-100 relative">
            <span className="text-gray-500 mr-2">Size:</span>
            <select 
              className="bg-transparent font-semibold outline-none cursor-pointer text-black"
              value={selectedSizeIndex}
              onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}
            >
              {AVAILABLE_SIZES.map((size, index) => (
                <option key={size.label} value={index}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* FULL SCREEN BUTTON */}
          <button 
            onClick={toggleFullScreen}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition text-sm font-medium text-gray-700"
          >
            {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition text-sm font-medium text-gray-800">
            <Grid size={16} /> Wall Preview
          </button>
        </div>

        <button
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            onClose();
          }}
          className="hover:bg-gray-200 rounded-full p-2 transition"
        >
          <X size={32} />
        </button>
      </div>

      {/* --- CENTER CANVAS AREA --- */}
      <div className="flex-1 flex items-center justify-center bg-black overflow-hidden w-full h-full relative">
        
        {/* CAMERA BOX CONTAINER (FIXED SIZE) */}
        {/* এখানে পরিবর্তন করেছি: 
           আগে ফুল স্ক্রিনে 'w-full h-full' ছিল, এখন সেটা বাদ দিয়েছি। 
           এখন সবসময় 'w-[640px] h-[480px]' থাকবে।
        */}
        <div 
          className="relative w-[640px] h-[480px] bg-gray-900 overflow-hidden shadow-2xl"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute w-full h-full object-cover pointer-events-none" 
          />

          {/* Draggable Image Overlay */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              width: `${currentWidth}px`,
              height: `${currentHeight}px`,
              cursor: isDragging ? "grabbing" : "grab",
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: `-${currentHeight / 2}px`,
              marginLeft: `-${currentWidth / 2}px`,
            }}
            // NO BORDERS HERE AS REQUESTED
            className="z-20 transition-all duration-75" 
          >
            <img
              src={imageSrc}
              alt="AR Overlay"
              className="w-full h-full pointer-events-none select-none object-contain drop-shadow-xl" 
            />
            
            {/* Label showing only when dragging */}
            {isDragging && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {AVAILABLE_SIZES[selectedSizeIndex].label}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* --- FOOTER INSTRUCTIONS --- */}
      <div className="bg-black text-white py-4 text-center text-sm font-light tracking-wide shrink-0">
        <p>
          For proper scaling, stand <span className="font-bold">12 feet</span>{" "}
          away from the wall.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          You can also <span className="text-white font-bold">drag the image</span>{" "}
          to your desired location.
        </p>
      </div>
    </div>
  );
}