import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: Props) {
  return (
    <div className="max-w-[1440px] mx-auto w-full">
      {children}
    </div>
  );
}
