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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left side - Text content */}
          <div className="space-y-8 order-2 md:order-1">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm tracking-[0.3em] text-neutral-500 uppercase font-light">
                  Error 404
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                Page Not
                <br />
                <span className="text-neutral-600">Found</span>
              </h1>

              The page you&apos;re looking for seems to have wandered off into the creative void.
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-semibold hover:bg-neutral-200 transition-all duration-300"
              >
                <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
                Return Home
              </Link>

              <button
                onClick={reset}
                className="inline-flex items-center gap-3 border-2 border-white px-8 py-4 font-semibold hover:bg-white hover:text-black transition-all duration-300"
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

          {/* Right side - Image */}
          <div className="order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative overflow-hidden">
                <Image
                  src="/404.gif"
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
    </div>
  );
}