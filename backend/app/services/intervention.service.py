# Intervention service
class InterventionService:

    @staticmethod
    def activate(name: str):
        return {
            "intervention": name,
            "status": "ACTIVE"
        }