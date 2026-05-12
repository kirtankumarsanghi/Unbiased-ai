import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Activity, ShieldAlert, Cpu, Sparkles, AlertTriangle, CheckCircle2, TerminalSquare, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import CyberButton from "../../components/common/CyberButton";
import { explainabilityApi } from "../../services/api/explainability.api";

const starterFeatures = {
  age: 0.12,
  income: 0.41,
  credit_score: 0.33,
  tenure: 0.19,
};

// --- Animations ---
const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

export default function ExplainabilityPage() {
  const navigate = useNavigate();
  const [featuresText, setFeaturesText] = useState(JSON.stringify(starterFeatures, null, 2));
  const [baselineText, setBaselineText] = useState(JSON.stringify({ income: 0.25, tenure: 0.1 }, null, 2));
  const [weightsText, setWeightsText] = useState(JSON.stringify({ income: 1.3, credit_score: 1.1 }, null, 2));
  const [proxyText, setProxyText] = useState("race_indicator, zip_code, age_bucket");
  const [parseError, setParseError] = useState<string | null>(null);
  const [assistantQuestion, setAssistantQuestion] = useState("Explain in simple words why credit_score has a strong influence.");

  const shapMutation = useMutation({ mutationFn: explainabilityApi.runShap });
  const limeMutation = useMutation({ mutationFn: explainabilityApi.runLime });
  const counterfactualMutation = useMutation({ mutationFn: explainabilityApi.runCounterfactual });
  const proxyMutation = useMutation({ mutationFn: explainabilityApi.runProxyDetection });
  const assistantMutation = useMutation({ mutationFn: explainabilityApi.askExplainabilityAssistant });

  const parseJson = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") throw new Error("Payload must be an object");
      return { value: parsed, error: null };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : "Invalid JSON" };
    }
  };

  const runShap = () => {
    const features = parseJson(featuresText);
    const baseline = parseJson(baselineText);
    if (features.error || baseline.error) return setParseError(features.error || baseline.error);
    setParseError(null);
    shapMutation.mutate({ features: features.value, baseline: baseline.value, top_k: 5 });
  };

  const runLime = () => {
    const features = parseJson(featuresText);
    const weights = parseJson(weightsText);
    if (features.error || weights.error) return setParseError(features.error || weights.error);
    setParseError(null);
    limeMutation.mutate({ features: features.value, weights: weights.value, top_k: 5 });
  };

  const runCounterfactual = () => {
    const features = parseJson(featuresText);
    if (features.error) return setParseError(features.error);
    setParseError(null);
    counterfactualMutation.mutate({ features: features.value, top_k: 3 });
  };

  const runProxyDetection = () => {
    setParseError(null);
    proxyMutation.mutate({ features: proxyText.split(",").map((item) => item.trim()).filter(Boolean) });
  };
  const runAssistant = () => {
    assistantMutation.mutate({
      question: assistantQuestion,
      analysis_context: shapMutation.data || limeMutation.data || counterfactualMutation.data || {},
    });
  };

  const isAnyLoading = shapMutation.isPending || limeMutation.isPending || counterfactualMutation.isPending;
  const hasResults = shapMutation.data || limeMutation.data || counterfactualMutation.data;
  const analysisCommentary =
    shapMutation.data?.commentary ||
    limeMutation.data?.commentary ||
    counterfactualMutation.data?.commentary;

  return (
    <DashboardLayout>
      <PageContainer>
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="pb-12">
          
          {/* Header Section */}
          <motion.div variants={fadeUp} className="mb-8 relative">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-muted hover:text-text-primary transition-colors text-sm mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Command Center
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <Sparkles className="text-primary w-5 h-5" />
                  </div>
                  <h1 className="text-3xl font-bold text-text-primary tracking-tight">Explainability Studio</h1>
                </div>
                <p className="text-muted text-sm md:text-base max-w-2xl">
                  Deep-dive algorithmic analysis. Inject payloads to visualize SHAP values, LIME boundaries, and generative counterfactuals.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-surface-elevated border border-border px-4 py-2 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs uppercase tracking-widest text-text-secondary font-semibold">Engine Online</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Editor & Controls */}
            <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6">
              <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-premium">
                <div className="px-4 py-3 border-b border-border/50 bg-surface flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <TerminalSquare size={16} />
                    <span className="text-xs uppercase tracking-widest font-semibold">Payload Injector</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-border-light" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border-light" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border-light" />
                  </div>
                </div>
                
                <div className="p-5 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest text-muted font-semibold flex items-center gap-2">
                      <Cpu size={12} /> Target Features (JSON)
                    </label>
                    <textarea
                      rows={6}
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-lg px-4 py-3 text-sm font-mono text-text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none shadow-inner"
                      spellCheck="false"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-muted font-semibold">
                        SHAP Baseline
                      </label>
                      <textarea
                        rows={4}
                        value={baselineText}
                        onChange={(e) => setBaselineText(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-xs font-mono text-text-secondary focus:border-primary/50 outline-none transition-all resize-none"
                        spellCheck="false"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-muted font-semibold">
                        LIME Weights
                      </label>
                      <textarea
                        rows={4}
                        value={weightsText}
                        onChange={(e) => setWeightsText(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-xs font-mono text-text-secondary focus:border-primary/50 outline-none transition-all resize-none"
                        spellCheck="false"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {parseError && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-error/10 border border-error/20 rounded-lg p-3 flex items-start gap-2 text-error">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        <span className="text-xs font-medium">{parseError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <CyberButton onClick={runShap} disabled={shapMutation.isPending} className="w-full" size="sm">
                      {shapMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Run SHAP"}
                    </CyberButton>
                    <CyberButton onClick={runLime} disabled={limeMutation.isPending} variant="secondary" className="w-full" size="sm">
                      {limeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Run LIME"}
                    </CyberButton>
                    <CyberButton onClick={runCounterfactual} disabled={counterfactualMutation.isPending} variant="outline" className="w-full border-warning/40 text-warning hover:bg-warning/10 hover:text-warning" size="sm">
                      {counterfactualMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Counterfactual"}
                    </CyberButton>
                  </div>

                  <div className="space-y-3 border-t border-border/50 pt-4">
                    <label className="text-[11px] uppercase tracking-widest text-muted font-semibold">
                      Ask Explainability AI (Live)
                    </label>
                    <textarea
                      rows={3}
                      value={assistantQuestion}
                      onChange={(e) => setAssistantQuestion(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary/50 outline-none transition-all resize-none"
                    />
                    <CyberButton onClick={runAssistant} className="w-full" size="sm">
                      Ask for Explanation
                    </CyberButton>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Visualizer */}
            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6">
              <div className="bg-surface-elevated border border-border rounded-xl shadow-premium min-h-[450px] relative overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-surface/50 backdrop-blur-sm z-10">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-primary" />
                    <h3 className="font-semibold text-text-primary tracking-wide">Analysis Visualizer</h3>
                  </div>
                  {isAnyLoading && (
                    <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold">
                      <Loader2 size={14} className="animate-spin" /> Processing Matrix
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 relative z-0">
                  {!hasResults && !isAnyLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm">
                        <Zap size={24} className="text-muted opacity-50" />
                      </div>
                      <h4 className="text-text-primary font-medium mb-1">Awaiting Payload</h4>
                      <p className="text-sm text-muted max-w-sm">Inject a feature payload and execute an analysis module to visualize model behavior.</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {analysisCommentary && (
                      <div className="border border-border/60 bg-background/50 p-4 rounded-lg text-sm text-muted">
                        {analysisCommentary}
                      </div>
                    )}
                    {assistantMutation.data?.answer && (
                      <div className="border border-border/60 bg-background/50 p-4 rounded-lg text-sm text-muted space-y-2">
                        <p>{assistantMutation.data.answer}</p>
                        {assistantMutation.data.comment && <p className="text-xs">{assistantMutation.data.comment}</p>}
                      </div>
                    )}
                    {/* SHAP Results */}
                    {shapMutation.data?.top_features && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> SHAP Feature Impact
                        </h4>
                        <div className="bg-background rounded-lg border border-border/50 p-4 space-y-4">
                          {shapMutation.data.top_features.map((item: any, idx: number) => (
                            <div key={`shap-${idx}`} className="flex items-center gap-4">
                              <span className="w-32 font-mono text-xs text-text-secondary truncate">{item.feature}</span>
                              <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${Math.round(item.importance * 100)}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
                                />
                              </div>
                              <span className="w-12 text-right text-xs font-mono font-bold text-primary">
                                {(item.importance * 100).toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* LIME Results */}
                    {limeMutation.data?.top_features && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-secondary font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /> LIME Local Fidelity
                        </h4>
                        <div className="bg-background rounded-lg border border-border/50 p-4 space-y-4">
                          {limeMutation.data.top_features.map((item: any, idx: number) => (
                            <div key={`lime-${idx}`} className="flex items-center gap-4">
                              <span className="w-32 font-mono text-xs text-text-secondary truncate">{item.feature}</span>
                              <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden relative">
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${Math.round(item.importance * 100)}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-secondary/50 to-secondary rounded-full"
                                />
                              </div>
                              <span className="w-12 text-right text-xs font-mono font-bold text-secondary">
                                {(item.importance * 100).toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Counterfactual Results */}
                    {counterfactualMutation.data?.counterfactuals && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-warning font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Minimum Actionable Recourse
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {counterfactualMutation.data.counterfactuals.map((item: any, idx: number) => (
                            <motion.div 
                              key={`cf-${idx}`} 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                              className="bg-background border border-warning/20 p-4 rounded-lg flex flex-col gap-2"
                            >
                              <span className="text-xs font-mono text-text-secondary">{item.feature}</span>
                              <div className="flex items-center justify-between">
                                <span className="text-error font-mono font-bold">{item.current}</span>
                                <ArrowLeft size={14} className="text-muted rotate-180" />
                                <span className="text-success font-mono font-bold px-2 py-0.5 bg-success/10 rounded border border-success/20">{item.suggested}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Section: Governance / Proxy */}
          <motion.div variants={fadeUp} className="mt-8 border border-border bg-surface-elevated rounded-xl shadow-premium overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-border/50 bg-surface/50">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="text-error w-5 h-5" />
                  <h2 className="text-lg font-bold text-text-primary">Governance Scanner</h2>
                </div>
                <p className="text-sm text-muted mb-4">
                  Audit feature set against protected class dimensions to detect indirect proxy variables.
                </p>
                <div className="space-y-4">
                  <textarea
                    rows={3}
                    value={proxyText}
                    onChange={(e) => setProxyText(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary/50 outline-none transition-all resize-none"
                    spellCheck="false"
                  />
                  <CyberButton onClick={runProxyDetection} disabled={proxyMutation.isPending} variant="danger" className="w-full" size="sm">
                    {proxyMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Run Compliance Scan"}
                  </CyberButton>
                </div>
              </div>

              <div className="col-span-2 p-6 flex flex-col justify-center">
                {proxyMutation.data ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    {proxyMutation.data.commentary && (
                      <div className="border border-border/60 bg-background/50 p-4 rounded-lg text-sm text-muted">
                        {proxyMutation.data.commentary}
                      </div>
                    )}
                    <div>
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-text-secondary font-bold">Overall Risk Index</span>
                        <span className={`text-2xl font-bold font-mono ${
                          proxyMutation.data.risk_score > 0.6 ? "text-error" : proxyMutation.data.risk_score > 0.3 ? "text-warning" : "text-success"
                        }`}>
                          {(proxyMutation.data.risk_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(proxyMutation.data.risk_score * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            proxyMutation.data.risk_score > 0.6 ? "bg-error" : proxyMutation.data.risk_score > 0.3 ? "bg-warning" : "bg-success"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(proxyMutation.data.flagged || []).map((item: any, idx: number) => (
                        <div key={`proxy-${idx}`} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                          <span className="font-mono text-sm text-text-primary">{item.feature}</span>
                          <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold border ${
                            item.risk === "high" ? "bg-error/10 text-error border-error/20" : item.risk === "medium" ? "bg-warning/10 text-warning border-warning/20" : "bg-success/10 text-success border-success/20"
                          }`}>
                            {item.risk} Risk
                          </span>
                        </div>
                      ))}
                      {(proxyMutation.data.flagged || []).length === 0 && (
                        <div className="col-span-2 flex items-center justify-center p-4 border border-success/20 bg-success/5 rounded-lg text-success gap-2">
                          <CheckCircle2 size={16} />
                          <span className="text-sm font-medium">Compliance verified. No proxy features detected.</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : proxyMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted gap-3">
                    <Loader2 size={24} className="animate-spin text-error" />
                    <span className="text-sm">Scanning dimensional matrices...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted gap-3 opacity-60">
                    <Target size={32} strokeWidth={1.5} />
                    <span className="text-sm">Initiate scan to view compliance report.</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
        </motion.div>
      </PageContainer>
    </DashboardLayout>
  );
}
