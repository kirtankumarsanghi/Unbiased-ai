import { Model } from "../../types/model.types";

// Mock models data
export const mockModels: Model[] = [
  {
    id: "1",
    name: "HireScore",
    status: "SAFE",
    biasIndex: 0.012,
    throughput: "1.2k req/s",
    dataDrift: "1.4%",
  },

  {
    id: "2",
    name: "CreditLens",
    status: "WARNING",
    biasIndex: 0.89,
    throughput: "4.5k req/s",
    dataDrift: "5.2%",
  },

  {
    id: "3",
    name: "HealthPath",
    status: "SAFE",
    biasIndex: 0.98,
    throughput: "0.5k req/s",
    dataDrift: "0.5%",
  },

  {
    id: "4",
    name: "RiskEval",
    status: "CRITICAL",
    biasIndex: 0.65,
    throughput: "12k req/s",
    dataDrift: "18.4%",
  },
];