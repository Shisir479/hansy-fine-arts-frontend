'use client';

import { IoCodeWorking } from 'react-icons/io5';
import { LuHeartHandshake } from 'react-icons/lu';
import { Si365Datascience } from 'react-icons/si';

const ArtMarketingConsulting: React.FC = () => {
  return (
    <div className="bg-white py-12 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-600 uppercase">
          Art Marketing Consulting
        </h2>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
          A Marketing Plan Based on What is Working Right Now,
          <br />
          Backed by Ongoing Consulting & Support
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <Si365Datascience className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            365-day Art Marketing Plan
          </h3>
          <p className="mt-2 text-base text-gray-600">
            What to post on social media, when to send emails, how to execute a
            holiday sale — we show you what to do every single day of the year.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <IoCodeWorking className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            A Ton of Work Done For You
          </h3>
          <p className="mt-2 text-base text-gray-600">
            Pre-made templates for social media, email marketing, and more all
            with pre-written content based on what is working right now.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-4">
            <LuHeartHandshake className="text-5xl" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            One-on-One Consulting
          </h3>
          <p className="mt-2 text-base text-gray-600">
            Weekly live video workshops where you can verbally ask any questions
            and get the help you need to keep your business moving.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtMarketingConsulting;
