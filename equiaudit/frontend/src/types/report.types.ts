// Report types
export interface Report {
  id: string;

  modelId: string;

  createdAt: string;

  status: string;

  downloadUrl?: string;
}