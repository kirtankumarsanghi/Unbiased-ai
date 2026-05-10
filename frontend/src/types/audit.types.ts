// Audit types
export interface AuditMetric {
  metric: string;

  value: number;
}

export interface AuditLog {
  id: number;

  level: string;

  timestamp: string;

  message: string;
}