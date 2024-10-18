export default function HeaderBackground({ fillColor }: { fillColor: string }) {
  return (
    <svg
      className="absolute inset-0 z-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 100"
      fill={fillColor}
    >
      <path d="M0 100V0h1000v4L0 100z"></path>
      <path d="M0 100V0h1000v24L0 100z" opacity=".5"></path>
      <path d="M0 100V0h1000v44L0 100z" opacity=".4"></path>
      <path d="M0 100V0h1000v64L0 100z" opacity=".4"></path>
      <path d="M0 100V0h1000v84L0 100z" opacity=".2"></path>
    </svg>
  );
}
