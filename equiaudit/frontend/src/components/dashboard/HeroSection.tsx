import CyberButton from "../common/CyberButton";
import AuditTicker from "./AuditTicker";
import { useNotificationStore } from "../../app/store/notification.store";

export default function HeroSection() {
  const push = useNotificationStore((state) => state.push);

  return (
    <section className="bg-surface border border-border p-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#00dfc1,_transparent_55%)]" />

      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          EquiAudit Live Governance Layer
        </p>

        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-primary">
          Real-time fairness command center
        </h1>

        <p className="mt-4 max-w-2xl text-muted">
          Monitor high-stakes AI models with live telemetry, fairness
          analytics, and automated mitigation protocols.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <CyberButton
            onClick={() =>
              push({
                title: "Audit Pipeline",
                message:
                  "Fairness audit job queued for primary model set.",
                severity: "info",
              })
            }
          >
            Launch Audit
          </CyberButton>
          <CyberButton
            className="border-warning/60 text-warning bg-warning/10 hover:bg-warning/20"
            onClick={() =>
              push({
                title: "Compliance Center",
                message:
                  "Opening compliance package workflow in next phase.",
                severity: "success",
              })
            }
          >
            View Compliance
          </CyberButton>
        </div>

        <div className="mt-10">
          <AuditTicker />
        </div>
      </div>
    </section>
  );
}
