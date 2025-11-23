"use client"
import React, { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";

const ArtistCommissionAgreement = () => {
  const [loading, setLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    image: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files?.[0] || null });
  };

  const handleCheckboxChange = () => {
    setIsAccepted(!isAccepted);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Your Portrait has been submitted!");
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        image: null,
      });
      setIsAccepted(false);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white mt-10 mb-10 border-t-2 border-black">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-px h-12 bg-black mx-auto mb-4"></div>
        <h1 className="text-3xl italic text-black mb-4 tracking-tight">
          COMMISSION AGREEMENT
        </h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-px bg-black"></div>
          <div className="w-2 h-2 bg-black rotate-45"></div>
          <div className="w-16 h-px bg-black"></div>
        </div>
        <p className="text-gray-600 text-sm font-light">
          Please review all terms carefully before proceeding
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="h-64 overflow-y-auto p-4 border border-black bg-white shadow-inner mb-8">
        <p className="mb-4 text-gray-700 text-sm leading-relaxed">
          This Art Commission Agreement (the &ldquo;Agreement&rdquo;) is made between
          <span className="font-bold text-black">
            {" "}
            [Your Full Name/Business Name]
          </span>{" "}
          (&ldquo;Artist&rdquo;) and the individual commissioning the artwork (&ldquo;Client&rdquo;). By
          submitting this Agreement, the Client agrees to the following terms
          and conditions:
        </p>
        <ol className="list-none space-y-6">
          {/* 1. Artistic Discretion */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              1.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Artistic Discretion
              </h2>
              <ul className="list-none mt-2 text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Artist retains the right to accept or decline any design
                    or picture submitted by the Client at their sole discretion.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Artist is under no obligation to create artwork from any
                    design or picture provided by the Client.
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* 2. Timeline */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              2.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Timeline
              </h2>
              <ul className="list-none mt-2 text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    If the Artist agrees to create the commissioned artwork, the
                    estimated completion time is 2-3 months, depending on the
                    Artist&apos;s current workload and the complexity of the project.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Artist will notify the Client of any significant delays.
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* 3. Pricing */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              3.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Pricing
              </h2>
              <p className="text-gray-700 mt-2 leading-relaxed text-sm">
                The price of the commissioned artwork will vary depending on the
                complexity of the subject. The Client and the Artist will agree
                upon the final price before the work begins.
              </p>
            </div>
          </li>

          {/* 4. Payment Terms */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              4.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Payment Terms
              </h2>
              <ul className="list-none mt-2 text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Client is required to pay 50% of the agreed price upfront
                    as a non-refundable deposit.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The remaining 50% is due before the completed artwork is
                    shipped or delivered.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Artist will provide the Client with a preview picture of
                    the finished artwork. If the Client is not satisfied with the
                    artwork based on the preview:
                    <ul className="list-none mt-2 space-y-1 pl-4 text-gray-700">
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span>The Client is not obligated to pay the remaining 50%.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span>The upfront 50% deposit will not be refunded.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span>The Artist retains ownership of the artwork.</span>
                      </li>
                    </ul>
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* 5. No Refund Policy */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              5.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                No Refund Policy
              </h2>
              <p className="text-gray-700 mt-2 leading-relaxed text-sm">
                The 50% upfront payment is non-refundable under any
                circumstances, including dissatisfaction with the preview.
              </p>
            </div>
          </li>

          {/* 6. Delivery */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              6.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Delivery
              </h2>
              <ul className="list-none mt-2 text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The completed artwork will be shipped or delivered to the
                    Client after the final payment is received.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    Delivery costs, if applicable, will be the responsibility of
                    the Client unless otherwise agreed upon.
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* 7. Copyright and Usage */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              7.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Copyright and Usage
              </h2>
              <ul className="list-none mt-2 text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Artist retains all copyright and intellectual property
                    rights to the artwork, including the right to reproduce,
                    publish, or sell the artwork unless otherwise agreed in
                    writing.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">—</span>
                  <span>
                    The Client may not reproduce or use the artwork for commercial
                    purposes without explicit written permission from the Artist.
                  </span>
                </li>
              </ul>
            </div>
          </li>

          {/* 8. Governing Law */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              8.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Governing Law
              </h2>
              <p className="text-gray-700 mt-2 leading-relaxed text-sm">
                This Agreement is governed by the laws of the
                <span className="font-bold text-black">
                  {" "}
                  [Your Location, e.g., State of Texas]
                </span>
                .
              </p>
            </div>
          </li>

          {/* 9. Agreement Acceptance */}
          <li className="flex border-l border-black pl-4">
            <span className="font-bold text-base text-black w-8 text-left shrink-0">
              9.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black inline font-serif">
                Agreement Acceptance
              </h2>
              <p className="text-gray-700 mt-2 leading-relaxed text-sm">
                By submitting this form, the Client acknowledges that they have
                read, understood, and agreed to the terms of this Agreement.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Accept Terms */}
      <div className="mb-12 md:p-5 p-2 bg-white border-l border-black">
        <label className="flex items-center space-x-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={isAccepted}
            onChange={handleCheckboxChange}
            className="h-5 w-5 border border-black bg-white checked:bg-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-black text-xl font-serif group-hover:opacity-70 transition-opacity">
            I agree to the terms and conditions outlined above
          </span>
        </label>
      </div>

      {/* Form Fields */}
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Name */}
          <div>
            <label className="block font-serif text-black text-xl mb-3">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-black md:p-3 p-2 focus:border-gray-600 focus:outline-none transition-colors bg-white text-black text-lg"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-serif text-black text-xl mb-3">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-black md:p-3 p-2 focus:border-gray-600 focus:outline-none transition-colors bg-white text-black text-lg"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block font-serif text-black text-xl mb-3">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border border-black md:p-3 p-2 focus:border-gray-600 focus:outline-none transition-colors bg-white text-black text-lg"
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-serif text-black text-xl mb-3">
            Delivery Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-black md:p-3 p-2 focus:border-gray-600 focus:outline-none transition-colors bg-white text-black text-lg"
            placeholder="Your full address"
            required
          />
        </div>

        {/* Upload Photo */}
        <div>
          <label className="block font-serif text-black text-xl mb-3">
            Reference Photo
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border md:p-3 p-2 file:mr-4 file:py-1 file:px-5 file:border file:font-serif file:text-lg ${
              isAccepted
                ? "border-black file:border-black file:bg-black file:text-white hover:file:bg-white hover:file:text-black cursor-pointer"
                : "border-gray-300 bg-gray-100 cursor-not-allowed file:border-gray-300 file:bg-gray-300 file:text-gray-500"
            } transition-colors`}
            disabled={!isAccepted || loading}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="">
          <button
            onClick={handleSubmit}
            className={` w-7/12 mx-auto md:py-3 md:px-3 py-1 px-2 font-serif md:text-lg text-[14px] transition-all duration-300 shadow-xl flex items-center justify-center gap-4 border ${
              isAccepted && !loading
                ? "bg-black text-white border-black hover:bg-white hover:text-black"
                : "bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed"
            }`}
            disabled={!isAccepted || loading}
          >
            {loading ? (
              <>
                <TbFidgetSpinner className="animate-spin w-7 h-7" />
                <span>SUBMITTING REQUEST...</span>
              </>
            ) : (
              "SUBMIT COMMISSION REQUEST"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCommissionAgreement;