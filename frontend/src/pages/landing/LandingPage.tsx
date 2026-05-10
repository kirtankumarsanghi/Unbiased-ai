import CyberButton from "../../components/common/CyberButton";
import AuditTicker from "../../components/dashboard/AuditTicker";

const protocolCards = [
  {
    title: "Fairness Sentinel",
    detail: "Continuous demographic parity scans",
  },
  {
    title: "Explainability Core",
    detail: "SHAP-based feature attribution",
  },
  {
    title: "Intervention Grid",
    detail: "Automated mitigation pipelines",
  },
  {
    title: "Compliance Vault",
    detail: "Regulatory export certificates",
  },
];

const overviewItems = [
  "Demographic disparity detection",
  "Bias drift monitoring",
  "Cryptographic audit proofs",
  "Real-time telemetry streams",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#00dfc1,_transparent_55%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            EquiAudit AI Governance Platform
          </p>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-primary">
            Cybernetic fairness command center
          </h1>

          <p className="mt-6 max-w-2xl text-muted">
            Monitor high-stakes AI systems with continuous fairness
            telemetry, explainable AI audits, and automated intervention
            protocols built for regulators and enterprise operators.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <CyberButton>Enter Command Center</CyberButton>
            <CyberButton className="border-warning/60 text-warning bg-warning/10 hover:bg-warning/20">
              Request Demo
            </CyberButton>
          </div>

          <div className="mt-12">
            <AuditTicker />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold text-primary">
              Real-time AI accountability
            </h2>

            <p className="mt-4 text-muted">
              EquiAudit fuses fairness metrics, drift detection, SHAP
              explainability, and intervention orchestration into a
              single cyberpunk interface.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted">
              {overviewItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {protocolCards.map((card) => (
              <div
                key={card.title}
                className="bg-surface border border-border p-6"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-muted">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface border border-border p-6">
              <h3 className="text-lg font-semibold text-primary">
                Compliance-ready reporting
              </h3>
              <p className="mt-3 text-sm text-muted">
                Generate GDPR Article 22, EU AI Act, and EEOC audit
                exports with cryptographic verification.
              </p>
            </div>

            <div className="bg-surface border border-border p-6">
              <h3 className="text-lg font-semibold text-primary">
                Live telemetry streams
              </h3>
              <p className="mt-3 text-sm text-muted">
                Monitor fairness scores, drift alerts, and intervention
                outcomes in real time.
              </p>
            </div>

            <div className="bg-surface border border-border p-6">
              <h3 className="text-lg font-semibold text-primary">
                Automated mitigation
              </h3>
              <p className="mt-3 text-sm text-muted">
                Deploy reweighing, adversarial debiasing, and reject-option
                protocols with measurable gains.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Trusted by regulated enterprises
            </p>
            <div className="flex gap-6 text-sm text-muted">
              <span>Finance</span>
              <span>Healthcare</span>
              <span>Public Sector</span>
              <span>Legal</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
