'use client';

import Link from 'next/link';
import { FaArrowLeftLong } from 'react-icons/fa6';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <div className="max-w-[1024px] h-full mx-auto">
        <Image
          className="w-full h-full"
          src="/404.gif"
          alt="error"
          width={1024}
          height={768}
          priority
        />
      </div>
      <div className="flex gap-4">
        <Link
          href="/"
          className="btn bg-[#9538E2] text-white text-xl font-bold hover:text-[#00be6c]"
        >
          <FaArrowLeftLong /> Return Home
        </Link>
        <button
          onClick={reset}
          className="btn bg-blue-500 text-white text-xl font-bold hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
