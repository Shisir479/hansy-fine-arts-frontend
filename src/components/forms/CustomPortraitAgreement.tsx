'use client';

const CustomPortraitAgreement: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        How Our Custom Portrait Process Works
      </h1>
      <div className="h-96 overflow-y-auto p-4 bg-gray-50 border rounded-lg">
        <p className="text-lg text-gray-700 mb-4">
          We&apos;re excited to bring your memories to life through our custom
          paintings or charcoal artwork!
        </p>
        <h2 className="text-xl font-semibold mb-4">
          Here&apos;s how the process works:
        </h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Become a member (It&apos;s Free!)</strong>
            <ul className="list-disc list-inside pl-4">
              <li>
                To send us a photo of your custom artwork, you&apos;ll first need to
                become a member.
              </li>
              <li>
                Membership is free and helps us keep our platform safe and
                spam-free.
              </li>
              <li>
                Once you create your account, you&apos;ll unlock access to upload
                your photos and manage your orders.
              </li>
            </ul>
          </li>
          <li>
            <strong>Submit Your Photo</strong>
            <ul className="list-disc list-inside pl-4">
              <li>
                After logging into your account, you&apos;ll be able to upload the
                photo you want turned into a masterpiece.
              </li>
              <li>
                Please choose a high-quality image that clearly shows the
                subject.
              </li>
              <li>
                Keep in mind the background in your photo may not be replicated.
              </li>
            </ul>
          </li>
          <li>
            <strong>Review and Approval</strong>
            <p>
              Our team will review your submitted photo and reach out to discuss
              details such as size, medium (painting or charcoal), and pricing.
            </p>
          </li>
          <li>
            <strong>50% Deposit Required</strong>
            <p>
              Once we agree on the details, we&apos;ll ask for a 50% upfront deposit
              to begin working on your custom piece. This deposit secures your spot
              in our queue and allows us to start the creative process.
            </p>
          </li>
          <li>
            <strong>Artwork Creation</strong>
            <p>
              Our artists will bring your vision to life with care and precision.
              We take our time to ensure every detail is just right, so quality
              takes precedence over speed.
            </p>
          </li>
          <li>
            <strong>Final Payment and Delivery</strong>
            <p>
              Once the artwork is complete, you&apos;ll receive a preview of the
              finished piece. After the remaining balance is paid, your artwork
              will be carefully packaged and shipped to your address.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default CustomPortraitAgreement;
