import Image from "next/image";
import Link from "next/link";

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

const sponsorCategories: Record<string, SponsorCategory> = {
  title: {
    title: "TITLE SPONSOR",
    sponsors: [
      {
        name: "Stack",
        image: "/sponsors/STACK_Community_by_GovTech.png",
        width: (717 * 4) / 5,
        height: (280 * 4) / 5,
        url: "https://www.developer.tech.gov.sg/communities/building-a-community/resources/community-development-directory",
      },
    ],
    class: "mx-12",
  },
  gold: {
    title: "GOLD SPONSORS",
    sponsors: [
      {
        name: "Interledger",
        image: "/sponsors/InterledgerFoundation.png",
        width: (573 * 3) / 5,
        height: (157 * 3) / 5,
        url: "https://interledger.org/",
      },
      {
        name: "Kitchen Copilot",
        image: "/sponsors/Kitchen_Copilot.png",
        width: (572 * 3) / 5,
        height: (202 * 3) / 5,
        url: "https://www.kitchencopilot.com/",
      },
    ],
    class: "gap-8 xl:gap-24 mx-12",
  },
  silver: {
    title: "SILVER SPONSORS",
    sponsors: [
      {
        name: "SG Innovate",
        image: "/sponsors/SGInnovate.png",
        width: (160 * 4) / 5,
        height: (60 * 4) / 5,
        url: "https://www.sginnovate.com/career-development-jobs",
      },
      {
        name: "ahrefs",
        image: "/sponsors/ahrefs.png",
        width: (248 * 4) / 5,
        height: (60 * 4) / 5,
        url: "https://ahrefs.com/",
      },
    ],
    class: "gap-8 xl:gap-24 mx-24",
  },
  partners: {
    title: "PARTNERS",
    sponsors: [
      {
        name: "Google",
        image: "/sponsors/Google.png",
        width: (211 * 4) / 5,
        height: (60 * 4) / 5,
        url: "https://www.google.com/",
        class: "md:mt-4 lg:mt-8",
      },
      {
        name: "DynamicWeb",
        image: "/sponsors/DynamicWeb.png",
        width: (573 * 3) / 5,
        height: (87 * 3) / 5,
        url: "https://www.dynamicweb.com/",
        class: "md:mt-4 lg:mt-8",
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
        width: (259 * 4) / 5,
        height: (60 * 4) / 5,
        url: "https://www.linkedin.com/company/rakuten-asia-pte-ltd/",
      },
      {
        name: "Open Government Products",
        image: "/sponsors/OGP.png",
        width: (331 * 4) / 5,
        height: (60 * 4) / 5,
        url: "https://www.open.gov.sg/",
      },
    ],
    class: "gap-8 xl:gap-24 mx-24",
  },
};

export default function Sponsors() {
  return (
    <div className="flex flex-col gap-16 md:mb-24 md:gap-32">
      {Object.values(sponsorCategories).map((category) => (
        <div key={category.title}>
          <h3 className="mb-5 text-center text-2xl font-bold text-hackomania-red md:mb-12 md:text-5xl">
            {category.title}
          </h3>
          <div
            className={`flex flex-col items-center justify-center gap-8 md:flex-row ${category.class}`}
          >
            {category.sponsors.map((sponsor) => (
              <Link
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
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
