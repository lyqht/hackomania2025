export default function SuspenseLoadingSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-hackomania-red border-t-transparent"></div>
    </div>
  );
}
