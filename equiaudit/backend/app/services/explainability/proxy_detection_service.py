"""
Proxy detection explainability service.
"""

class ProxyDetectionService:
    @staticmethod
    def detect(features: list[str], sensitive_keywords: list[str] | None = None):
        keywords = sensitive_keywords or [
            "race",
            "gender",
            "sex",
            "ethnicity",
            "religion",
            "age",
            "zip",
            "postcode",
            "income",
        ]

        flagged = []
        for feature in features:
            lower = feature.lower()
            hits = [kw for kw in keywords if kw in lower]
            if hits:
                flagged.append(
                    {
                        "feature": feature,
                        "matches": hits,
                        "risk": "high" if len(hits) > 1 else "medium",
                    }
                )

        return {
            "flagged": flagged,
            "risk_score": round(min(len(flagged) / max(len(features), 1), 1.0), 2),
        }
