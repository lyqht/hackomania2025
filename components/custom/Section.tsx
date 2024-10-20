import { cn } from "@/lib/utils";
import SectionDividerBackground from "./SectionDividerBackground";

export default function Section({
  children,
  className,
  contentClassName,
  headingClassName,
  title,
  sectionBackgroundColor,
  sectionDividerBackgroundColor,
  dividerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  headingClassName?: string;
  contentClassName?: string;
  title: string;
  sectionBackgroundColor?: string;
  sectionDividerBackgroundColor?: string;
  dividerClassName?: string;
}) {
  return (
    <>
      {sectionDividerBackgroundColor && (
        <div style={{ backgroundColor: sectionBackgroundColor }}>
            <SectionDividerBackground
              fillColor={sectionDividerBackgroundColor}
              className={dividerClassName}
            />
        </div>
      )}
      <section
        aria-labelledby={`heading-${title}`}
        className={cn("w-full ps-0 md:ps-4 lg:ps-8", className)}
        style={{ backgroundColor: sectionBackgroundColor }}
      >
        <div
          className={cn(
            "px-4 py-8 md:p-12 lg:p-20 flex w-full max-w-6xl flex-col items-start text-start",
            contentClassName,
          )}
        >
          <h2
            id={`heading-${title}`}
            className={cn("font-heading z-10 text-4xl pb-8", headingClassName)}
          >
            {title}
          </h2>
          {children}
        </div>
      </section>
    </>
  );
}
