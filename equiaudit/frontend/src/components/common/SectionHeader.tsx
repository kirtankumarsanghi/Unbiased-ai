interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-8">
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
