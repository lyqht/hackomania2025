import Image from "next/image";

export interface Ichallenges {
  owner: string;
  statement: string;
  description: string;
  pdf: string;
}

export const challengeStatements: Ichallenges[] = [
  {
    owner: "/sponsors/InterledgerFoundation.png",
    statement: "Interledger Foundation: Quitting Addiction Together",
    description:
      "Create a support network donation platform where users contribute micro-donations via Open Payments API to recovery programs, peer mentors, or counseling services based on milestones reached. This platform could be gamified to encourage users.",
    pdf: "/challengeStatements/HackOMania Challenge Statement 1.pdf",
  },
  {
    owner: "/sponsors/Kitchen_Copilot.png",
    statement: "Kitchen Copilot: Let's reinvent the way food delights us to promote healthy living",
    description:
      "We are looking for a group of enthusiasts to work with us to reinvent the way food delights us to promote healthy living. We have developed an application called Kitchen Copilot to help individuals prepare meals and recipes. We want to explore how we can use Kitchen Copilot more easily and be part of an individual's daily use.",
    pdf: "/challengeStatements/Kitchen Copilot Challenge Statement.pdf",
  },
  {
    owner: "/geekshacking.png",
    statement: "Geek Connect: Find Your Tribe IRL",
    description:
      "GeeksHacking is a tech community dedicated to giving back, growing as individuals, and embracing our geek identity. This challenge invites participants to build a platform that fosters real-world connections within the geek community.",
    pdf: "/challengeStatements/HackOMania Challenge Statement 3.pdf",
  },
];

export default function Challenges() {
  return (
    <div className="grid justify-center gap-2 md:gap-0">
      {challengeStatements.map((challenge, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-center"
        >
          {/* Logo */}
          <div className="flex h-24 w-full justify-center md:h-28 md:w-1/4">
            <Image
              src={challenge.owner}
              alt="Challenge Logo"
              width={200}
              height={180}
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Desktop Blue Divider Line */}
          <div className="my-4 hidden h-0.5 w-full bg-hackomania-blue md:mx-4 md:block md:h-64 md:w-0.5"></div>

          {/* Challenge Statement */}
          <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
            <p className="text-balance text-base font-bold md:text-xl">{challenge.statement}</p>
            <p className="text-balance text-base font-medium md:text-xl">{challenge.description}</p>
            <a
              href={challenge.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-md bg-hackomania-blue px-4 py-2 font-bold text-white transition duration-200 hover:opacity-90"
            >
              Download Full Statement
            </a>
            {/* Mobile Divider Line, don't render last line */}
            {index < challengeStatements.length - 1 && (
              <div className="my-4 h-0.5 w-full bg-hackomania-blue md:hidden"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
