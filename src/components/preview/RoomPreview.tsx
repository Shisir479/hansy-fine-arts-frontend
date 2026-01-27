"use client";
import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { SketchPicker } from "react-color";
import { 
  X, 
  Upload, 
  ChevronDown, 
  Check,
  RotateCcw
} from "lucide-react"; // Added RotateCcw for the notice

// --- DATA CONFIGURATION ---

const ROOM_DATABASE = [
  { id: 1, category: "Living Room", label: "Modern Living", url: "https://i.ibb.co.com/BB8QQsH/Living-Room-WP.png" },
  { id: 4, category: "Home Office", label: "Minimal Office", url: "https://i.ibb.co.com/n8srvFW/Home-office-WP.png" },
  { id: 5, category: "Bedroom", label: "Master Bedroom", url: "https://i.ibb.co.com/c1RXxm3/Bedroom-WP.png" },
  { id: 7, category: "Nursery", label: "Kids Room", url: "https://i.ibb.co.com/94FMPqV/Nursery-WP.png" },
  { id: 8, category: "Restaurant", label: "Fine Dining", url: "https://i.ibb.co.com/TPc5Vxp/Restaurant-WP.png" },
  { id: 9, category: "Cafe", label: "Coffee Shop", url: "https://i.ibb.co.com/CwJY8M9/Cafe-WP.png" },
  { id: 10, category: "Conference Room", label: "Meeting Room", url: "https://i.ibb.co.com/1vHxhqH/Conference-room-WP.png" },
  { id: 11, category: "Reception", label: "Lobby", url: "https://i.ibb.co.com/BTrsFmk/Reception-WP.png" },
];

const ROOM_CATEGORIES = [...new Set(ROOM_DATABASE.map(item => item.category))];

const FRAME_SIZES = [
  { label: "12x15", w: 120, h: 150 },
  { label: "16x20", w: 160, h: 200 },
  { label: "20x24", w: 200, h: 240 },
  { label: "24x36", w: 240, h: 360 },
  { label: "30x40", w: 300, h: 400 },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
};

export default function WallPreviewTool({ isOpen, onClose, productImage }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Living Room");
  const [selectedRoom, setSelectedRoom] = useState(ROOM_DATABASE[0]);
  const [wallColor, setWallColor] = useState("#f5f5f0");
  const [selectedSize, setSelectedSize] = useState(FRAME_SIZES[0]);
  const [customRoom, setCustomRoom] = useState<string | null>(null);
  
  const [activeDropdown, setActiveDropdown] = useState<"color" | "size" | "room" | null>(null);
  const nodeRef = useRef(null);

  const filteredRooms = ROOM_DATABASE.filter(room => room.category === selectedCategory);

  useEffect(() => {
    if (!customRoom) {
        const firstRoom = ROOM_DATABASE.find(r => r.category === selectedCategory);
        if (firstRoom) setSelectedRoom(firstRoom);
    }
  }, [selectedCategory]);

  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomRoom(url);
      setWallColor("#FFFFFF");
    }
  };

  const handleColorChange = (color: { hex: string }) => {
      setWallColor(color.hex);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-gray-800 flex flex-col">
      
      {/* --- MOBILE VIEW NOTICE (Shows on small, portrait screens) --- */}
      <div className="md:hidden lg:hidden xl:hidden fixed inset-0 bg-white z-[10000] flex flex-col items-center justify-center p-8 text-center">
          <RotateCcw size={48} className="text-black mb-4"/>
          <h2 className="text-xl font-bold mb-2">Optimize Your Preview</h2>
          <p className="text-sm text-gray-600 mb-4">
              For the **best experience** with color selection, dragging, and scaling, please **rotate your device to landscape view** or switch to a **desktop/laptop monitor**.
          </p>
          <button 
              onClick={onClose} 
              className="mt-4 px-6 py-2 border-2 border-black bg-black text-white text-sm font-medium hover:bg-white hover:text-black transition-all"
          >
              Close Preview
          </button>
      </div>

      {/* --- TOP HEADER (Adjusted Size: h-[60px], Padding reduced) --- */}
      <div className="h-[60px] bg-white border-b-2 border-black flex items-center justify-between px-6 relative z-50">
        
        <div className="flex items-center gap-4 h-full">
          {/* Minimal Artist Logo (Smaller Font) */}
          <div className="flex flex-col leading-none mr-4">
              <span className="font-serif text-2xl tracking-tight text-black">Atelier</span>
              <span className="text-[8px] font-medium text-black/40 uppercase tracking-[0.4em] mt-0.5">Preview Studio</span>
          </div>
          <div className="h-8 w-[2px] bg-black mx-2"></div>

          {/* 1. COLOR PICKER (Compact) */}
          <div className={`relative ${customRoom ? 'opacity-40 pointer-events-none' : ''}`}>
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                className="flex items-center justify-between w-[130px] border-2 border-black rounded-none px-2 py-1.5 bg-white hover:bg-black hover:text-white transition-all"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-4 h-4 border border-black shrink-0" style={{ backgroundColor: wallColor }}></div>
                    <span className="text-[11px] font-medium truncate uppercase tracking-wider">Wall Color</span>
                </div>
                <ChevronDown size={14} className="shrink-0"/>
              </button>

              {activeDropdown === 'color' && (
                <div className="absolute top-full left-0 mt-2 z-50 shadow-2xl border-2 border-black">
                   <SketchPicker 
                      color={wallColor}
                      onChange={handleColorChange}
                      disableAlpha={true}
                      presetColors={[
                          '#FFFFFF', '#F5F5F0', '#E8E8E3', '#D4D4CE', '#C0C0B8',
                          '#8B7355', '#6B5D52', '#4A3F35', '#2C2419', '#000000',
                          '#E8DDD3', '#D4C5B9', '#C9B8A8', '#B8A895', '#A89583'
                      ]}
                   />
                </div>
              )}
          </div>

          {/* 2. SIZE SELECTOR (Compact) */}
          <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')}
                className="flex items-center justify-between w-[110px] border-2 border-black rounded-none px-2 py-1.5 bg-white hover:bg-black hover:text-white transition-all text-xs font-bold uppercase tracking-wide"
              >
                {selectedSize.label}
                <ChevronDown size={14}/>
              </button>
              {activeDropdown === 'size' && (
                <div className="absolute top-full left-0 mt-2 w-[140px] bg-white border-2 border-black shadow-2xl py-1 z-50">
                   {FRAME_SIZES.map((s) => (
                      <button
                         key={s.label}
                         onClick={() => { setSelectedSize(s); setActiveDropdown(null); }}
                         className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-black hover:text-white transition-all flex justify-between items-center ${selectedSize.label === s.label ? 'bg-black text-white' : ''}`}
                      >
                        <span>{s.label}</span>
                        {selectedSize.label === s.label && <Check size={14} strokeWidth={3}/>}
                      </button>
                    ))}
                </div>
              )}
          </div>

          {/* 3. ROOM CATEGORY SELECTOR (Compact) */}
          <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'room' ? null : 'room')}
                className="flex items-center justify-between w-[160px] border-2 border-black rounded-none px-2 py-1.5 bg-white hover:bg-black hover:text-white transition-all text-xs font-bold uppercase tracking-wide"
              >
                <span className="truncate">{customRoom ? "Custom Upload" : selectedCategory}</span>
                <ChevronDown size={14}/>
              </button>
              {activeDropdown === 'room' && (
                <div className="absolute top-full left-0 mt-2 w-[200px] bg-white border-2 border-black shadow-2xl py-1 z-50 max-h-80 overflow-y-auto">
                   {ROOM_CATEGORIES.map((cat) => (
                      <button
                         key={cat}
                         onClick={() => { setSelectedCategory(cat); setCustomRoom(null); setActiveDropdown(null); }}
                         className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-black hover:text-white transition-all border-b border-black/5 last:border-0 ${selectedCategory === cat && !customRoom ? 'bg-black text-white' : ''}`}
                      >
                        {cat}
                      </button>
                    ))}
                </div>
              )}
          </div>
          
          {/* Measurement Guide (Smaller) */}
          <div className="hidden xl:flex flex-col justify-end ml-4 pb-1">
              <div className="text-[8px] text-black/40 mb-1 text-center w-full font-medium tracking-wider">7ft / 213cm</div>
              <div className="w-24 h-[1px] bg-black relative">
                 <div className="absolute left-0 -top-1 w-[1px] h-2.5 bg-black"></div>
                 <div className="absolute right-0 -top-1 w-[1px] h-2.5 bg-black"></div>
              </div>
          </div>
        </div>

        {/* Right Actions (Compact) */}
        <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-none hover:bg-black/80 text-xs font-bold cursor-pointer transition-all uppercase tracking-wider">
              <Upload size={14} strokeWidth={2.5}/>
              <span>Upload Room</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleRoomUpload}/>
            </label>
            <button onClick={onClose} className="ml-1 p-1.5 border-2 border-black hover:bg-black hover:text-white transition-all">
              <X size={18} strokeWidth={2.5}/>
            </button>
        </div>
      </div>

      {/* --- MAIN CANVAS (Expands Automatically) --- */}
      <div 
          className="flex-1 relative overflow-hidden flex items-center justify-center select-none bg-stone-50"
          onClick={() => setActiveDropdown(null)}
      >
          <div 
              className="relative w-full h-full max-w-[1600px] flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: wallColor, transition: "background-color 0.6s ease" }} 
          >
              {/* DRAGGABLE ARTWORK */}
              <Draggable nodeRef={nodeRef}>
               <div
                  ref={nodeRef}
                  className="absolute cursor-move"
                  style={{
                      width: `${selectedSize.w}px`,
                      height: `${selectedSize.h}px`,
                      zIndex: customRoom ? 30 : 10 
                  }}
               >
                  
                  {/* Minimal Frame */}
                  <div className="w-full h-full flex items-center justify-center relative group">
                     <img src={productImage} alt="Art" className="w-full h-full object-contain pointer-events-none"/>
                     
                     {/* Size Label */}
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-1 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap font-bold tracking-wider uppercase">
                         {selectedSize.label}
                     </div>
                  </div>
               </div>
              </Draggable>

              {/* ROOM IMAGE OVERLAY */}
              <img 
                src={customRoom || selectedRoom.url} 
                alt="Room Overlay" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: customRoom ? 0 : 20 }} 
              />
          </div>
      </div>

      {/* --- BOTTOM THUMBNAILS (Adjusted Size: h-[100px]) --- */}
      <div className="h-[83px] overflow-hidden bg-white border-t-2 border-black flex flex-col justify-center z-50 px-6">
          <div className="text-[9px] font-bold text-black/40 uppercase mb-2 tracking-[0.15em]">
              {customRoom ? "Custom Upload" : `${selectedCategory} Collection`}
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {!customRoom ? (
                filteredRooms.map((r) => (
                    <button
                    key={r.id}
                    onClick={() => { setSelectedRoom(r); setCustomRoom(null); setWallColor("#f5f5f0"); }}
                    className={`relative w-28 h-14 overflow-hidden border transition-all flex-shrink-0 group ${selectedRoom.id === r.id ? 'border-black shadow-lg scale-105' : 'border-black/20 opacity-60 hover:opacity-100 hover:border-black/60'}`}
                    >
                    <img src={r.url} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[8px] text-center py-1 truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium tracking-wide uppercase">
                        {r.label}
                    </div>
                    {selectedRoom.id === r.id && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-black flex items-center justify-center">
                            <Check size={10} className="text-white" strokeWidth={3}/>
                        </div>
                    )}
                    </button>
                ))
            ) : (
                <div className="text-xs text-black/50 font-medium">Using custom room image. Select a category above to view gallery options.</div>
            )}
          </div>
      </div>

    </div>
  );
}