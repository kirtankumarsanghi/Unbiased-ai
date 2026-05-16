/**
 * Multi-provider AI service — supports Gemini (free), OpenAI, and offline fallback
 * Works directly from the browser — no backend required!
 */

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ---------- Gemini Provider ----------
class GeminiProvider {
  private apiKey: string | null;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
    this.model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash";
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey && this.apiKey !== "your-gemini-api-key-here");
  }

  async generate(systemPrompt: string, userPrompt: string, options: { maxTokens?: number; temperature?: number } = {}): Promise<string | null> {
    if (!this.isEnabled()) return null;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
              maxOutputTokens: options.maxTokens || 800,
              temperature: options.temperature ?? 0.7,
            },
          }),
        }
      );
      if (!response.ok) {
        console.error("Gemini API error:", response.status);
        return null;
      }
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    } catch (error) {
      console.error("Gemini request failed:", error);
      return null;
    }
  }
}

// ---------- OpenAI Provider ----------
class OpenAIProvider {
  private apiKey: string | null;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    this.model = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";
  }

  isEnabled(): boolean {
    return Boolean(this.apiKey && this.apiKey !== "your-openai-api-key-here");
  }

  async generate(systemPrompt: string, userPrompt: string, options: { maxTokens?: number; temperature?: number } = {}): Promise<string | null> {
    if (!this.isEnabled()) return null;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: options.maxTokens || 800,
          temperature: options.temperature ?? 0.7,
        }),
      });
      if (!response.ok) {
        console.error("OpenAI API error:", response.status);
        return null;
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
      console.error("OpenAI request failed:", error);
      return null;
    }
  }
}

// ---------- Intelligent Offline Fallback ----------
class OfflineIntelligence {
  generateAnswer(question: string, _context?: string): string {
    const q = question.toLowerCase();

    // Career & learning questions
    if (q.includes("python") || q.includes("programming") || q.includes("coding") || q.includes("learn")) {
      return this.buildResponse("Technology & Learning Analysis", [
        "Python remains one of the most versatile and in-demand programming languages in 2026, consistently ranking in the top 3 across industry surveys (TIOBE, Stack Overflow, IEEE Spectrum).",
        "Key demand drivers: AI/ML engineering, data science, automation, backend development, and scientific computing.",
        "The language's ecosystem continues to grow with strong community support, extensive libraries (TensorFlow, PyTorch, pandas, FastAPI), and broad industry adoption.",
        "However, career growth depends on more than just one language — system design, domain expertise, and problem-solving skills matter equally.",
        "Consider complementing Python with cloud skills (AWS/GCP), SQL, and understanding of AI/ML concepts for maximum career leverage.",
      ], [
        "Individual career outcomes vary based on location, industry, experience level, and specialization.",
        "Technology trends can shift — evaluate based on your specific career goals rather than general popularity.",
      ]);
    }

    if (q.includes("career") || q.includes("job") || q.includes("salary") || q.includes("work")) {
      return this.buildResponse("Career Decision Analysis", [
        "Career decisions involve multiple trade-off dimensions: compensation, growth potential, work-life balance, job security, and personal fulfillment.",
        "Higher-paying roles often come with increased responsibility, longer hours, or higher stress — evaluate the full compensation package including benefits, equity, and flexibility.",
        "Industry data suggests that skill development and network building in early career years often yield higher long-term returns than optimizing for immediate salary.",
        "Consider your risk tolerance, financial obligations, and personal values when making career transitions.",
      ], [
        "Career advice is inherently personal — what works for one person may not work for another.",
        "Consider consulting with mentors in your specific field for tailored guidance.",
      ]);
    }

    if (q.includes("ai") || q.includes("artificial intelligence") || q.includes("machine learning")) {
      return this.buildResponse("AI & Technology Analysis", [
        "AI is transforming industries across healthcare, finance, education, manufacturing, and creative fields.",
        "Key considerations: AI capabilities are advancing rapidly, but current systems have limitations in reasoning, reliability, and handling edge cases.",
        "Ethical concerns include bias in training data, privacy implications, job displacement in certain sectors, and environmental costs of large model training.",
        "Balanced perspective: AI is a powerful tool that augments human capabilities rather than fully replacing them in most domains. The most effective applications combine AI efficiency with human judgment.",
        "For career positioning: understanding AI's capabilities and limitations is increasingly valuable across all fields, not just technical roles.",
      ], [
        "AI predictions are inherently uncertain — the field is evolving rapidly.",
        "Consider multiple expert perspectives and peer-reviewed research rather than hype-driven narratives.",
      ]);
    }

    if (q.includes("invest") || q.includes("stock") || q.includes("crypto") || q.includes("money") || q.includes("financial")) {
      return this.buildResponse("Financial Decision Framework", [
        "Financial decisions should be based on your individual risk tolerance, time horizon, and financial goals — not on general advice.",
        "Diversification across asset classes remains a fundamental principle supported by decades of financial research.",
        "Historical returns are not indicative of future performance. Be cautious of recency bias and survivorship bias in investment narratives.",
        "Consider the total cost of any financial product including fees, taxes, and opportunity costs.",
        "Emergency funds, debt management, and adequate insurance should typically precede investment optimization.",
      ], [
        "This is educational information, not financial advice. Consult a qualified financial advisor for personalized recommendations.",
        "Financial markets involve inherent risk, and past performance does not guarantee future results.",
      ]);
    }

    if (q.includes("health") || q.includes("diet") || q.includes("exercise") || q.includes("medical")) {
      return this.buildResponse("Health & Wellness Analysis", [
        "Health decisions should be informed by peer-reviewed medical research and personalized medical advice.",
        "General evidence-based principles: regular physical activity, balanced nutrition, adequate sleep (7-9 hours), stress management, and preventive care visits.",
        "Be cautious of health claims that promise dramatic results, lack scientific backing, or come from sources with commercial interests.",
        "Individual health needs vary significantly based on genetics, existing conditions, age, and lifestyle factors.",
      ], [
        "This is general health information, not medical advice. Always consult healthcare professionals for personal health decisions.",
        "Be wary of health misinformation — prioritize information from established medical institutions and peer-reviewed journals.",
      ]);
    }

    // Generic thoughtful response
    return this.buildResponse("Balanced Analysis", [
      `Regarding "${question.slice(0, 100)}": This is a multi-faceted question that deserves careful consideration from multiple angles.`,
      "When evaluating any decision or claim, consider: What is the quality of evidence? Are there conflicting expert perspectives? What are the potential biases in available information?",
      "Key analytical framework: Identify your core criteria, weigh trade-offs explicitly, consider both short-term and long-term implications, and acknowledge areas of genuine uncertainty.",
      "Seek information from diverse, credible sources. Be skeptical of narratives that present complex issues as simple or one-sided.",
    ], [
      "Complex questions rarely have simple, universally correct answers. Context and individual circumstances matter significantly.",
      "For specialized topics (legal, medical, financial), professional consultation is recommended.",
    ]);
  }

  private buildResponse(title: string, points: string[], caveats: string[]): string {
    let response = `📊 ${title}\n\n`;
    points.forEach((p, i) => { response += `${i + 1}. ${p}\n\n`; });
    response += `⚠️ Important Caveats:\n`;
    caveats.forEach(c => { response += `• ${c}\n`; });
    response += `\n💡 This analysis aims to present balanced, evidence-based perspectives. For critical decisions, cross-reference with authoritative sources.`;
    return response;
  }

  explainFeatures(features: Array<{ feature: string; importance: number }>, method: string): string {
    const sorted = [...features].sort((a, b) => b.importance - a.importance);
    const top = sorted[0];
    const lines = [
      `${method} Analysis Summary:`,
      `The most influential feature is "${top.feature}" with ${(top.importance * 100).toFixed(1)}% relative importance.`,
      sorted.length > 1 ? `Secondary drivers include ${sorted.slice(1).map(f => `"${f.feature}" (${(f.importance * 100).toFixed(1)}%)`).join(", ")}.` : "",
      `This means the model's prediction is most sensitive to changes in "${top.feature}". If this feature were altered, the prediction would change most significantly.`,
      method === "SHAP" ? "SHAP values show each feature's marginal contribution to the prediction relative to a baseline." : "",
      method === "LIME" ? "LIME approximates the model locally with a simpler interpretable model to show feature influence." : "",
    ].filter(Boolean);
    return lines.join(" ");
  }
}

// ---------- Main Service ----------
class AIService {
  private gemini: GeminiProvider;
  private openai: OpenAIProvider;
  private offline: OfflineIntelligence;

  constructor() {
    this.gemini = new GeminiProvider();
    this.openai = new OpenAIProvider();
    this.offline = new OfflineIntelligence();
  }

  isEnabled(): boolean {
    return this.gemini.isEnabled() || this.openai.isEnabled();
  }

  getProviderName(): string {
    if (this.gemini.isEnabled()) return "Gemini";
    if (this.openai.isEnabled()) return "OpenAI";
    return "Built-in Intelligence";
  }

  async generateText(systemPrompt: string, userPrompt: string, options: { maxTokens?: number; temperature?: number } = {}): Promise<string | null> {
    // Try Gemini first, then OpenAI
    if (this.gemini.isEnabled()) {
      const result = await this.gemini.generate(systemPrompt, userPrompt, options);
      if (result) return result;
    }
    if (this.openai.isEnabled()) {
      const result = await this.openai.generate(systemPrompt, userPrompt, options);
      if (result) return result;
    }
    return null;
  }

  async askPublicAI(question: string, context?: string): Promise<string> {
    const systemPrompt = `You are an unbiased, analytical AI assistant. Your responses must be:
- Balanced: present multiple perspectives on controversial topics
- Evidence-based: cite reasoning and acknowledge uncertainty
- Logical: use clear analytical frameworks
- Non-manipulative: avoid emotional language or leading conclusions
- Thorough but concise: cover key angles without being verbose
- Honest about limitations: state when you don't have enough information`;

    const userPrompt = context ? `Context: ${context}\n\nQuestion: ${question}` : question;
    const answer = await this.generateText(systemPrompt, userPrompt, { maxTokens: 800, temperature: 0.6 });
    if (answer) return answer;
    // Offline fallback
    return this.offline.generateAnswer(question, context);
  }

  async analyzeDecision(question: string, options: Array<{ name: string; pros?: string[]; cons?: string[] }>): Promise<string> {
    const systemPrompt = `You are a decision analysis expert. Provide balanced, unbiased evaluation:
1. Evaluate each option on its merits and risks
2. Identify key tradeoffs
3. Rate your confidence in the analysis
4. Give a recommendation with clear reasoning
Be objective and acknowledge genuine uncertainty.`;

    const optionsText = options.map((opt, i) =>
      `Option ${i + 1}: ${opt.name}\nPros: ${opt.pros?.join(", ") || "N/A"}\nCons: ${opt.cons?.join(", ") || "N/A"}`
    ).join("\n\n");

    const answer = await this.generateText(systemPrompt, `Question: ${question}\n\n${optionsText}\n\nProvide a balanced analysis.`, { maxTokens: 700, temperature: 0.5 });
    return answer || "Decision analysis: Consider each option's evidence strength, risk profile, and alignment with your specific goals. The option with the best evidence-to-risk ratio for your circumstances is typically the strongest choice.";
  }

  async detectBias(content: string): Promise<{ analysis: string; manipulationScore: number; neutralityScore: number }> {
    const systemPrompt = `You are a bias and manipulation detection expert. Analyze text for:
- Emotional manipulation tactics
- Logical fallacies
- One-sided framing
- Missing context
- Factual accuracy signals
Respond with: 1) Detailed analysis, 2) Manipulation score (0.0-1.0), 3) Neutrality score (0.0-1.0)
Format scores on separate lines like: "Manipulation Score: 0.X" and "Neutrality Score: 0.X"`;

    const answer = await this.generateText(systemPrompt, `Analyze this text for bias:\n\n"${content}"`, { maxTokens: 500, temperature: 0.4 });

    if (!answer) {
      // Offline analysis
      const emotional = ["shocking", "outrage", "fear", "panic", "hate", "disaster", "urgent", "betrayal"];
      const propaganda = ["they don't want you to know", "wake up", "mainstream lies", "enemy"];
      const low = content.toLowerCase();
      const eHits = emotional.filter(t => low.includes(t)).length;
      const pHits = propaganda.filter(t => low.includes(t)).length;
      const manip = Math.min(1, (eHits * 0.2 + pHits * 0.4));
      return {
        analysis: `Detected ${eHits} emotional trigger(s) and ${pHits} propaganda indicator(s). ${manip > 0.5 ? "This text shows significant signs of manipulation." : "This text shows moderate or low manipulation signals."}`,
        manipulationScore: manip,
        neutralityScore: Math.max(0, 1 - manip),
      };
    }

    const manipMatch = answer.match(/manipulation[:\s]+([0-9.]+)/i);
    const neutralMatch = answer.match(/neutrality[:\s]+([0-9.]+)/i);
    return {
      analysis: answer,
      manipulationScore: manipMatch ? parseFloat(manipMatch[1]) : 0.5,
      neutralityScore: neutralMatch ? parseFloat(neutralMatch[1]) : 0.5,
    };
  }

  async explainFeatureImportance(topFeatures: Array<{ feature: string; importance: number }>, method: "SHAP" | "LIME" | "Counterfactual"): Promise<string> {
    const systemPrompt = `You are an AI explainability expert. Explain ${method} results in plain language (2-4 sentences). Focus on what the features mean for the prediction and any potential fairness implications.`;
    const featuresText = topFeatures.map(f => `${f.feature}: ${f.importance.toFixed(3)}`).join(", ");
    const answer = await this.generateText(systemPrompt, `Top ${method} features: ${featuresText}. Explain what this means.`, { maxTokens: 300, temperature: 0.4 });
    return answer || this.offline.explainFeatures(topFeatures, method);
  }

  async balanceNews(topic: string, perspectiveA: string, perspectiveB: string): Promise<string> {
    const systemPrompt = `You are a news balance analyst. Given two perspectives on a topic, provide:
1. Common ground between perspectives
2. Key differences
3. Missing context
4. Balanced synthesis
Be objective and acknowledge complexity.`;

    const answer = await this.generateText(systemPrompt, `Topic: ${topic}\n\nPerspective A: ${perspectiveA}\n\nPerspective B: ${perspectiveB}`, { maxTokens: 600, temperature: 0.5 });
    return answer || "Both perspectives contain valid points. A balanced view requires considering the evidence strength behind each claim, the potential biases of each source, and the broader context that may not be fully represented in either perspective.";
  }

  async askExplainability(question: string, analysisContext: Record<string, unknown>): Promise<string> {
    const systemPrompt = `You are an AI explainability assistant for a bias auditing platform. Answer questions about model behavior, feature importance, fairness, and algorithmic decision-making. Be precise, unbiased, and educational.`;
    const contextStr = Object.keys(analysisContext).length > 0 ? `\n\nAnalysis context: ${JSON.stringify(analysisContext).slice(0, 1000)}` : "";
    const answer = await this.generateText(systemPrompt, `${question}${contextStr}`, { maxTokens: 500, temperature: 0.5 });
    return answer || `Regarding "${question}": In model explainability, feature importance indicates how much each input variable contributes to the model's prediction. Higher importance means the model is more sensitive to changes in that feature. When auditing for bias, pay special attention to features that correlate with protected attributes (race, gender, age) — these may indicate discriminatory patterns even if protected attributes aren't directly used.`;
  }
}

export const openAIService = new AIService();
