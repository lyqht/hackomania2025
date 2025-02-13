import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";

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
        name: "Alex Lakatos",
        image: "/judge-mentors/alex-lakatos.jpg",
        description: "CTO, Interledger Foundation",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/alexlakatos/",
      },
      {
        name: "Koh Choong Yong",
        image: "/judge-mentors/koh-choong-yong.jpg",
        description: "Head of Product Engineering, SP Digital",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/kohcy/",
      },
      {
        name: "Scott Forsyth",
        image: "/judge-mentors/scott-forsyth.jpg",
        description: "CTO, Kitchen Copilot",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/scottjforsyth/",
      },
    ],
    class: "mx-12",
  },
  mentor: {
    title: "MENTORS",
    Judges: [
      {
        name: "Caitlin Cai",
        image: "/judge-mentors/caitlin-cai.jpg",
        description: "Product Manager, Rakuten",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/caitlincai/",
      },
      {
        name: "Hui Jing Chen",
        image: "/judge-mentors/hui-jing-chen.jpg",
        description: "COO, Interledger Foundation",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/huijingchen/",
      },
      {
        name: "Ioana Chiorean",
        image: "/judge-mentors/ioana-chiorean.jpg",
        description: "Engineering Manager, Interledger Foundation",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/ioanachiorean/",
      },
      {
        name: "Munteanu Benianin",
        image: "/judge-mentors/Munteanu-Benianin.jpg",
        description: "Software Engineer, open payments, Interledger Foundation",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/b-munteanu/",
      },
      {
        name: "Perwyl Liu Jinyu",
        image: "/judge-mentors/perwyl-liu.jpg",
        description: "Android, iOS, SP Group",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/perwyl-liu-b1283274/",
      },
      {
        name: "Puspak Patro",
        image: "/judge-mentors/puspak-patro.jpg",
        description: "CEO, Kitchen Copilot",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/puspakpatro/",
      },
      {
        name: "Stella Sofia Isidro Sabate",
        image: "/judge-mentors/stella-sis.jpg",
        description: "Senior Frontend Developer, SP Group",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/stellasis/",
      },
      {
        name: " Baji Babu Yerraguntla",
        image: "",
        description: "Microservice, Cloud, DevOps, SP Group",
        width: 400,
        height: 0,
        url: "https://www.linkedin.com/in/bajibabuyerraguntla/",
      },
      {
        name: "Dragos Palade",
        image: "",
        description: "Software Engineer, open payments, Interledger Foundation",
        width: 400,
        height: 0,
        url: "",
      },
      {
        name: "Bogdan Sandu",
        image: "",
        description: "Software Engineer, open payments, Interledger Foundation",
        width: 400,
        height: 0,
        url: "",
      },
    ] /* .sort((a, b) => {
      if (!a.image && b.image) return 1; // if mentora does not have image, but mentor b does, move mentor a down
      if (a.image && !b.image) return -1; // if mentor a has image, but mentor b does not, move mentor a up
      return a.name.localeCompare(b.name); // if both mentors have images, then sort by alphabetical order. -1 means that a should come before b
    } */, // Sort the mentors by name, but keep those without images at the end
    class: "gap-8 xl:gap-24 mx-12",
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
              } my-6 items-center`}
            >
              <div
                className={`flex w-full justify-center md:w-1/2 ${
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                }`}
              >
                {/* Don't render image if not present */}
                {Judge.image && (
                  <Image
                    src={Judge.image}
                    alt={Judge.name}
                    width={Judge.width}
                    height={0}
                    className="h-auto w-3/4 rounded-2xl object-contain md:ml-12 md:mr-12 md:h-80 md:w-auto"
                    aria-label={`Portrait of ${Judge.name}`}
                  />
                )}
              </div>
              <div className={`w-3/4 ${index % 2 === 0 ? "" : "md:text-right"} p-4 md:w-1/2`}>
                <h4 className="text-2xl font-bold md:text-3xl">{Judge.name}</h4>
                <p>{Judge.description}</p>
                {/* Don't render link if not present */}
                {Judge.url && (
                  <Link
                    href={Judge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-hackomania-green hover:underline"
                  >
                    <FaLinkedin
                      className="text-2xl md:text-3xl"
                      aria-label={`LinkedIn of ${Judge.name}`}
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
