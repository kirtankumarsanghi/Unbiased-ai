"""
Equalized Odds metric implementation.
"""

def compute_equalized_odds(y_true, y_pred, sensitive_features):
    """Compute equalized odds."""
    if not (len(y_true) == len(y_pred) == len(sensitive_features)):
        raise ValueError("Input arrays must be the same length")

    grouped: dict[str, list[tuple[int, int]]] = {}
    for truth, pred, group in zip(y_true, y_pred, sensitive_features):
        key = str(group)
        grouped.setdefault(key, []).append((1 if truth else 0, 1 if pred else 0))

    if len(grouped) < 2:
        raise ValueError("Need at least two protected groups")

    tprs: list[float] = []
    fprs: list[float] = []
    for rows in grouped.values():
        positives = [pred for truth, pred in rows if truth == 1]
        negatives = [pred for truth, pred in rows if truth == 0]
        tpr = sum(positives) / len(positives) if positives else 0.0
        fpr = sum(negatives) / len(negatives) if negatives else 0.0
        tprs.append(tpr)
        fprs.append(fpr)

    if not tprs or not fprs:
        return 0.0

    tpr_gap = max(tprs) - min(tprs)
    fpr_gap = max(fprs) - min(fprs)
    return round(max(0.0, 1.0 - max(tpr_gap, fpr_gap)), 2)
