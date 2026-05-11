"""
Counterfactual explainability service.
"""

class CounterfactualService:
    @staticmethod
    def propose(features: dict[str, float], top_k: int = 3):
        ranked = sorted(
            (
                {
                    "feature": name,
                    "current": float(value),
                    "suggested": float(value) * 0.8,
                }
                for name, value in features.items()
            ),
            key=lambda item: abs(item["current"]),
            reverse=True,
        )

        return {
            "counterfactuals": ranked[: max(1, top_k)],
            "note": "Suggested adjustments reduce magnitude of dominant features.",
        }
