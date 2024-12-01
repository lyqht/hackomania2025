import getColor from "@/tailwind-config";
import Image from "next/image";

export default async function Index() {
  return (
    <>
      <main className="flex flex-1 flex-col p-5 md:p-10">
        <head>
          {/* HackOMania 2025 Logo goes here */}
        </head>

        <section className="py-10" id="about">
          <div className="mb-3 text-hackomania-red text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="about-title">
            <Image src="/hackomania-star.svg" alt="Star" width={40} height={40} />
            <h1>HACKOMANIA 2024</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div>
              <p><span className="font-bold italic">HackOMania 2024</span> marked our return after covid lockdowns and lifting of restrictions.</p>
              <p className="mt-3"><span className="font-bold italic">Rakuten</span> hosted us as we Innovated for tomorrow, building a resilient future! We thought it would be a slow start but we were blown away by the enthusiasm of the participants and sponsors. </p>
            </div>

            <button className="bg-hackomania-red text-xl font-bold w-full py-3 rounded-md text-white">
              SEE MORE
            </button>
          </div>
        </section>

        <section className="py-10" id="about">
          <div className="mb-3 text-hackomania-blue text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="about-title">
            <Image src="/challenges.svg" alt="Flower" width={40} height={40} />
            <h1>CHALLENGES</h1>
          </div>

          
        </section>
      </main>
    </>
  );
}
