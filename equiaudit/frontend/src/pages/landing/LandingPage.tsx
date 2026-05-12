import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Brain,
  Gauge,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Lock,
  Orbit,
  Zap,
  Globe,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Real-Time Fairness Audits",
    detail:
      "Continuous demographic parity scans with drift detection and automated threshold alerts across all production models.",
    color: "from-emerald-400 to-cyan-400",
  },
  {
    icon: Brain,
    title: "Explainability Engine",
    detail:
      "SHAP, LIME, and counterfactual analysis to understand exactly why your AI makes specific decisions.",
    color: "from-cyan-400 to-blue-400",
  },
  {
    icon: Sparkles,
    title: "Bias Detection & Mitigation",
    detail:
      "Automated reweighing, adversarial debiasing, and reject-option protocols with measurable fairness gains.",
    color: "from-blue-400 to-violet-400",
  },
  {
    icon: BarChart3,
    title: "Decision Intelligence",
    detail:
      "Unbiased decision support for career, financial, and purchase decisions with manipulation detection.",
    color: "from-violet-400 to-pink-400",
  },
  {
    icon: Lock,
    title: "Compliance & Governance",
    detail:
      "GDPR Article 22, EU AI Act, and EEOC audit exports with cryptographic verification and tamper-proof logs.",
    color: "from-pink-400 to-orange-400",
  },
  {
    icon: Orbit,
    title: "Intervention Pipelines",
    detail:
      "Deploy and track fairness interventions with real-time impact measurement and rollback capabilities.",
    color: "from-orange-400 to-yellow-400",
  },
];

const stats = [
  { value: "128+", label: "Models Tracked", icon: Brain },
  { value: "99.7%", label: "Uptime SLA", icon: Zap },
  { value: "42", label: "Live Audit Streams", icon: Gauge },
  { value: "0.93", label: "Avg Fairness Index", icon: ShieldCheck },
];

const industries = [
  { name: "Financial Services", icon: BarChart3 },
  { name: "Healthcare AI", icon: ShieldCheck },
  { name: "Public Sector", icon: Globe },
  { name: "Legal & Compliance", icon: Lock },
  { name: "HR & Recruitment", icon: Users },
  { name: "Insurance", icon: Gauge },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-sm flex items-center justify-center">
              <ShieldCheck size={18} className="text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Unbiased</span>{" "}
              <span className="text-text-primary">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#industries" className="hover:text-primary transition-colors">
              Industries
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-muted hover:text-primary transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm bg-primary text-background px-5 py-2 font-semibold hover:bg-primary-dark transition-colors rounded-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,136,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-sm mb-8">
              <Zap size={12} />
              AI Fairness & Decision Intelligence Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Build trustworthy AI
              <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                with confidence
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
              The complete platform for AI accountability — detect bias, explain
              decisions, enforce fairness, and govern production models with
              real-time telemetry. For both enterprises and everyday people.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2 bg-primary text-background px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-primary-dark transition-all hover:shadow-glow rounded-sm"
              >
                Start Free
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 border border-border text-text-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-all rounded-sm"
              >
                Sign In to Dashboard
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="border border-border/60 bg-surface/50 backdrop-blur-sm p-5 hover:border-primary/40 transition-all group rounded-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      size={14}
                      className="text-muted group-hover:text-primary transition-colors"
                    />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border/40 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Platform Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need for{" "}
              <span className="text-primary">AI governance</span>
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto text-lg">
              From bias detection to intervention deployment — a complete
              toolkit for responsible AI at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group border border-border/60 bg-surface/60 backdrop-blur-sm p-7 hover:border-primary/40 transition-all duration-300 rounded-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-sm bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 opacity-80 group-hover:opacity-100 transition-opacity`}
                  >
                    <Icon size={20} className="text-background" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {feature.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Three steps to{" "}
              <span className="text-primary">fair AI</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Models",
                description:
                  "Register your AI models, upload datasets, and configure fairness thresholds. Our platform auto-detects protected attributes and bias vectors.",
              },
              {
                step: "02",
                title: "Audit & Analyze",
                description:
                  "Run comprehensive fairness audits with SHAP explainability, demographic parity analysis, and proxy feature detection — all in real time.",
              },
              {
                step: "03",
                title: "Intervene & Monitor",
                description:
                  "Deploy automated mitigation strategies, track improvement metrics, and generate compliance-ready reports with cryptographic verification.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative border border-border/60 bg-surface/40 p-8 hover:border-primary/30 transition-all rounded-sm"
              >
                <div className="text-6xl font-black text-primary/10 absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 border border-primary/40 bg-primary/10 text-primary text-sm font-bold rounded-sm mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Ecosystem Section */}
      <section className="border-t border-border/40 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="border border-border/60 bg-surface/60 p-10 rounded-sm hover:border-primary/30 transition-colors">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 mb-6 rounded-sm">
                <Users size={12} />
                For People
              </div>
              <h3 className="text-2xl font-bold">
                Public Decision Intelligence
              </h3>
              <p className="mt-4 text-muted leading-relaxed">
                Make unbiased decisions in your daily life. Detect manipulation
                in news, evaluate career options, compare financial products,
                and analyze debates — all powered by transparent AI scoring.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {[
                  "Smart Decision Assistant with confidence scoring",
                  "Social bias & manipulation detector",
                  "Balanced news perspective analyzer",
                  "Career path and financial comparison tools",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ChevronRight
                      size={14}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className="mt-8 flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
              >
                Try It Free <ArrowRight size={14} />
              </button>
            </div>

            <div className="border border-border/60 bg-surface/60 p-10 rounded-sm hover:border-secondary/30 transition-colors">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1.5 mb-6 rounded-sm">
                <ShieldCheck size={12} />
                For Enterprises
              </div>
              <h3 className="text-2xl font-bold">
                AI Governance Platform
              </h3>
              <p className="mt-4 text-muted leading-relaxed">
                End-to-end fairness monitoring for production AI systems.
                Continuous auditing, explainability, automated interventions,
                and regulatory compliance — built for regulated industries.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {[
                  "Production model fairness monitoring",
                  "SHAP/LIME explainability engine",
                  "Automated mitigation pipelines",
                  "Compliance exports (GDPR, EU AI Act, EEOC)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ChevronRight
                      size={14}
                      className="text-secondary mt-0.5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/login")}
                className="mt-8 flex items-center gap-2 text-secondary text-sm font-semibold hover:gap-3 transition-all"
              >
                Enter Dashboard <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Trusted Across Industries
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Built for{" "}
              <span className="text-primary">regulated sectors</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="border border-border/50 bg-surface/40 p-5 text-center hover:border-primary/40 hover:bg-primary/5 transition-all rounded-sm"
                >
                  <Icon
                    size={24}
                    className="text-muted mx-auto mb-3"
                  />
                  <p className="text-xs uppercase tracking-wider text-muted">
                    {industry.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-surface/30">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to build{" "}
            <span className="text-primary">fair AI</span>?
          </h2>
          <p className="mt-6 text-lg text-muted max-w-xl mx-auto">
            Join the platform that makes AI accountability accessible to
            everyone — from individual decisions to enterprise governance.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-2 bg-primary text-background px-10 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-primary-dark transition-all hover:shadow-glow rounded-sm"
            >
              Create Free Account
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-border text-text-primary px-10 py-4 text-sm font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-all rounded-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <ShieldCheck size={16} className="text-primary" />
            <span>
              © {new Date().getFullYear()} Unbiased AI. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-xs uppercase tracking-wider text-muted">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="hover:text-primary transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
