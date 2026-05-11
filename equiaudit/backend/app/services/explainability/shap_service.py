"""
SHAP explainability service.
"""

class SHAPService:
    @staticmethod
    def explain(features: dict[str, float], baseline: dict[str, float] | None = None, top_k: int = 5):
        baseline = baseline or {}
        contributions = {}
        for name, value in features.items():
            base = float(baseline.get(name, 0.0))
            contributions[name] = float(value) - base

        total = sum(abs(value) for value in contributions.values())
        if total == 0:
            total = 1.0

        ranked = sorted(
            (
                {
                    "feature": name,
                    "contribution": contribution,
                    "importance": round(abs(contribution) / total, 4),
                }
                for name, contribution in contributions.items()
            ),
            key=lambda item: item["importance"],
            reverse=True,
        )

        return {
            "top_features": ranked[: max(1, top_k)],
            "feature_contributions": ranked,
        }
