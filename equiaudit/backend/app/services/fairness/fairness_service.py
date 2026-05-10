import random


class FairnessService:

    @staticmethod
    def calculate_metrics():
        return {
            "demographic_parity":
                round(
                    random.uniform(0.8, 1.0),
                    2
                ),

            "equalized_odds":
                round(
                    random.uniform(0.8, 1.0),
                    2
                ),

            "disparate_impact":
                round(
                    random.uniform(0.7, 1.0),
                    2
                )
        }