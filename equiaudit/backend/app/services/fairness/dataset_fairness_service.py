import pandas as pd


def _find_column(columns: list[str], candidates: list[str]) -> str | None:
    lower_map = {col.lower(): col for col in columns}
    for candidate in candidates:
        if candidate in lower_map:
            return lower_map[candidate]
    return None


def _to_binary(series: pd.Series) -> pd.Series:
    if pd.api.types.is_bool_dtype(series):
        return series.astype(int)
    if pd.api.types.is_numeric_dtype(series):
        return (series.astype(float) > 0).astype(int)

    mapped = (
        series.astype(str)
        .str.strip()
        .str.lower()
        .map(
            {
                "1": 1,
                "0": 0,
                "true": 1,
                "false": 0,
                "yes": 1,
                "no": 0,
                "positive": 1,
                "negative": 0,
                "approved": 1,
                "rejected": 0,
            }
        )
    )
    return mapped.fillna(0).astype(int)


def calculate_fairness_metrics_from_csv(file_path: str) -> dict:
    df = pd.read_csv(file_path)
    if df.empty:
        raise ValueError("Uploaded dataset is empty")

    columns = [c for c in df.columns]
    protected_col = _find_column(
        columns,
        ["protected_group", "group", "gender", "race", "ethnicity", "segment"],
    )
    y_true_col = _find_column(columns, ["y_true", "label", "actual", "target"])
    y_pred_col = _find_column(
        columns, ["y_pred", "prediction", "predicted", "score", "decision"]
    )

    if not protected_col or not y_true_col or not y_pred_col:
        raise ValueError(
            "Dataset must include protected group, true label, and prediction columns"
        )

    data = df[[protected_col, y_true_col, y_pred_col]].dropna()
    if data.empty:
        raise ValueError("Dataset has no valid rows after removing null values")

    groups = data[protected_col].astype(str)
    y_true = _to_binary(data[y_true_col])
    y_pred = _to_binary(data[y_pred_col])

    rates = data.assign(group=groups, pred=y_pred).groupby("group")["pred"].mean()
    if len(rates) < 2:
        raise ValueError("Need at least two protected groups to compute fairness metrics")

    max_rate = float(rates.max())
    min_rate = float(rates.min())
    dp_gap = max_rate - min_rate
    demographic_parity = round(max(0.0, 1.0 - dp_gap), 2)
    disparate_impact = round(min_rate / max_rate, 2) if max_rate > 0 else 0.0

    grouped = data.assign(group=groups, y_true=y_true, y_pred=y_pred).groupby("group")
    tprs: list[float] = []
    fprs: list[float] = []
    for _, group_df in grouped:
        positives = group_df[group_df["y_true"] == 1]
        negatives = group_df[group_df["y_true"] == 0]
        tpr = float((positives["y_pred"] == 1).mean()) if len(positives) else 0.0
        fpr = float((negatives["y_pred"] == 1).mean()) if len(negatives) else 0.0
        tprs.append(tpr)
        fprs.append(fpr)

    tpr_gap = max(tprs) - min(tprs)
    fpr_gap = max(fprs) - min(fprs)
    equalized_odds = round(max(0.0, 1.0 - max(tpr_gap, fpr_gap)), 2)

    return {
        "demographic_parity": demographic_parity,
        "equalized_odds": equalized_odds,
        "disparate_impact": round(disparate_impact, 2),
        "rows": int(len(data)),
    }
