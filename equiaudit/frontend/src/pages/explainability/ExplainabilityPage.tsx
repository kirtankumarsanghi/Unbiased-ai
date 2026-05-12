import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";
import CyberButton from "../../components/common/CyberButton";
import { explainabilityApi } from "../../services/api/explainability.api";

const starterFeatures = {
  age: 0.12,
  income: 0.41,
  credit_score: 0.33,
  tenure: 0.19,
};

export default function ExplainabilityPage() {
  const navigate = useNavigate();
  const [featuresText, setFeaturesText] = useState(
    JSON.stringify(starterFeatures, null, 2),
  );
  const [baselineText, setBaselineText] = useState(
    JSON.stringify({ income: 0.25, tenure: 0.1 }, null, 2),
  );
  const [weightsText, setWeightsText] = useState(
    JSON.stringify({ income: 1.3, credit_score: 1.1 }, null, 2),
  );
  const [proxyText, setProxyText] = useState(
    "race_indicator, zip_code, age_bucket",
  );
  const [parseError, setParseError] = useState<string | null>(null);

  const shapMutation = useMutation({
    mutationFn: explainabilityApi.runShap,
  });
  const limeMutation = useMutation({
    mutationFn: explainabilityApi.runLime,
  });
  const counterfactualMutation = useMutation({
    mutationFn: explainabilityApi.runCounterfactual,
  });
  const proxyMutation = useMutation({
    mutationFn: explainabilityApi.runProxyDetection,
  });

  const parseJson = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Payload must be an object");
      }
      return { value: parsed, error: null };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  };

  const runShap = () => {
    const features = parseJson(featuresText);
    const baseline = parseJson(baselineText);
    if (features.error || baseline.error) {
      setParseError(features.error || baseline.error);
      return;
    }
    setParseError(null);
    shapMutation.mutate({
      features: features.value,
      baseline: baseline.value,
      top_k: 5,
    });
  };

  const runLime = () => {
    const features = parseJson(featuresText);
    const weights = parseJson(weightsText);
    if (features.error || weights.error) {
      setParseError(features.error || weights.error);
      return;
    }
    setParseError(null);
    limeMutation.mutate({
      features: features.value,
      weights: weights.value,
      top_k: 5,
    });
  };

  const runCounterfactual = () => {
    const features = parseJson(featuresText);
    if (features.error) {
      setParseError(features.error);
      return;
    }
    setParseError(null);
    counterfactualMutation.mutate({
      features: features.value,
      top_k: 3,
    });
  };

  const runProxyDetection = () => {
    setParseError(null);
    proxyMutation.mutate({
      features: proxyText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  const isAnyLoading =
    shapMutation.isPending ||
    limeMutation.isPending ||
    counterfactualMutation.isPending;

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

        <SectionHeader
          title="Explainability Studio"
          subtitle="SHAP, LIME, counterfactuals, and proxy detection"
        />

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              Feature Payload
            </h2>
            <textarea
              rows={10}
              value={featuresText}
              onChange={(event) => setFeaturesText(event.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-primary transition-colors"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-2">
                  Baseline (SHAP)
                </p>
                <textarea
                  rows={6}
                  value={baselineText}
                  onChange={(event) => setBaselineText(event.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-2">
                  Weights (LIME)
                </p>
                <textarea
                  rows={6}
                  value={weightsText}
                  onChange={(event) => setWeightsText(event.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            {parseError && (
              <div className="bg-error/10 border border-error/30 px-3 py-2 rounded-sm">
                <p className="text-xs text-error">{parseError}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <CyberButton onClick={runShap} disabled={shapMutation.isPending}>
                {shapMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Running...
                  </span>
                ) : (
                  "Run SHAP"
                )}
              </CyberButton>
              <CyberButton onClick={runLime} disabled={limeMutation.isPending}>
                {limeMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Running...
                  </span>
                ) : (
                  "Run LIME"
                )}
              </CyberButton>
              <CyberButton
                onClick={runCounterfactual}
                disabled={counterfactualMutation.isPending}
              >
                {counterfactualMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Running...
                  </span>
                ) : (
                  "Counterfactuals"
                )}
              </CyberButton>
            </div>
          </div>

          {/* Output Panel */}
          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">
              Explainability Output
            </h2>
            <div className="mt-4 space-y-4 text-sm text-muted">
              {/* SHAP Results */}
              {shapMutation.data?.top_features && (
                <div className="border border-primary/20 bg-primary/5 p-4 rounded-sm">
                  <p className="text-primary font-semibold mb-3 text-xs uppercase tracking-widest">
                    SHAP Top Features
                  </p>
                  <div className="space-y-2">
                    {shapMutation.data.top_features.map(
                      (item: {
                        feature: string;
                        importance: number;
                        direction?: string;
                      }) => (
                        <div
                          key={`shap-${item.feature}`}
                          className="flex items-center justify-between"
                        >
                          <span className="font-mono text-xs">
                            {item.feature}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{
                                  width: `${Math.round(item.importance * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-primary font-semibold w-12 text-right">
                              {(item.importance * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* LIME Results */}
              {limeMutation.data?.top_features && (
                <div className="border border-secondary/20 bg-secondary/5 p-4 rounded-sm">
                  <p className="text-secondary font-semibold mb-3 text-xs uppercase tracking-widest">
                    LIME Top Features
                  </p>
                  <div className="space-y-2">
                    {limeMutation.data.top_features.map(
                      (item: { feature: string; importance: number }) => (
                        <div
                          key={`lime-${item.feature}`}
                          className="flex items-center justify-between"
                        >
                          <span className="font-mono text-xs">
                            {item.feature}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full transition-all"
                                style={{
                                  width: `${Math.round(item.importance * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-secondary font-semibold w-12 text-right">
                              {(item.importance * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Counterfactual Results */}
              {counterfactualMutation.data?.counterfactuals && (
                <div className="border border-warning/20 bg-warning/5 p-4 rounded-sm">
                  <p className="text-warning font-semibold mb-3 text-xs uppercase tracking-widest">
                    Counterfactual Suggestions
                  </p>
                  <div className="space-y-2">
                    {counterfactualMutation.data.counterfactuals.map(
                      (item: {
                        feature: string;
                        current: number;
                        suggested: number;
                      }) => (
                        <div
                          key={`cf-${item.feature}`}
                          className="flex items-center justify-between font-mono text-xs"
                        >
                          <span>{item.feature}</span>
                          <span>
                            <span className="text-error">{item.current}</span>
                            {" → "}
                            <span className="text-success">
                              {item.suggested}
                            </span>
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Error states */}
              {shapMutation.isError && (
                <p className="text-error text-xs">
                  SHAP analysis failed. Please check your input.
                </p>
              )}
              {limeMutation.isError && (
                <p className="text-error text-xs">
                  LIME analysis failed. Please check your input.
                </p>
              )}
              {counterfactualMutation.isError && (
                <p className="text-error text-xs">
                  Counterfactual analysis failed. Please check your input.
                </p>
              )}

              {/* Empty state */}
              {!shapMutation.data &&
                !limeMutation.data &&
                !counterfactualMutation.data &&
                !isAnyLoading && (
                  <div className="text-center py-8">
                    <p className="text-muted">
                      Run an explainability method to view results.
                    </p>
                    <p className="text-xs text-muted/60 mt-2">
                      Click "Run SHAP", "Run LIME", or "Counterfactuals" above
                    </p>
                  </div>
                )}

              {isAnyLoading && (
                <div className="flex items-center justify-center py-8 gap-2 text-primary">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">Analyzing features...</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Proxy Detection Section */}
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border bg-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              Proxy Feature Detection
            </h2>
            <p className="text-xs text-muted">
              Enter comma-separated feature names to check for protected
              attribute proxies
            </p>
            <textarea
              rows={5}
              value={proxyText}
              onChange={(event) => setProxyText(event.target.value)}
              className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
            <CyberButton
              onClick={runProxyDetection}
              disabled={proxyMutation.isPending}
            >
              {proxyMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Detecting...
                </span>
              ) : (
                "Detect Proxies"
              )}
            </CyberButton>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">Proxy Risk</h2>
            {proxyMutation.data ? (
              <div className="mt-4 space-y-3">
                {/* Risk Score Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted w-24">
                    Risk Score
                  </span>
                  <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        proxyMutation.data.risk_score > 0.6
                          ? "bg-error"
                          : proxyMutation.data.risk_score > 0.3
                            ? "bg-warning"
                            : "bg-success"
                      }`}
                      style={{
                        width: `${Math.round(proxyMutation.data.risk_score * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary w-12 text-right">
                    {(proxyMutation.data.risk_score * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Flagged features */}
                <div className="space-y-2 text-sm text-muted">
                  {(proxyMutation.data.flagged || []).map(
                    (item: { feature: string; risk: string }) => (
                      <div
                        key={`proxy-${item.feature}`}
                        className="flex items-center justify-between border border-border/60 px-3 py-2 rounded-sm"
                      >
                        <span className="font-mono text-xs">
                          {item.feature}
                        </span>
                        <span
                          className={`text-xs uppercase tracking-wider font-semibold ${
                            item.risk === "high"
                              ? "text-error"
                              : item.risk === "medium"
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {item.risk}
                        </span>
                      </div>
                    ),
                  )}
                  {(proxyMutation.data.flagged || []).length === 0 && (
                    <p className="text-success text-xs">
                      ✓ No proxy features detected
                    </p>
                  )}
                </div>

                {proxyMutation.data.recommendation && (
                  <p className="text-xs text-muted mt-2 italic">
                    {proxyMutation.data.recommendation}
                  </p>
                )}
              </div>
            ) : proxyMutation.isPending ? (
              <div className="flex items-center justify-center py-8 gap-2 text-primary">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Scanning for proxies...</span>
              </div>
            ) : (
              <p className="text-sm text-muted mt-4">
                Run proxy detection to see flagged features.
              </p>
            )}
          </div>
        </section>
      </PageContainer>
    </DashboardLayout>
  );
}
