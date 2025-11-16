'use client';

import { useState } from 'react';
import { Metadata } from 'next';

const colors = [
  'black',
  'green-700',
  'red-500',
  'yellow-400',
  'white',
  'lime-400',
];
const materials = ['Glass', 'Metal', 'Paper', 'Wood'];
const sizes = ['2XL', 'XL', 'L', 'M', 'S', 'XS'];
const deliveries = ['1-3 Business Days', '5-7 Business Days', '24 Hours'];

export default function FileUploadPage() {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');

  const handleClearSelection = () => {
    setSelectedColor('');
    setSelectedSize('');
    setSelectedMaterial('');
    setSelectedDelivery('');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">STEP 1</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input type="file" className="w-full text-gray-700" />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">STEP 2</h2>
        <div className="flex space-x-4">
          {colors.map((color) => (
            <div
              key={color}
              className={`w-12 h-12 rounded-full bg-${color} border-2 border-gray-300 cursor-pointer ${
                selectedColor === color ? 'border-blue-500' : ''
              }`}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && <span className="text-white">✓</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">STEP 3</h2>
        <select
          className="w-full border border-gray-300 rounded-lg p-2"
          value={selectedDelivery}
          onChange={(e) => setSelectedDelivery(e.target.value)}
        >
          <option value="">Choose an option</option>
          {deliveries.map((delivery) => (
            <option key={delivery} value={delivery}>
              {delivery}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">STEP 4</h2>
        <div className="flex space-x-4">
          {materials.map((material) => (
            <div
              key={material}
              className={`w-20 h-20 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer ${
                selectedMaterial === material ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setSelectedMaterial(material)}
            >
              <span className="text-sm font-medium text-gray-700">
                {material}
              </span>
              {selectedMaterial === material && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">STEP 5</h2>
        <div className="flex space-x-2">
          {sizes.map((size) => (
            <div
              key={size}
              className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg cursor-pointer ${
                selectedSize === size ? 'border-blue-500' : ''
              }`}
              onClick={() => setSelectedSize(size)}
            >
              <span className="text-sm font-medium text-gray-700">{size}</span>
              {selectedSize === size && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
            onClick={handleClearSelection}
          >
            Clear selection
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded">
            Confirm order
          </button>
        </div>
      </div>
    </div>
  );
}
