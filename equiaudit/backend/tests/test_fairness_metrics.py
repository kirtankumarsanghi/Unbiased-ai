from app.services.fairness.demographic_parity import compute_demographic_parity
from app.services.fairness.equalized_odds import compute_equalized_odds
from app.services.fairness.disparate_impact import compute_disparate_impact


def test_fairness_metrics_basic():
    y_true = [1, 0, 1, 0, 1, 0]
    y_pred = [1, 0, 1, 0, 0, 0]
    sensitive = ["A", "A", "B", "B", "A", "B"]

    assert compute_demographic_parity(y_true, y_pred, sensitive) == 1.0
    assert compute_disparate_impact(y_true, y_pred, sensitive) == 1.0
    assert compute_equalized_odds(y_true, y_pred, sensitive) == 0.5


def test_disparate_impact_zero_rate():
    y_true = [1, 0, 1, 0]
    y_pred = [0, 0, 0, 0]
    sensitive = ["A", "B", "A", "B"]

    assert compute_disparate_impact(y_true, y_pred, sensitive) == 0.0


def test_metric_input_length_mismatch():
    y_true = [1, 0]
    y_pred = [1]
    sensitive = ["A", "B"]

    try:
        compute_demographic_parity(y_true, y_pred, sensitive)
        assert False, "Expected ValueError"
    except ValueError:
        assert True
