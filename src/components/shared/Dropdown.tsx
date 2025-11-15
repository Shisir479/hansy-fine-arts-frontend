'use client';

import { useState } from 'react';
import Link from 'next/link';

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${isOpen ? 'open' : ''}`}
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
    >
      <div className="cursor-pointer font-semibold hover:text-[#b09f7b] transition-colors">
        SHOP ART
      </div>
      {isOpen && (
        <ul className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg w-52 p-2 z-50">
          <li>
            <Link 
              href="/gallery/contemporary" 
              onClick={closeDropdown}
              className="block px-4 py-2 hover:bg-[#b09f7b]/10 hover:text-[#b09f7b] rounded-md transition-colors"
            >
              Contemporary
            </Link>
          </li>
          <li>
            <Link 
              href="/gallery/abstract" 
              onClick={closeDropdown}
              className="block px-4 py-2 hover:bg-[#b09f7b]/10 hover:text-[#b09f7b] rounded-md transition-colors"
            >
              Abstract & Designs
            </Link>
          </li>
          <li>
            <Link 
              href="/custom-portrait" 
              onClick={closeDropdown}
              className="block px-4 py-2 hover:bg-[#b09f7b]/10 hover:text-[#b09f7b] rounded-md transition-colors"
            >
              Custom Portraits
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
