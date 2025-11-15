'use client';

import Image from 'next/image';

const NewNavbar: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0">
        <Image
          src="/gallery-banner.jpg"
          alt="Background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="relative z-10 text-white text-center py-10">
        <h1 className="text-5xl font-bold tracking-widest">FINE ART</h1>
        <p className="text-lg italic mt-2">Hans Yaeggy Fine Arts Gallery</p>
      </div>
    </div>
  );
};

export default NewNavbar;
