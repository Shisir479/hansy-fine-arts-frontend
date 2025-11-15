'use client';

const ArtCommissionAgreement: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Art Commission Agreement
      </h1>
      <p className="mb-4">
        This Art Commission Agreement (the &quot;Agreement&quot;) is made between
        <span className="font-semibold"> Hans Yaeggy Fine Arts</span> (&quot;Artist&quot;) and the
        individual commissioning the artwork (&quot;Client&quot;). By signing this Agreement,
        the Client agrees to the following terms and conditions:
      </p>
      <ol className="list-decimal list-inside space-y-4">
        <li>
          <h2 className="font-semibold">Artistic Discretion</h2>
          <ul className="list-disc list-inside pl-4">
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
          <h2 className="font-semibold">Timeline</h2>
          <ul className="list-disc list-inside pl-4">
            <li>
              If the Artist agrees to create the commissioned artwork, the
              estimated completion time is 2-3 months, depending on the Artist&apos;s
              current workload and the complexity of the project.
            </li>
            <li>
              The Artist will notify the Client of any significant delays.
            </li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold">Pricing</h2>
          <p>
            The price of the commissioned artwork will vary depending on the
            complexity of the subject. The Client and the Artist will agree upon
            the final price before the work begins.
          </p>
        </li>
        <li>
          <h2 className="font-semibold">Payment Terms</h2>
          <ul className="list-disc list-inside pl-4">
            <li>
              The Client is required to pay 50% of the agreed price upfront as a
              non-refundable deposit.
            </li>
            <li>
              The remaining 50% is due before the completed artwork is shipped
              or delivered.
            </li>
            <li>
              The Artist will provide the Client with a preview picture of the
              finished artwork. If the Client is not satisfied with the artwork
              based on the preview:
              <ul className="list-disc list-inside pl-8">
                <li>The Client is not obligated to pay the remaining 50%.</li>
                <li>The upfront 50% deposit will not be refunded.</li>
                <li>The Artist retains ownership of the artwork.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold">No Refund Policy</h2>
          <p>
            The 50% upfront payment is non-refundable under any circumstances,
            including dissatisfaction with the preview.
          </p>
        </li>
        <li>
          <h2 className="font-semibold">Delivery</h2>
          <ul className="list-disc list-inside pl-4">
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
          <h2 className="font-semibold">Copyright and Usage</h2>
          <ul className="list-disc list-inside pl-4">
            <li>
              The Artist retains all copyright and intellectual property rights
              to the artwork, including the right to reproduce, publish, or sell
              reproductions.
            </li>
            <li>
              The Client may not reproduce, publish, or sell the artwork without
              written permission from the Artist.
            </li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold">Cancellation</h2>
          <p>
            Either party may cancel this Agreement at any time. However, the
            upfront 50% deposit is non-refundable.
          </p>
        </li>
        <li>
          <h2 className="font-semibold">Agreement Acknowledgment</h2>
          <p>
            By commissioning artwork, the Client acknowledges that they have
            read, understood, and agreed to all terms outlined in this Agreement.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default ArtCommissionAgreement;
