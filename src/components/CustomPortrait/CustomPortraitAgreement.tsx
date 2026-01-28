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
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-black mt-10 mb-10 border-t-2 border-black dark:border-white transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-px h-12 bg-black dark:bg-white mx-auto mb-4"></div>
        <h1 className="text-3xl italic text-black dark:text-white mb-4 tracking-tight">
          COMMISSION AGREEMENT
        </h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-px bg-black dark:bg-white"></div>
          <div className="w-2 h-2 bg-black dark:bg-white rotate-45"></div>
          <div className="w-16 h-px bg-black dark:bg-white"></div>
        </div>
        <p className="text-gray-600 dark:text-zinc-400 text-sm font-light">
          Please review all terms carefully before proceeding
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="h-64 overflow-y-auto p-4 border border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-inner mb-8">
        <p className="mb-4 text-gray-700 dark:text-zinc-300 text-sm leading-relaxed">
          This Art Commission Agreement (the &ldquo;Agreement&rdquo;) is made between
          <span className="font-bold text-black dark:text-white">
            {" "}
            [Your Full Name/Business Name]
          </span>{" "}
          (&ldquo;Artist&rdquo;) and the individual commissioning the artwork (&ldquo;Client&rdquo;). By
          submitting this Agreement, the Client agrees to the following terms
          and conditions:
        </p>
        <ol className="list-none space-y-6">
          {/* 1. Artistic Discretion */}
          <li className="flex border-l border-black dark:border-white pl-4">
            <span className="font-bold text-base text-black dark:text-white w-8 text-left shrink-0">
              1.
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-base text-black dark:text-white inline font-serif">
                Artistic Discretion
              </h2>
              <ul className="list-none mt-2 text-gray-700 dark:text-zinc-300 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white mt-1">—</span>
                  <span>
                    The Artist retains the right to accept or decline any design
                    or picture submitted by the Client at their sole discretion.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white mt-1">—</span>
                  <span>
                    The Artist is under no obligation to create artwork from any
                    design or picture provided by the Client.
                  </span>
                </li>
              </ul>
            </div>
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
      </div>
    </div>
  );
};

export default CustomPortraitAgreement;