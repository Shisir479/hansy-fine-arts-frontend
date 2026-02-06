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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left side - Text content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-xs tracking-[0.4em] text-gray-400 uppercase font-light">
                  Error 404
                </span>
              </div>

              <h1 className="text-7xl lg:text-8xl xl:text-9xl font-black leading-none">
                Page Not
                <br />
                <span className="text-gray-300">Found</span>
              </h1>

              The page you&apos;re looking for seems to have wandered off into the creative void.
            </div>

            <div className="flex flex-wrap gap-5 pt-6">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 bg-black text-white px-9 py-4 font-semibold text-base hover:bg-gray-800 transition-all duration-200"
              >
                <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform duration-200" />
                Return Home
              </Link>

              <button
                onClick={reset}
                className="inline-flex items-center gap-3 border-2 border-black text-black px-9 py-4 font-semibold text-base hover:bg-black hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>
          </div>

          {/* Right side - Image (static, no rotation) */}
          <div className="relative">
            <div className="relative w-full max-w-2xl mx-auto">
              <Image
                src="/Lonely404.gif"
                alt="404 Error"
                width={1024}
                height={768}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}