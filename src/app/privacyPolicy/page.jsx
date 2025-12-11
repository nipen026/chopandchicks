export default function PrivacyPolicy() {
  return (
    <div className="container flex items-center justify-center px-4 py-10">
      <div className=" rounded-xl p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Privacy Policy</h1>

        <ul className="text-gray-700 space-y-2">
          <li className="flex text-lg">
            <span className="mr-2">•</span>
            <div>
              <p className="mb-0" >Data Collection &amp; Use:</p> 
              We collect vendor information such as business details, licenses, contact information, and operational data solely for verification, compliance, and communication purposes.
            </div>
          </li>

          <li className="flex text-lg">
            <span className="mr-2">•</span>
            <div>
              <p>Data Confidentiality:</p> 
              All collected data will be stored securely and will not be shared with third parties without the vendor&apos;s explicit consent, except as required by law.
            </div>
          </li>

          <li className="flex text-lg">
            <span className="mr-2">•</span>
            <div>
              <p>Access &amp; Rights:</p>
              Vendors may request access to, or correction of, their stored data at any time by contacting our support team.
            </div>
          </li>

          <li className="flex text-lg">
            <span className="mr-2">•</span>
            <div>
              <p>Data Retention:</p> 
              Vendor data will be retained for the duration of the partnership and for a reasonable period thereafter for audit and legal purposes.
            </div>
          </li>

          <li className="flex text-lg">
            <span className="mr-2">•</span>
            <div>
              <p>Policy Updates:</p> 
              Chop &amp; Chicks reserves the right to update these policies from time to time. Vendors will be notified of any significant changes.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
