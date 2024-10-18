export default function SectionDividerBackground({
  fillColor,
  className,
}: {
  fillColor: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 100"
      fill={fillColor}
      className={className}
    >
      <path d="M0 0v100h125V86h125V73h125V59h125V45h125V31h125V18h125V4h125V0H0z"></path>
    </svg>
  );
}
