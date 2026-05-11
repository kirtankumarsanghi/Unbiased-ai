"""
Demographic Parity metric implementation.
"""

def compute_demographic_parity(y_true, y_pred, sensitive_features):
    """Compute demographic parity."""
    if not (len(y_true) == len(y_pred) == len(sensitive_features)):
        raise ValueError("Input arrays must be the same length")

    group_rates: dict[str, list[int]] = {}
    for pred, group in zip(y_pred, sensitive_features):
        key = str(group)
        group_rates.setdefault(key, []).append(1 if pred else 0)

    if len(group_rates) < 2:
        raise ValueError("Need at least two protected groups")

    rates = [sum(values) / len(values) for values in group_rates.values() if values]
    if not rates:
        return 0.0

    max_rate = max(rates)
    min_rate = min(rates)
    gap = max_rate - min_rate
    return round(max(0.0, 1.0 - gap), 2)
