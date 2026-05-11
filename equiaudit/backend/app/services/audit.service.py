# Audit service
from app.services.fairness.fairness_service import (
    FairnessService
)


class AuditService:

    @staticmethod
    def run_audit(y_true, y_pred, sensitive_features):
        return (
            FairnessService.calculate_metrics(
                y_true,
                y_pred,
                sensitive_features,
            )
        )