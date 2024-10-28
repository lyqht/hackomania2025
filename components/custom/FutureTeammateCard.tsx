export default function FutureTeammateCard() {
  return (
    <div className="flex items-center gap-6 rounded-lg border-2 border-dashed border-gray-300 bg-white bg-opacity-50 p-4 shadow-md">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 bg-opacity-50">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-600">Add teammate</h2>
      </div>
    </div>
  );
}
