from fastapi import APIRouter

from app.data.store import store

router = APIRouter()


@router.get("/summary")
def get_summary():
	critical_alerts = len(
		[
			log
			for log in store.audit_logs
			if log.get("level") in {"WARN", "CRITICAL"}
		]
	)

	return {
		"metrics": [
			{
				"label": "Global Fairness",
				"value": 0.93,
				"trend": "+2.1%",
			},
			{
				"label": "Active Audits",
				"value": len(store.audits),
				"trend": "Realtime",
			},
			{
				"label": "Critical Alerts",
				"value": critical_alerts,
				"trend": "High",
			},
			{
				"label": "Interventions",
				"value": len(store.interventions),
				"trend": "Running",
			},
		]
	}
