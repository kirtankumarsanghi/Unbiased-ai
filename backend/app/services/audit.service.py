# Audit service
from app.services.fairness.fairness_service import (
    FairnessService
)


class AuditService:

    @staticmethod
    def run_audit():
        return (
            FairnessService.calculate_metrics()
        )