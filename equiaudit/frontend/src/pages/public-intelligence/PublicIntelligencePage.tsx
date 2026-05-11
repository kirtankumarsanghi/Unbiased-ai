import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import CyberButton from "../../components/common/CyberButton";
import { publicIntelligenceApi } from "../../services/api/publicIntelligence.api";

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
  const [question, setQuestion] = useState("Should I switch to a higher-paying but riskier job?");
  const [optionsText, setOptionsText] = useState(JSON.stringify(starterOptions, null, 2));
  const [contentText, setContentText] = useState(
    "This is shocking and everyone knows this policy will destroy the economy. They don't want you to know the truth."
  );

  const decisionMutation = useMutation({
    mutationFn: publicIntelligenceApi.runDecisionAssistant,
  });

  const biasMutation = useMutation({
    mutationFn: publicIntelligenceApi.runBiasDetector,
  });

  const debateMutation = useMutation({
    mutationFn: publicIntelligenceApi.runDebateAnalyzer,
  });

  const onRunDecision = () => {
    const parsed = JSON.parse(optionsText);
    decisionMutation.mutate({
      question,
      options: parsed,
    });
  };

  const onRunBias = () => biasMutation.mutate(contentText);
  const onRunDebate = () => debateMutation.mutate(contentText);

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
      </PageContainer>
    </DashboardLayout>
  );
}
