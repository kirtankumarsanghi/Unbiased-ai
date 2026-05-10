import StatusBadge from "../common/StatusBadge";

import { Model } from "../../types/model.types";

interface Props {
  models: Model[];
}

export default function ModelsTable({
  models,
}: Props) {
  return (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-primary">
          Registered Models
        </h3>
      </div>

      <table className="w-full">
        <thead className="bg-surface-light border-b border-border">
          <tr className="text-left">
            <th className="p-4 text-xs uppercase tracking-widest text-muted">
              Model
            </th>

            <th className="p-4 text-xs uppercase tracking-widest text-muted">
              Status
            </th>

            <th className="p-4 text-xs uppercase tracking-widest text-muted">
              Bias Index
            </th>

            <th className="p-4 text-xs uppercase tracking-widest text-muted">
              Throughput
            </th>

            <th className="p-4 text-xs uppercase tracking-widest text-muted">
              Data Drift
            </th>
          </tr>
        </thead>

        <tbody>
          {models.map((model) => (
            <tr
              key={model.id}
              className="border-b border-border hover:bg-primary/5 transition-colors"
            >
              <td className="p-4 font-medium">
                {model.name}
              </td>

              <td className="p-4">
                <StatusBadge status={model.status} />
              </td>

              <td className="p-4 text-primary">
                {model.biasIndex}
              </td>

              <td className="p-4">{model.throughput}</td>

              <td className="p-4">{model.dataDrift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
