export default function SectionDividerBackground({
  fillColor,
  className,
  type = "stairs",
}: {
  fillColor: string;
  className?: string;
  type?: "stairs" | "wave";
}) {
  return type === "stairs" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 100"
      fill={fillColor}
      className={className}
    >
      <path d="M0 0v100h125V86h125V73h125V59h125V45h125V31h125V18h125V4h125V0H0z"></path>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill={fillColor}>
      <path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path>
      <path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path>
      <path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path>
    </svg>
  );
}
