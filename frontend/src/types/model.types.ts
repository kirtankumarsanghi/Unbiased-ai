export type ModelStatus = "SAFE" | "WARNING" | "CRITICAL";

export interface Model {
  id: string;
  name: string;
  status: ModelStatus;
  biasIndex: number;
  throughput: string;
  dataDrift: string;
}
