import Image from "next/image";

type Sponsor = {
  name: string;
  image: string;
  width: number;
  height: number;
  url: string;
  class?: string;
};

type SponsorCategory = {
  title: string;
  sponsors: Sponsor[];
  class?: string;
};

export default function Sponsors() {
  const sponsorCategories: Record<string, SponsorCategory> = {
    title: {
      title: "TITLE SPONSOR",
      sponsors: [
        {
          name: "Stack",
          image: "/sponsors/STACK_Community_by_GovTech.png",
          width: 717,
          height: 280,
          url: "https://stack.gov.sg/",
        },
      ],
    },
    gold: {
      title: "GOLD SPONSORS",
      sponsors: [
        {
          name: "Interledger",
          image: "/sponsors/InterledgerFoundation.png",
          width: 573,
          height: 157,
          url: "https://interledger.org/",
        },
        {
          name: "DynamicWeb",
          image: "/sponsors/DynamicWeb.png",
          width: 573,
          height: 87,
          url: "https://www.dynamicweb.com/",
        },
      ],
      class: "gap-8 xl:gap-24",
    },
    silver: {
      title: "SILVER SPONSORS",
      sponsors: [
        {
          name: "SG Innovate",
          image: "/sponsors/SGInnovate.png",
          width: 213,
          height: 60,
          url: "https://www.sginnovate.com/",
        },
        {
          name: "ahrefs",
          image: "/sponsors/ahrefs.png",
          width: 330,
          height: 60,
          url: "https://ahrefs.com/",
        },
      ],
      class: "gap-8 xl:gap-24",
    },
    partners: {
      title: "PARTNERS",
      sponsors: [
        {
          name: "Azure",
          image: "/sponsors/Microsoft_Azure.png",
          width: 403,
          height: 60,
          url: "https://azure.microsoft.com/",
        },
        {
          name: "Google",
          image: "/sponsors/Google.png",
          width: 281,
          height: 60,
          url: "https://www.google.com/",
          class: "md:mt-4 lg:mt-8",
        },
        {
          name: "Open AI",
          image: "/sponsors/OpenAI.png",
          width: 376,
          height: 60,
          url: "https://openai.com/",
        },
      ],
      class: "gap-8 xl:gap-24",
    },
    venue: {
      title: "VENUE SPONSORS",
      sponsors: [
        {
          name: "Rakuten",
          image: "/sponsors/Rakuten.png",
          width: 345,
          height: 60,
          url: "https://global.rakuten.com/corp/",
        },
        {
          name: "Open Government Products",
          image: "/sponsors/OGP.png",
          width: 441,
          height: 60,
          url: "https://www.open.gov.sg/",
        },
      ],
      class: "gap-8 xl:gap-24",
    },
  };

  return (
    <div className="flex flex-col gap-16 md:gap-40">
      {Object.values(sponsorCategories).map((category) => (
        <div key={category.title}>
          <h3 className="mb-5 text-center text-2xl font-bold text-hackomania-red md:mb-12 md:text-5xl">
            {category.title}
          </h3>
          <div
            className={`flex flex-col items-center justify-center gap-8 md:flex-row ${category.class} mx-12 xl:${category.sponsors.length > 2 ? "mx-40" : "mx-80"}`}
          >
            {category.sponsors.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  width={sponsor.width}
                  height={0}
                  className={`h-auto object-contain ${sponsor.class}`}
                />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
