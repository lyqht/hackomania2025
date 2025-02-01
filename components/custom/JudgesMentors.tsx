import Image from "next/image";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";

type Judge = {
  name: string;
  image: string;
  description: string;
  width: number;
  height: number;
  url: string;
  class?: string;
};

type JudgeCategory = {
  title: string;
  Judges: Judge[];
  class?: string;
};

const JudgeCategories: Record<string, JudgeCategory> = {
  title: {
    title: "JUDGES",
    Judges: [
      {
        name: "Judge 1",
        image: "/sponsors/STACK_Community_by_GovTech.png",
        description: "Judge 1 is lorem ipsum",
        width: 400,
        height: 0,
        url: "https://www.developer.tech.gov.sg/communities/building-a-community/resources/community-development-directory",
      },
      {
        name: "Judge 2",
        image: "/team/images/roger.jpg",
        description: "Judge 2 is Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        width: 300,
        height: 0,
        url: "https://www.developer.tech.gov.sg/communities/building-a-community/resources/community-development-directory",
      },
      {
        name: "Judge 3",
        image: "/team/images/pearlyn.jpg",
        description: "Judge 3 is lorem ipsum",
        width: 300,
        height: 0,
        url: "https://www.developer.tech.gov.sg/communities/building-a-community/resources/community-development-directory",
      },
    ],
    class: "mx-12",
  },
  mentor: {
    title: "MENTORS",
    Judges: [
      {
        name: "ahrefs",
        image: "/team/images/daksh.jpg",
        description:
          "roger is a judge for hackomania. More information about roger would be put here.",
        width: (248 * 5) / 5,
        height: (60 * 5) / 5,
        url: "https://ahrefs.com/",
      },
    ],
    class: "gap-8 xl:gap-24 mx-24",
  },
};

export default function Judges() {
  return (
    <div className="flex flex-col gap-16 md:mb-24 md:gap-32">
      {Object.values(JudgeCategories).map((category) => (
        <div key={category.title}>
          <div className="flex flex-col gap-16 md:-mx-20 md:mb-24 lg:-mx-32">
            <div className="w-full bg-hackomania-green">
              <h3 className="text-center text-2xl font-bold text-background md:my-12 md:text-5xl">
                {category.title}
              </h3>
            </div>
          </div>
          {category.Judges.map((Judge, index) => (
            <div
              key={Judge.name}
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              } my-8 items-center`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src={Judge.image}
                  alt={Judge.name}
                  width={Judge.width}
                  height={300}
                  className="h-auto w-full object-cover"
                  aria-label={`Portrait of ${Judge.name}`}
                />
              </div>
              <div className="w-full px-4 md:w-1/2">
                <h4 className="text-xl font-bold">{Judge.name}</h4>
                <p>{Judge.description}</p>
                <Link
                  href={Judge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-hackomania-green hover:underline"
                >
                  Visit Profile
                  <FaLink className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
