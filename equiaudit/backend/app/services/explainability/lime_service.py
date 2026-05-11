"""
LIME explainability service.
"""

class LIMEService:
    @staticmethod
    def explain(features: dict[str, float], weights: dict[str, float] | None = None, top_k: int = 5):
        weights = weights or {}
        contributions = {}
        for name, value in features.items():
            coefficient = float(weights.get(name, 1.0))
            contributions[name] = float(value) * coefficient

        total = sum(abs(value) for value in contributions.values())
        if total == 0:
            total = 1.0

        ranked = sorted(
            (
                {
                    "feature": name,
                    "coefficient": float(weights.get(name, 1.0)),
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
            "local_explanation": ranked,
        }
