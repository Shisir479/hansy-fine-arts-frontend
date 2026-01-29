"use client";

import React, { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";

interface ImageMagnifierProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string; // Container class
    imageClassName?: string;
    magnifierHeight?: number;
    magnifierWidth?: number;
    zoomLevel?: number;
    onClick?: () => void;
}

export default function GlassMagnifier({
    src,
    alt,
    width,
    height,
    className = "",
    imageClassName = "",
    magnifierHeight = 150,
    magnifierWidth = 150,
    zoomLevel = 2.5,
    onClick,
}: ImageMagnifierProps) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [xy, setXY] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
        updateSize();
        setShowMagnifier(true);
    };

    const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        setShowMagnifier(false);
    };

    const updateSize = () => {
        if (imgRef.current) {
            const { width, height } = imgRef.current.getBoundingClientRect();
            setImgSize({ width, height });
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;

        const elem = imgRef.current;
        const { top, left, width, height } = elem.getBoundingClientRect();

        // Calculate mouse position relative to image
        let x = e.pageX - left - window.scrollX;
        let y = e.pageY - top - window.scrollY;

        // Constrain to image bounds (optional, but keeps lens inside)
        // Actually, for Glass effect, we usually want the lens to track mouse exactly, even if center is near edge.
        // However, we should ensure we don't calculate background position outside bounds excessively.

        // Check if mouse is actually inside the rendered image (if object-contain is used, this might be tricky)
        // But since we are putting the listener on the wrapper which matches the image size (hopefully), it's fine.

        // If the mouse is outside the image bounds, hide.
        if (x < 0 || y < 0 || x > width || y > height) {
            setShowMagnifier(false);
            return;
        } else {
            setShowMagnifier(true);
        }

        setXY({ x, y });
    };

    return (
        <div
            className={`relative inline-block cursor-crosshair ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={onClick}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`${imageClassName} object-contain`}
                style={{ width: "100%", height: "100%", display: "block" }}
            // Note: We use a standard img tag here to easily get refs and bounding box. 
            // Next/Image can be used but requires more work with refs.
            // Given the requirement for "glass zoom", standard img is often robust enough for the detail view.
            // If Next/Image is implicitly required for optimization, we can wrap it, but we need the underlying DOM node.
            />

            {showMagnifier && (
                <div
                    style={{
                        display: "block",
                        position: "absolute",
                        pointerEvents: "none",
                        height: `${magnifierHeight}px`,
                        width: `${magnifierWidth}px`,
                        // Center the magnifier on the mouse
                        top: `${xy.y - magnifierHeight / 2}px`,
                        left: `${xy.x - magnifierWidth / 2}px`,
                        borderRadius: "50%",
                        border: "2px solid #e5e5e5", // Light silver border
                        backgroundColor: "white",
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: "no-repeat",
                        // Scale background size based on zoom level and CURRENT image rendered size
                        backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel
                            }px`,
                        // Calculate position to show the zoomed area matching the mouse position
                        // logic: -(x * zoom - magnifierW/2)
                        backgroundPositionX: `${-xy.x * zoomLevel + magnifierWidth / 2}px`,
                        backgroundPositionY: `${-xy.y * zoomLevel + magnifierHeight / 2}px`,
                        zIndex: 50, // High z-index to sit on top
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 20px rgba(0,0,0,0.15)" // Drop shadow
                    }}
                />
            )}
        </div>
    );
}
