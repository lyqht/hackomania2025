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
        className={cn("flex w-full items-center justify-center", className)}
        style={{ backgroundColor: sectionBackgroundColor }}
      >
        <div
          className={cn(
            "flex w-full max-w-5xl grow flex-col items-start px-5 py-8 text-start md:py-12 lg:py-20",
            contentClassName,
          )}
        >
          <h2
            id={`heading-${title}`}
            className={cn("font-heading z-10 pb-8 text-4xl", headingClassName)}
          >
            {title}
          </h2>
          {children}
        </div>
      </section>
    </>
  );
}
