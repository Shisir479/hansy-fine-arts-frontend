'use client';

import { BiSolidDiscount } from 'react-icons/bi';
import { FaServicestack } from 'react-icons/fa6';
import { GrCertificate } from 'react-icons/gr';
import { IoShirtOutline } from 'react-icons/io5';

const PrintOnDemandFeatures: React.FC = () => {
  return (
    <div className="bg-white py-12 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-600 uppercase">
          Print-On-Demand
        </h2>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
          Automated Fine Art Print Fulfillment
          <br />
          (The Way it Should Be)
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <GrCertificate className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            World-Class Fine Art
          </h3>
          <p className="mt-2 text-base text-gray-600">
            First-class fine art print quality on archival-certified paper,
            canvas, metal, acrylic and more
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <IoShirtOutline className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            Merchandise
          </h3>
          <p className="mt-2 text-base text-gray-600">
            Calendars, puzzles, coasters, t-shirts, totes, bags, phone cases,
            mugs, and more
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <BiSolidDiscount className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            Exclusive Pricing & Discounts
          </h3>
          <p className="mt-2 text-base text-gray-600">
            Our negotiation process gets you better pricing on printing and
            shipping from world-class vendors
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <FaServicestack className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            First-Class Service
          </h3>
          <p className="mt-2 text-base text-gray-600">
            Your orders arrive in style with your logo on the packaging. Print
            or shipping issues? We&apos;ll handle it
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintOnDemandFeatures;
