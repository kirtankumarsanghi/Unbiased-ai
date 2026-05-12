import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import CyberButton from "../../components/common/CyberButton";
import { publicIntelligenceApi } from "../../services/api/publicIntelligence.api";
import type { DecisionOption } from "../../services/api/publicIntelligence.api";

const starterOptions = [
  {
    name: "Option A",
    pros: ["Lower upfront cost", "Easy to start"],
    cons: ["Potential hidden long-term risk"],
    evidence_score: 0.74,
    risk_score: 0.41,
    long_term_score: 0.67,
  },
  {
    name: "Option B",
    pros: ["Higher long-term upside", "More durable choice"],
    cons: ["More expensive now"],
    evidence_score: 0.78,
    risk_score: 0.48,
    long_term_score: 0.81,
  },
];

export default function PublicIntelligencePage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("Should I switch to a higher-paying but riskier job?");
  const [optionsText, setOptionsText] = useState(JSON.stringify(starterOptions, null, 2));
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [contentText, setContentText] = useState(
    "This is shocking and everyone knows this policy will destroy the economy. They don't want you to know the truth."
  );
  const [newsTopic, setNewsTopic] = useState("AI regulation impact on startups");
  const [newsPerspectiveA, setNewsPerspectiveA] = useState("Regulation slows innovation by adding compliance overhead and reducing risk appetite.");
  const [newsPerspectiveB, setNewsPerspectiveB] = useState("Regulation builds trust and prevents harm, unlocking long-term adoption and stability.");
  const [careerLocation, setCareerLocation] = useState("global");
  const [careerBudget, setCareerBudget] = useState("15000");
  const [careerInterests, setCareerInterests] = useState("ai governance, policy, data ethics");
  const [careerSkills, setCareerSkills] = useState("python, analytics, compliance");
  const [careerGoals, setCareerGoals] = useState("impact, stability, growth");
  const [financialScenario, setFinancialScenario] = useState("Compare two insurance plans for long-term risk coverage.");
  const [financialOptionsText, setFinancialOptionsText] = useState(JSON.stringify(starterOptions, null, 2));
  const [financialError, setFinancialError] = useState<string | null>(null);
  const [purchaseCategory, setPurchaseCategory] = useState("Laptop");
  const [purchaseOptionsText, setPurchaseOptionsText] = useState(JSON.stringify(starterOptions, null, 2));
  const [purchasePriorities, setPurchasePriorities] = useState("battery life, repairability, value");
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const decisionMutation = useMutation({
    mutationFn: publicIntelligenceApi.runDecisionAssistant,
  });

  const biasMutation = useMutation({
    mutationFn: publicIntelligenceApi.runBiasDetector,
  });

  const debateMutation = useMutation({
    mutationFn: publicIntelligenceApi.runDebateAnalyzer,
  });

  const newsMutation = useMutation({
    mutationFn: publicIntelligenceApi.runNewsBalancer,
  });

  const careerMutation = useMutation({
    mutationFn: publicIntelligenceApi.runCareerEngine,
  });

  const financialMutation = useMutation({
    mutationFn: publicIntelligenceApi.runFinancialAssistant,
  });

  const purchaseMutation = useMutation({
    mutationFn: publicIntelligenceApi.runPurchaseEvaluator,
  });

  const historyQuery = useQuery({
    queryKey: ["public-intelligence-history"],
    queryFn: () => publicIntelligenceApi.getHistory(),
  });

  const parseOptions = (raw: string): { value: DecisionOption[]; error: string | null } => {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        throw new Error("Options must be an array");
      }
      return { value: parsed as DecisionOption[], error: null };
    } catch (error) {
      return {
        value: [],
        error:
          error instanceof Error
            ? error.message
            : "Invalid JSON format",
      };
    }
  };

  const onRunDecision = () => {
    const parsed = parseOptions(optionsText);
    if (parsed.error) {
      setOptionsError(parsed.error);
      return;
    }
    setOptionsError(null);
    decisionMutation.mutate({
      question,
      options: parsed.value,
    });
  };

  const onRunBias = () => biasMutation.mutate(contentText);
  const onRunDebate = () => debateMutation.mutate(contentText);
  const onRunNews = () =>
    newsMutation.mutate({
      topic: newsTopic,
      perspective_a: newsPerspectiveA,
      perspective_b: newsPerspectiveB,
    });
  const onRunCareer = () =>
    careerMutation.mutate({
      interests: careerInterests.split(",").map((item) => item.trim()).filter(Boolean),
      skills: careerSkills.split(",").map((item) => item.trim()).filter(Boolean),
      location: careerLocation,
      budget: Number(careerBudget || 0),
      goals: careerGoals.split(",").map((item) => item.trim()).filter(Boolean),
    });
  const onRunFinancial = () => {
    const parsed = parseOptions(financialOptionsText);
    if (parsed.error) {
      setFinancialError(parsed.error);
      return;
    }
    setFinancialError(null);
    financialMutation.mutate({
      scenario: financialScenario,
      options: parsed.value,
    });
  };
  const onRunPurchase = () => {
    const parsed = parseOptions(purchaseOptionsText);
    if (parsed.error) {
      setPurchaseError(parsed.error);
      return;
    }
    setPurchaseError(null);
    purchaseMutation.mutate({
      product_category: purchaseCategory,
      options: parsed.value,
      priorities: purchasePriorities.split(",").map((item) => item.trim()).filter(Boolean),
    });
  };

  const radarData = useMemo(() => {
    const decision = decisionMutation.data;
    if (!decision?.balanced_options?.[0]) {
      return [];
    }
    const top = decision.balanced_options[0];
    return [
      { metric: "Confidence", value: top.confidence * 100 },
      { metric: "Neutrality", value: top.neutrality * 100 },
      { metric: "Risk Control", value: (1 - top.risk) * 100 },
      { metric: "Evidence", value: top.composite_score * 100 },
    ];
  }, [decisionMutation.data]);

  const argumentData = useMemo(() => {
    const debate = debateMutation.data;
    if (!debate?.argument_breakdown) {
      return [];
    }
    return debate.argument_breakdown.map((item: { segment: string; score: number }) => ({
      segment: item.segment,
      score: Number((item.score * 100).toFixed(1)),
    }));
  }, [debateMutation.data]);

  return (
    <DashboardLayout>
      <PageContainer>
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <section className="border border-border bg-surface/80 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Public Human-Centered AI System</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-primary">Unbiased Decision Intelligence Assistant</h1>
          <p className="mt-3 text-sm text-muted max-w-3xl">
            Analyze decisions with transparent confidence scoring, manipulation detection, and uncertainty-aware reasoning.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Decision Assistant</h2>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
            />
            <textarea
              rows={10}
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-xs font-mono"
            />
            {optionsError && (
              <p className="text-xs text-error">{optionsError}</p>
            )}
            <CyberButton onClick={onRunDecision}>Run Balanced Analysis</CyberButton>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Confidence and Tradeoff Radar</h2>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#B6C2D9", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#6A7896", fontSize: 10 }} />
                  <Radar dataKey="value" stroke="#00DFC1" fill="#00DFC1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {decisionMutation.data?.recommendation && (
              <p className="text-sm text-muted">
                Recommendation: <span className="text-primary font-semibold">{decisionMutation.data.recommendation}</span>
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Social Bias Detector / Debate Analyzer</h2>
            <textarea
              rows={10}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
            />
            <div className="flex flex-wrap gap-3">
              <CyberButton onClick={onRunBias}>Detect Manipulation</CyberButton>
              <CyberButton onClick={onRunDebate}>Analyze Logic Quality</CyberButton>
            </div>
            {biasMutation.data && (
              <div className="text-sm text-muted space-y-1">
                <p>Manipulation Meter: {(biasMutation.data.manipulation_meter * 100).toFixed(1)}%</p>
                <p>Neutrality Score: {(biasMutation.data.neutrality_score * 100).toFixed(1)}%</p>
                <p>Factual Confidence: {(biasMutation.data.factual_confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Argument Quality Graph</h2>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={argumentData}>
                  <XAxis dataKey="segment" tick={{ fill: "#B6C2D9", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#B6C2D9", fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#00DFC1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">News Balancer</h2>
            <input
              value={newsTopic}
              onChange={(e) => setNewsTopic(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
            />
            <textarea
              rows={6}
              value={newsPerspectiveA}
              onChange={(e) => setNewsPerspectiveA(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
            />
            <textarea
              rows={6}
              value={newsPerspectiveB}
              onChange={(e) => setNewsPerspectiveB(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
            />
            <CyberButton onClick={onRunNews}>Balance Perspectives</CyberButton>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Neutrality Snapshot</h2>
            {newsMutation.data ? (
              <div className="text-sm text-muted space-y-2 mt-4">
                <p>Source Diversity: {(newsMutation.data.source_diversity_indicator * 100).toFixed(1)}%</p>
                <p>Neutrality Heat: {(newsMutation.data.neutrality_heatmap * 100).toFixed(1)}%</p>
                <p>Fact Density: {(newsMutation.data.facts_vs_opinion?.fact_density * 100).toFixed(1)}%</p>
              </div>
            ) : (
              <p className="text-sm text-muted mt-4">Run the balancer to view neutrality metrics.</p>
            )}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Career Decision Engine</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={careerLocation}
                onChange={(e) => setCareerLocation(e.target.value)}
                className="bg-background border border-border px-3 py-2 text-sm"
                placeholder="Location"
              />
              <input
                value={careerBudget}
                onChange={(e) => setCareerBudget(e.target.value)}
                className="bg-background border border-border px-3 py-2 text-sm"
                placeholder="Budget"
              />
            </div>
            <input
              value={careerInterests}
              onChange={(e) => setCareerInterests(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
              placeholder="Interests (comma-separated)"
            />
            <input
              value={careerSkills}
              onChange={(e) => setCareerSkills(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
              placeholder="Skills (comma-separated)"
            />
            <input
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
              placeholder="Goals (comma-separated)"
            />
            <CyberButton onClick={onRunCareer}>Generate Career Paths</CyberButton>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Career Path Suggestions</h2>
            {careerMutation.data ? (
              <div className="mt-4 space-y-3 text-sm text-muted">
                {(careerMutation.data.career_paths || []).map((path: { role: string; salary_band_usd: string; growth_potential: number }) => (
                  <div key={path.role} className="border border-border/60 bg-background/40 p-3">
                    <p className="text-primary font-semibold">{path.role}</p>
                    <p>Salary: {path.salary_band_usd}</p>
                    <p>Growth: {(path.growth_potential * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted mt-4">Run the engine to see recommended paths.</p>
            )}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Financial Decision Assistant</h2>
            <input
              value={financialScenario}
              onChange={(e) => setFinancialScenario(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
            />
            <textarea
              rows={8}
              value={financialOptionsText}
              onChange={(e) => setFinancialOptionsText(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-xs font-mono"
            />
            {financialError && <p className="text-xs text-error">{financialError}</p>}
            <CyberButton onClick={onRunFinancial}>Analyze Financial Options</CyberButton>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Financial Risk Radar</h2>
            {financialMutation.data ? (
              <div className="mt-4 space-y-2 text-sm text-muted">
                {(financialMutation.data.comparison || []).map((item: { name: string; net_score: number; risk_radar: number }) => (
                  <div key={item.name} className="flex items-center justify-between border border-border/60 px-3 py-2">
                    <span>{item.name}</span>
                    <span>Score {(item.net_score * 100).toFixed(0)}%</span>
                    <span>Risk {(item.risk_radar * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted mt-4">Run analysis to view financial tradeoffs.</p>
            )}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Smart Purchase System</h2>
            <input
              value={purchaseCategory}
              onChange={(e) => setPurchaseCategory(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
              placeholder="Product category"
            />
            <input
              value={purchasePriorities}
              onChange={(e) => setPurchasePriorities(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm"
              placeholder="Priorities (comma-separated)"
            />
            <textarea
              rows={8}
              value={purchaseOptionsText}
              onChange={(e) => setPurchaseOptionsText(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-xs font-mono"
            />
            {purchaseError && <p className="text-xs text-error">{purchaseError}</p>}
            <CyberButton onClick={onRunPurchase}>Compare Products</CyberButton>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Purchase Comparison</h2>
            {purchaseMutation.data ? (
              <div className="mt-4 space-y-2 text-sm text-muted">
                {(purchaseMutation.data.comparison || []).map((item: { name: string; value_for_money: number; hype_probability: number }) => (
                  <div key={item.name} className="flex items-center justify-between border border-border/60 px-3 py-2">
                    <span>{item.name}</span>
                    <span>Value {(item.value_for_money * 100).toFixed(0)}%</span>
                    <span>Hype {(item.hype_probability * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted mt-4">Run comparison to see value scores.</p>
            )}
          </div>
        </section>

        <section className="mt-8 border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-primary">Public Intelligence History</h2>
          {historyQuery.isLoading ? (
            <p className="text-sm text-muted mt-3">Loading history...</p>
          ) : historyQuery.isError ? (
            <p className="text-sm text-error mt-3">Unable to load history.</p>
          ) : (
            <div className="mt-4 space-y-3 text-sm text-muted">
              {(Array.isArray(historyQuery.data) ? historyQuery.data : []).slice(0, 8).map((item: { id: number; analysis_type: string; created_at: string | null }) => (
                <div key={item.id} className="flex items-center justify-between border border-border/60 px-3 py-2">
                  <span className="uppercase text-xs tracking-widest text-primary">{item.analysis_type}</span>
                  <span>{item.created_at || "--"}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </PageContainer>
    </DashboardLayout>
  );
}
