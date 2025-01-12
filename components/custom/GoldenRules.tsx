export interface IRules {
  title: string;
  description: string;
}

export const goldenRules: IRules[] = [
  {
    title: "TEAM FORMATION",
    description:
      "Participants must form teams of 3 to 5 members. Each team must have at least one representative present throughout the event.",
  },
  {
    title: "OWNERSHIP OF WORK",
    description:
      "Teams retain the intellectual property rights to the projects they create during the hackathon.",
  },
  {
    title: "USE OF TOOLS",
    description:
      "All teams are required to use GitHub and commit their work to a public repository for transparency and evaluation.",
  },
  {
    title: "WORK INTEGRITY",
    description:
      "All coding and development must be completed during the hackathon. Pre-coded work or previously built projects are strictly prohibited.",
  },
  {
    title: "PROJECT PRESENTATION",
    description:
      "Each team will have 5 minutes to pitch their project, followed by a brief Q&A session with judges (if applicable).",
  },
  {
    title: "CODE OF CONDUCT",
    description:
      "Participants are expected to be kind, respectful, and play fair. Any form of harassment, discrimination, or unsporting behavior may result in immediate disqualification.",
  },
  {
    title: "SUBMISSION DEADLINE",
    description:
      "All projects must be submitted by the specified deadline. Late submissions will not be considered for judging.",
  },
];

function GoldenRule({ rule, title, index }: { rule: string; title: string; index: number }) {
  return (
    <li className="max-w-sm">
      <h3 className="mb-2 text-2xl font-bold text-hackomania-blue md:text-4xl">
        {index + 1}. {title}
      </h3>
      <p className="md:text-lg">{rule}</p>
    </li>
  );
}

export default function GoldenRules() {
  return (
    <ol
      className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-4 lg:grid-cols-3"
      id="golden-rules-grid"
    >
      {goldenRules.map((rule, index) => (
        <GoldenRule key={index} rule={rule.description} title={rule.title} index={index} />
      ))}
    </ol>
  );
}
