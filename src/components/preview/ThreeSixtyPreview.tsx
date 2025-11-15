'use client';

import dynamic from 'next/dynamic';

// Dynamically import react-360-view to avoid SSR issues
const ThreeSixty = dynamic(() => import('react-360-view'), { ssr: false });

const ThreeSixtyPreview: React.FC = () => {
  return (
    <div className="w-1/2">
      <ThreeSixty
        amount={36}
        imagePath="/cuadro-vertical-1/"
        fileName="cuadro-vertical-1_{index}.jpg?v1"
        autoplay
      />
    </div>
  );
};

export default ThreeSixtyPreview;
