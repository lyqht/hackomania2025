import SuspenseLoadingSpinner from "@/components/custom/SuspenseLoadingSpinner";

export default function Loading() {
  return (
    <div className="flex flex-col gap-5 p-5 md:p-20">
      <div>
        <div className="mb-1 h-8 w-64 animate-pulse rounded-lg bg-neutral-200 md:h-10"></div>
        <div className="h-6 w-48 animate-pulse rounded-lg bg-neutral-200 md:h-8"></div>
      </div>

      <div className="rounded-lg border border-neutral-400">
        <section className="p-5">
          <div className="mb-3 h-7 w-48 animate-pulse rounded-lg bg-neutral-200"></div>
          <div className="flex flex-col justify-around gap-2 md:flex-row md:text-center">
            <div>
              <div className="mb-2 h-6 w-32 animate-pulse rounded-lg bg-neutral-200"></div>
              <div className="h-5 w-24 animate-pulse rounded-lg bg-neutral-200"></div>
            </div>
            <div>
              <div className="mb-2 h-6 w-32 animate-pulse rounded-lg bg-neutral-200"></div>
              <div className="h-5 w-24 animate-pulse rounded-lg bg-neutral-200"></div>
            </div>
          </div>
        </section>

        <div className="my-3 border border-neutral-400"></div>

        <section className="p-5">
          <SuspenseLoadingSpinner />
        </section>
      </div>
    </div>
  );
}
