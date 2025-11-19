"use client";
import React, { useState } from 'react';
import { Heart, Mail, Share2 } from 'lucide-react';

export default function ProductMockup() {
  const [quantity, setQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState('watercolor');
  const [selectedProduct, setSelectedProduct] = useState('hoodie');

  const materials = [
    { id: 'watercolor', name: 'Watercolor Fine Art Paper' },
    { id: 'canvas', name: 'Canvas' },
    { id: 'metal', name: 'Metal - White Gloss' },
    { id: 'wood', name: 'Wood' },
    { id: 'acrylic', name: '1/4" Acrylic' }
  ];

  const products = [
    { id: 'hoodie', name: 'Hoodies (No Zip or Pullover)', icon: '👕' },
    { id: 'tshirt', name: 'T-Shirts', icon: '👔' },
    { id: 'tank', name: 'Tank Tops', icon: '🎽' },
    { id: 'tote', name: 'Tote Bags', icon: '👜' },
    { id: 'pillow', name: 'Throw Pillows', icon: '🛋️' },
    { id: 'phone', name: 'Phone Cases', icon: '📱' },
    { id: 'mug', name: 'Mugs', icon: '☕' },
    { id: 'puzzle', name: 'Puzzles', icon: '🧩' },
    { id: 'ornament', name: 'Porcelain Ornaments', icon: '🎄' },
    { id: 'metal-ornament', name: 'Metal Ornaments', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - Product Image */}
          <div className="flex flex-col items-center">
            <div className="w-full bg-gray-50 rounded-lg p-8 mb-6">
              <img 
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop" 
                alt="Product mockup"
                className="w-full h-auto"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-8 text-sm text-gray-600">
              <button className="flex flex-col items-center gap-2 hover:text-gray-900">
                <Heart className="w-6 h-6" />
                <span>Save to Favorites</span>
              </button>
              <button className="flex flex-col items-center gap-2 hover:text-gray-900">
                <div className="w-6 h-6 flex items-center justify-center text-lg">🔄</div>
                <span>360° Viewing Tool</span>
              </button>
              <button className="flex flex-col items-center gap-2 hover:text-gray-900">
                <Mail className="w-6 h-6" />
                <span>Email a Friend</span>
              </button>
            </div>

            {/* Share */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-gray-600">Share</span>
              <div className="flex gap-3">
                <button className="text-gray-600 hover:text-gray-900">𝕏</button>
                <button className="text-gray-600 hover:text-gray-900">f</button>
                <button className="text-gray-600 hover:text-gray-900">P</button>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div>
            <h1 className="text-3xl font-light tracking-wider mb-4">WILLIE NELSON</h1>
            
            <div className="mb-6">
              <div className="text-4xl font-light mb-2">$73.71</div>
              <div className="text-sm text-gray-600">
                or 4 interest-free payments of $18.43 with{' '}
                <span className="font-semibold">afterpay</span>
              </div>
            </div>

            {/* Quantity and Buttons */}
            <div className="flex gap-4 mb-8">
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-4 py-3 border border-gray-300 text-center"
                min="1"
              />
              <button className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition">
                ADD TO CART
              </button>
              <button className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition flex items-center justify-center gap-2">
                INSTANT CHECKOUT ⚡
              </button>
            </div>

            {/* Medium Selection */}
            <div className="mb-6">
              <div className="border border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">1 Medium</span>
                </div>
                <select 
                  className="w-full p-3 border border-gray-300"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="hoodie">Hoodies (No Zip or Pullover)</option>
                  <option value="tshirt">T-Shirts</option>
                  <option value="tank">Tank Tops</option>
                </select>

                {/* Material Options */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {materials.map(material => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material.id)}
                      className={`p-3 border text-center text-xs ${
                        selectedMaterial === material.id 
                          ? 'border-gray-800 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-full aspect-square bg-gray-100 mb-2 rounded"></div>
                      <div>{material.name}</div>
                    </button>
                  ))}
                </div>

                {/* Product Type Grid */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {products.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`p-3 border text-center text-xs ${
                        selectedProduct === product.id 
                          ? 'border-gray-800 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">{product.icon}</div>
                      <div>{product.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customize Section */}
            <div className="border border-gray-300 p-4">
              <div className="flex justify-between items-center cursor-pointer">
                <span className="text-sm font-medium">2 Customize It</span>
                <span className="text-gray-400">▼</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Click Here to Close Options
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}