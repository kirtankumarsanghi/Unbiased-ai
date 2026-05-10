from __future__ import annotations

from datetime import datetime
import random


class MemoryStore:
    def __init__(self) -> None:
        self._model_id = 2
        self._audit_id = 0
        self._report_id = 1

        self.models = [
            {
                "id": 1,
                "name": "HireScore",
                "status": "SAFE",
                "biasIndex": 0.12,
                "throughput": "1.2k req/s",
                "dataDrift": "1.4%",
            },
            {
                "id": 2,
                "name": "RiskEval",
                "status": "CRITICAL",
                "biasIndex": 0.65,
                "throughput": "12k req/s",
                "dataDrift": "18.4%",
            },
        ]

        self.audits = []

        self.reports = [
            {
                "id": 1,
                "title": "EquiAudit Q1 Compliance",
                "status": "COMPLIANT",
                "generated_at": datetime.utcnow().isoformat(),
                "content": "EquiAudit Compliance Report\nStatus: COMPLIANT\n",
            }
        ]

        self.interventions = [
            {
                "name": "Reweighing",
                "status": "ACTIVE",
                "fairnessGain": "+14%",
                "accuracyTradeoff": "-1.2%",
                "processingTime": "12s",
            },
            {
                "name": "Adversarial Debiasing",
                "status": "STANDBY",
                "fairnessGain": "+18%",
                "accuracyTradeoff": "-2.1%",
                "processingTime": "30s",
            },
            {
                "name": "Reject Option Classification",
                "status": "STANDBY",
                "fairnessGain": "+9%",
                "accuracyTradeoff": "-0.8%",
                "processingTime": "8s",
            },
        ]

        self.audit_logs = [
            {
                "id": 1,
                "level": "INFO",
                "timestamp": "08:42:12",
                "message": "Model ingestion complete",
            },
            {
                "id": 2,
                "level": "SYSTEM",
                "timestamp": "08:42:15",
                "message": "Calculating demographic parity",
            },
            {
                "id": 3,
                "level": "WARN",
                "timestamp": "08:42:18",
                "message": "Disparate impact detected in Age_Bracket_3",
            },
            {
                "id": 4,
                "level": "ACTION",
                "timestamp": "08:42:20",
                "message": "Triggering intervention protocol #A-44",
            },
        ]

    def list_models(self):
        return self.models

    def add_model(self, name: str):
        self._model_id += 1
        model = {
            "id": self._model_id,
            "name": name,
            "status": random.choice(["SAFE", "WARNING", "CRITICAL"]),
            "biasIndex": round(random.uniform(0.05, 0.95), 2),
            "throughput": f"{round(random.uniform(0.5, 12.0), 1)}k req/s",
            "dataDrift": f"{round(random.uniform(0.2, 18.9), 1)}%",
        }
        self.models.append(model)
        return model

    def get_model(self, model_id: int):
        return next(
            (model for model in self.models if model["id"] == model_id),
            None,
        )

    def delete_model(self, model_id: int):
        for index, model in enumerate(self.models):
            if model["id"] == model_id:
                return self.models.pop(index)
        return None

    def create_audit(self, model_id: int):
        self._audit_id += 1
        metrics = {
            "demographic_parity": round(random.uniform(0.7, 0.99), 2),
            "equalized_odds": round(random.uniform(0.65, 0.96), 2),
            "disparate_impact": round(random.uniform(0.6, 0.95), 2),
        }
        audit = {
            "id": self._audit_id,
            "model_id": model_id,
            **metrics,
        }
        self.audits.append(audit)

        self.audit_logs.append(
            {
                "id": len(self.audit_logs) + 1,
                "level": "INFO",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                "message": f"Audit #{self._audit_id} completed for model {model_id}",
            }
        )
        return audit

    def get_audit(self, audit_id: int):
        return next(
            (audit for audit in self.audits if audit["id"] == audit_id),
            None,
        )

    def list_reports(self):
        return [
            {
                "id": report["id"],
                "title": report["title"],
                "status": report["status"],
                "generated_at": report["generated_at"],
            }
            for report in self.reports
        ]

    def create_report(self):
        self._report_id += 1
        report = {
            "id": self._report_id,
            "title": f"EquiAudit Report #{self._report_id}",
            "status": "COMPLIANT",
            "generated_at": datetime.utcnow().isoformat(),
            "content": f"EquiAudit Report #{self._report_id}\nStatus: COMPLIANT\n",
        }
        self.reports.append(report)
        return report

    def get_report(self, report_id: int):
        return next(
            (report for report in self.reports if report["id"] == report_id),
            None,
        )

    def list_interventions(self):
        return self.interventions

    def set_intervention_status(self, name: str, status: str):
        for intervention in self.interventions:
            if intervention["name"].lower() == name.lower():
                intervention["status"] = status
                return intervention

        intervention = {
            "name": name,
            "status": status,
            "fairnessGain": "+0%",
            "accuracyTradeoff": "0%",
            "processingTime": "N/A",
        }
        self.interventions.append(intervention)
        return intervention


store = MemoryStore()
