// Adjusted import path to match the utility filename
"use client"
import { uploadToCloudinary } from "@/lib/utils/cloudniry";
import axios from "axios";
import React, { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
// Changed useLocation to useNavigate
import Swal from "sweetalert2";

// 1. Define the type for the component's state
interface FormDataState {
  name: string;
  address: string;
  phone: string;
  email: string;
  image: File | null;
}

const ArtCommissionAgreement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  // Initialize state with the defined interface
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    address: "",
    phone: "",
    email: "",
    image: null,
  });

  // 2. Type definition for input change handler (text inputs)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Type definition for file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    // Safely check if files exist before setting the file
    setFormData({ ...formData, [name]: files?.[0] || null });
  };

  const handleCheckboxChange = () => {
    setIsAccepted(!isAccepted);
  };

  // 4. Type definition for form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAccepted) {
      Swal.fire("Error", "You must accept the terms and conditions.", "error");
      return;
    }

    setLoading(true); // Start loading

    let photoURL: string | null = null;

    try {
      // Upload Image to Cloudinary
      if (formData.image) {
        // uploadToCloudinary returns Promise<string | null>
        photoURL = await uploadToCloudinary(formData.image);
      }

      if (!photoURL) {
        throw new Error("Image upload failed.");
      }

      // Prepare submission data
      const submissionData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        image: photoURL,
        termsAccepted: "yes",
      };

      // Send data to backend using Axios (using standard Next.js env variable)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-portrait`, // Adjusted ENV variable usage
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check response status
      if (response.status === 200) {
        Swal.fire("Success", "Your Portrait has been submitted!", "success");

        // Reset form
        setFormData({
          name: "",
          address: "",
          phone: "",
          email: "",
          image: null,
        });
        setIsAccepted(false);
        if (typeof window !== "undefined") {
          window.history.pushState(null, "", "/");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire("Error", "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-10 border border-gray-100">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 border-b pb-3">
        The Custom Portrait Agreement
      </h1>

      {/* Terms and Conditions */}
      <div className="h-64 overflow-y-auto p-4 border border-gray-300 rounded-md bg-gray-50 shadow-inner text-sm">
        <p className="mb-4 text-gray-700">
          This Art Commission Agreement (the “Agreement”) is made between
          <span className="font-bold text-gray-900">
            {" "}
            [Your Full Name/Business Name]
          </span>{" "}
          (“Artist”) and the individual commissioning the artwork (“Client”). By
          submitting this Agreement, the Client agrees to the following terms
          and conditions:
        </p>
        <ol className="list-decimal list-inside space-y-4">
          <li>
            <h2 className="font-bold text-base text-blue-600">
              1. Artistic Discretion
            </h2>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              <li>
                The Artist retains the right to accept or decline any design or
                picture submitted by the Client at their sole discretion.
              </li>
              <li>
                The Artist is under no obligation to create artwork from any
                design or picture provided by the Client.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">2. Timeline</h2>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              <li>
                If the Artist agrees to create the commissioned artwork, the
                estimated completion time is 2-3 months, depending on the
                Artist’s current workload and the complexity of the project.
              </li>
              <li>
                The Artist will notify the Client of any significant delays.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">3. Pricing</h2>
            <p className="text-gray-600">
              The price of the commissioned artwork will vary depending on the
              complexity of the subject. The Client and the Artist will agree
              upon the final price before the work begins.
            </p>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">
              4. Payment Terms
            </h2>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              <li>
                The Client is required to pay 50% of the agreed price upfront as
                a non-refundable deposit.
              </li>
              <li>
                The remaining 50% is due before the completed artwork is shipped
                or delivered.
              </li>
              <li>
                The Artist will provide the Client with a preview picture of the
                finished artwork. If the Client is not satisfied with the
                artwork based on the preview:
                <ul className="list-disc list-inside pl-8 mt-2">
                  <li>The Client is not obligated to pay the remaining 50%.</li>
                  <li>The upfront 50% deposit will not be refunded.</li>
                  <li>The Artist retains ownership of the artwork.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">
              5. No Refund Policy
            </h2>
            <p className="text-gray-600">
              The 50% upfront payment is non-refundable under any circumstances,
              including dissatisfaction with the preview.
            </p>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">6. Delivery</h2>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              <li>
                The completed artwork will be shipped or delivered to the Client
                after the final payment is received.
              </li>
              <li>
                Delivery costs, if applicable, will be the responsibility of the
                Client unless otherwise agreed upon.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">
              7. Copyright and Usage
            </h2>
            <ul className="list-disc list-inside pl-4 text-gray-600">
              <li>
                The Artist retains all copyright and intellectual property
                rights to the artwork, including the right to reproduce,
                publish, or sell the artwork unless otherwise agreed in writing.
              </li>
              <li>
                The Client may not reproduce or use the artwork for commercial
                purposes without explicit written permission from the Artist.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">
              8. Governing Law
            </h2>
            <p className="text-gray-600">
              This Agreement is governed by the laws of the
              <span className="font-bold text-gray-900">
                {" "}
                [Your Location, e.g., State of Texas]
              </span>
              .
            </p>
          </li>
          <li>
            <h2 className="font-bold text-base text-blue-600">
              9. Agreement Acceptance
            </h2>
            <p className="text-gray-600">
              By submitting this form, the Client acknowledges that they have
              read, understood, and agreed to the terms of this Agreement.
            </p>
          </li>
        </ol>
      </div>

      {/* Accept Terms */}
      <div className="mt-6 flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-600 rounded-md">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAccepted}
            onChange={handleCheckboxChange}
            className="h-5 w-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
          <span className="text-gray-800 font-semibold">
            I agree to the terms and conditions outlined above.
          </span>
        </label>
      </div>

      {/* Form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* Upload Photo */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Upload Reference Photo
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
              isAccepted
                ? "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                : "bg-gray-100 cursor-not-allowed file:bg-gray-200 file:text-gray-500"
            } transition duration-150`}
            disabled={!isAccepted || loading}
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-lg transition duration-200 ease-in-out shadow-lg flex items-center justify-center gap-2 ${
              isAccepted && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!isAccepted || loading}
          >
            {loading ? (
              <>
                <TbFidgetSpinner className="animate-spin w-5 h-5" />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit Your Commission Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArtCommissionAgreement;
