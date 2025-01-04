import GoldenRule from "@/components/custom/GoldenRule";
import Prize from "@/components/custom/Prize";
import TeamSection from "@/components/custom/TeamSection";
import { goldenRules } from "@/public/data/goldenrules";
import Image from "next/image";
import Sponsors from "@/components/custom/Sponsors";
import TimelineSection from "@/components/custom/TimelineSection";
export default async function Index() {
  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden p-5 md:p-20 lg:p-32">
        <head>{/* HackOMania 2025 Logo goes here */}</head>

        <section className="py-10" id="about">
          <div
            className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl"
            id="about-title"
          >
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h1>HACKOMANIA 2024</h1>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <Image
              src="https://placehold.co/600x400"
              alt="Previous HackOMania on-site photos"
              width={600}
              height={400}
            />
            <div className="flex flex-col justify-between gap-3">
              <p className="flex flex-col gap-4 text-xl">
                <p>
                  <span className="font-bold italic">HackOMania 2024</span> marked our return after
                  covid lockdowns and lifting of restrictions.
                </p>
                <p>
                  <span className="font-bold italic">Rakuten</span> hosted us as we Innovated for
                  tomorrow, building a resilient future! We thought it would be a slow start but we
                  were blown away by the enthusiasm of the participants and sponsors.{" "}
                </p>
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://hackomania2024.geekshacking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2024
                </a>
                <a
                  href="https://hackomania2019.geekshacking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2019
                </a>
                <a
                  href="https://hackomania2018.geekshacking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2018
                </a>
                <a
                  href="https://www.facebook.com/media/set/?set=oa.397402217293812&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2017
                </a>
                <a
                  href="https://www.facebook.com/media/set/?set=oa.206132056420830&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2016
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10" id="prizes">
          <div
            className="mb-7 flex flex-row items-center gap-3 fill-hackomania-green text-3xl font-bold text-hackomania-green md:mb-14 md:text-6xl"
            id="prizes-title"
          >
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2>PRIZES</h2>
          </div>

          <div>
            <Prize index={0} />

            <div className="mt-5 flex flex-col justify-center md:flex-row md:gap-20">
              <Prize index={1} />
              <Prize index={2} />
              <Prize index={3} />
            </div>
          </div>
        </section>
        <TimelineSection />
        <section className="py-10" id="prizes">
          <div
            className="mb-5 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-blue md:mb-10 md:text-6xl"
            id="rules-title"
          >
            <Image
              src="/BlueIcon.svg"
              alt=""
              width={60}
              height={60}
              className="fill-hackomania-blue"
            />
            <h2>9 GOLDEN RULES</h2>
          </div>
          <div
            className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3"
            id="golden-rules-grid"
          >
            {goldenRules.map((rule, index) => (
              <GoldenRule key={index} rule={rule.description} title={rule.title} index={index} />
            ))}
          </div>
        </section>

        <section className="py-10" id="venue">
          <div
            className="mb-5 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-green md:mb-10 md:text-6xl"
            id="roles-title"
          >
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2>VENUE</h2>
          </div>

          <section id="pre-event">
            <h2 className="mb-4 text-2xl font-bold text-hackomania-green md:text-5xl">PRE EVENT</h2>

            <div className="flex flex-col gap-5 md:flex-row">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7946893513426!2d103.84796911744382!3d1.2979024999999969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19ec2599519d%3A0x809fd655663da6d0!2sLazada%20One!5e0!3m2!1sen!2stw!4v1735830756269!5m2!1sen!2stw"
                className="h-auto w-full border-0 md:w-1/2"
                loading="lazy"
              ></iframe>

              <div>
                <h3 className="mb-4 text-xl font-bold text-hackomania-green md:text-4xl">
                  GETTING HERE
                </h3>

                <div className="mb-2">
                  <h4 className="text-lg font-bold text-hackomania-green md:text-2xl">Address</h4>
                  <p className="text-lg">
                    51 Bras Basah Rd, #04-08 Lazada One
                    <br />
                    Singapore 189554
                  </p>
                </div>
                <div className="mb-2">
                  <h4 className="text-lg font-bold text-hackomania-green md:text-2xl">Date</h4>
                  <p className="text-lg">8th February 2025</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-hackomania-green md:text-2xl">Time</h4>
                  <p className="text-lg">9:30am to 4:30pm</p>
                </div>
              </div>
            </div>
          </section>

          <section id="main-event" className="my-8">
            <h2 className="mb-4 text-2xl font-bold text-hackomania-green md:text-5xl">
              MAIN EVENT
            </h2>
            <div className="flex flex-col gap-5 md:flex-row">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8203085885248!2d103.8481571806732!3d1.2815570723565077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da190dd3c9d033%3A0x4cadb1e9e5280c4a!2s138%20Market%20St%2C%20%2320-01%20CapitaGreen%2C%20Singapore%20048946!5e0!3m2!1sen!2stw!4v1735830681400!5m2!1sen!2stw"
                className="h-auto w-full border-0 md:w-1/2"
                loading="lazy"
              ></iframe>

              <div>
                <h3 className="mb-4 text-xl font-bold text-hackomania-green md:text-4xl">
                  GETTING HERE
                </h3>

                <div className="mb-2">
                  <h4 className="text-lg font-bold text-hackomania-green md:text-2xl">Address</h4>
                  <p className="text-lg">
                    138 Market St, #20-01 CapitaGreen
                    <br />
                    Singapore 048946
                  </p>
                </div>
                <div className="mb-2">
                  <h4 className="text-lg font-bold text-hackomania-green md:text-2xl">Date</h4>
                  <p className="text-lg">15th to 16th February 2025</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-hackomania-green md:text-2xl">Time</h4>
                  <p className="text-lg">15th February, 10:30am to 16th February, 5:30pm</p>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="py-10" id="sponsors">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h2>SPONSORS</h2>
          </div>

          <Sponsors />
        </section>

        <section className="py-10" id="team">
          <div
            className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl"
            id="team-title"
          >
            <Image
              src="/MeetTheTeam.svg"
              alt="Icon"
              width={60}
              height={60}
              className="fill-hackomania-red"
            />
            <h2>MEET THE TEAM</h2>
          </div>

          <TeamSection />
        </section>
      </div>
    </>
  );
}
