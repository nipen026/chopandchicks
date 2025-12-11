export default function TermsOfUse() {
  return (
    <div className="container flex items-center justify-center">
      <div className=" rounded-xl p-8">
        
        <h1 className="text-4xl font-semibold text-center mb-8">Terms Of Use</h1>

        <div className="space-y-8 text-gray-800 text-lg">
          
          {/* 1 */}
          <div>
            <h2 className="font-semibold">1. Product Quality &amp; Sourcing</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>All meat and poultry must be fresh, safe for consumption, and sourced exclusively from certified and licensed suppliers.</li>
              <li>Vendors must maintain traceability records for each product batch supplied.</li>
            </ul>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-semibold">2. Prohibited Products</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Expired, stale, contaminated, or spoiled products will not be accepted under any circumstances.</li>
              <li>Chop &amp; Chicks reserves the right to reject or return such items immediately.</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-semibold">3. Hygiene &amp; Facility Standards</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>All handling, processing, and storage must occur in clean, sanitized environments that follow industry hygiene protocols.</li>
              <li>Regular pest control is mandatory at the vendor’s premises and must be documented.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-semibold">4. Delivery &amp; Temperature Compliance</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Deliveries must strictly adhere to the scheduled time slots.</li>
              <li>Perishable goods must be transported under prescribed temperature-controlled conditions.</li>
              <li>Any delays, quality concerns, or delivery discrepancies must be reported immediately and resolved at the vendor’s expense.</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-semibold">5. Inspection &amp; Audit Rights</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Chop &amp; Chicks reserves the right to inspect vendor premises and audit relevant records without prior notice.</li>
              <li>Vendors are expected to fully cooperate during all inspections, quality checks, and investigations.</li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-semibold">6. Regulatory Compliance</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Vendors must comply with all applicable local, state, and national laws and food safety regulations governing the sale and distribution of non-vegetarian products.</li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-semibold">7. Spoiled Goods &amp; Weight Accuracy</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>If products are found to be spoiled after inspection, they will be returned to the vendor.</li>
              <li>
                The vendor must ensure product weights are as committed; shortweights will be penalized or charged as per the market value.
              </li>
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-semibold">8. Consequences of Breach</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Any breach of these terms may result in immediate contract termination or permanent blacklisting.</li>
              <li>Vendors will be held accountable for any legal issues, health hazards, or customer complaints arising from non-compliance.</li>
            </ul>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-semibold">9. Liability &amp; Indemnification</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                The vendor agrees to indemnify and hold harmless Chop &amp; Chicks from any losses, damages, claims, or expenses resulting from negligence or violation of these terms.
              </li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-semibold">10. Termination Rights</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                Chop &amp; Chicks may terminate this agreement at any time if the vendor fails to meet the standards or obligations outlined herein.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
