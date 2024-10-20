import Section from "@/components/custom/Section";
import Hero from "@/components/hero";
import getColor from "@/tailwind-config";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="flex flex-1 flex-col">
        <Section
          title="What is HackOMania?"
          sectionBackgroundColor={getColor("hackomania-yellow")}
        >
          <div className="flex flex-col gap-4">
            <p className="text-lg">
              HackOMania is a local hackathon organised by GeeksHacking Singapore to promote healthy
              living and connection using technology.

            </p>
          </div>
        </Section>
        <Section
          title="Theme"
          sectionBackgroundColor={getColor("hackomania-green")}
          sectionDividerBackgroundColor={getColor("hackomania-yellow")}
        >
          <div className="flex flex-col gap-4">
            <p className="text-lg">
              HEALTHY LIVING FOR A CONNECTED WORLD
            </p>
          </div>
        </Section>
        <Section
          title="Sponsors"
          sectionBackgroundColor={getColor("hackomania-red")}
          sectionDividerBackgroundColor={getColor("hackomania-green")}
          dividerClassName="scale-x-[-1]" // flip the divider
        >
          <div className="flex flex-col gap-4">
            <p className="text-lg">
              We are still looking for sponsors! If you are interested in sponsoring HackOMania 2025, please contact us at <a href="mailto:contact@geekshacking.com">contact@geekshacking.com</a>.
            </p>
          </div>
        </Section>
      </main>
    </>
  );
}
