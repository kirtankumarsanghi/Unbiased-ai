# Hashing utilities
def fairness_score(
    demographic_parity: float,
    equalized_odds: float,
    disparate_impact: float
):
    return round(
        (
            demographic_parity +
            equalized_odds +
            disparate_impact
        ) / 3,
        2
    )