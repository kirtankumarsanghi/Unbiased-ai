import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  showBackButton = true,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {showBackButton && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted hover:text-primary hover:border-primary/40 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      )}
      <h2 className="text-3xl font-bold text-primary">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
