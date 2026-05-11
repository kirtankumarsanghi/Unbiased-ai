from app.services.fairness.demographic_parity import compute_demographic_parity
from app.services.fairness.equalized_odds import compute_equalized_odds
from app.services.fairness.disparate_impact import compute_disparate_impact


class FairnessService:

    @staticmethod
    def calculate_metrics(y_true, y_pred, sensitive_features):
        return {
            "demographic_parity": compute_demographic_parity(
                y_true, y_pred, sensitive_features
            ),
            "equalized_odds": compute_equalized_odds(
                y_true, y_pred, sensitive_features
            ),
            "disparate_impact": compute_disparate_impact(
                y_true, y_pred, sensitive_features
            ),
        }