const CustomPortraitAgreement = () => {
  // const [termsAccepted, setTermsAccepted] = useState(false);

  // const handleCheckboxToggle = () => {
  //   setTermsAccepted(!termsAccepted);
  // };

  // const handleBecomeMember = () => {
  //   if (!termsAccepted) {
  //     alert("Please accept the terms and conditions before proceeding.");
  //   } else {
  //     alert("Thank you for becoming a member!");
  //     // Add navigation or API call logic here
  //   }
  // };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        How Our Custom Portrait Process Works
      </h1>
      <div className="h-96 overflow-y-auto p-4 bg-gray-50 border rounded-lg">
        <p className="text-lg text-gray-700 mb-4">
          We’re excited to bring your memories to life through our custom
          paintings or charcoal artwork!
        </p>
        <h2 className="text-xl font-semibold mb-4">
          Here’s how the process works:
        </h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Become a member (It’s Free!)</strong>
            <ul className="list-disc list-inside pl-4">
              <li>
                To send us a photo of your custom artwork, you’ll first need to
                become a member.
              </li>
              <li>
                Membership is free and helps us keep our platform safe and
                spam-free.
              </li>
              <li>
                Once you create your account, you’ll unlock access to upload
                your photos and manage your orders.
              </li>
            </ul>
          </li>
          <li>
            <strong>Submit Your Photo</strong>
            <ul className="list-disc list-inside pl-4">
              <li>
                After logging into your account, you’ll be able to upload the
                photo you want turned into a masterpiece.
              </li>
              <li>
                Please choose a high-quality image that clearly shows the
                subject.
              </li>
              <li>
                Keep in mind the background in your photo may not be replicated.
                As the artist, I often create custom backgrounds that complement
                the subject and add a unique touch.
              </li>
            </ul>
          </li>
          <li>
            <strong>Sign The Contract</strong>
            <p>
              Once your photo is submitted, we’ll ask you to sign a contract
              granting us the rights to create the artwork based on your image.
              This ensures we have permission to work on your photo and protects
              both parties.
            </p>
          </li>
          <li>
            <strong>Receive Your Quote</strong>
            <ul className="list-disc list-inside pl-4">
              <li>
                After analyzing your photo and understanding your preferences,
                I’ll send you a personalized Quote.
              </li>
              <li>
                Pricing depends on factors like: size, complexity, and medium
                (e.g., watercolor, charcoal).
              </li>
            </ul>
          </li>
          <li>
            <strong>Pay the Deposit</strong>
            <p>
              If you agree to the quote, you’ll be required to pay 50% upfront
              to begin the project. This secures your place in my schedule and
              allows me to start working on your custom piece.
            </p>
          </li>
          <li>
            <strong>Artwork Creation Timeline</strong>
            <p>
              Expect your beautiful piece of art to be delivered within 1-3
              months from the time we receive your deposit. I take pride in
              ensuring every detail is just right, so quality takes precedence
              over speed.
            </p>
          </li>
          <li>
            <strong>Final Payment and Delivery</strong>
            <p>
              Once the artwork is complete, you’ll receive a preview of the
              finished piece. After the remaining balance is paid, your artwork
              will be carefully packaged and shipped to your address.
            </p>
          </li>
        </ol>
        {/* <div className="mt-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={handleCheckboxToggle}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-gray-700">
              I agree to the terms and conditions.
            </span>
          </label>
        </div> */}
      </div>
      {/* <button
        onClick={handleBecomeMember}
        disabled={!termsAccepted}
        className={`mt-6 w-full py-3 text-white font-semibold rounded-lg ${
          termsAccepted ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
        }`}
      >
        Become a Member
      </button> */}
    </div>
  );
};

export default CustomPortraitAgreement;