export default function ButtonLoadingSpinner({ color = 'hackomania-red' }: { color?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className={`h-4 w-4 animate-spin rounded-full border-2 border-${color} border-t-transparent`}></div>
    </div>
  );
}
