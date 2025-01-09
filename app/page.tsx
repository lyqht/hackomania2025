import GoldenRule from "@/components/custom/GoldenRule";
import Prize from "@/components/custom/Prize";
import TeamSection from "@/components/custom/TeamSection";
import { goldenRules } from "@/public/data/goldenrules";
import Image from "next/image";
import Sponsors from "@/components/custom/Sponsors";
import TimelineSection from "@/components/custom/TimelineSection";
import Link from "next/link";
import EventbriteButton from "@/components/custom/EventbriteRegisterButton";

export default async function Index() {
  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-0 md:px-20 lg:px-32">
        <header className="flex w-full flex-col items-center justify-center py-20">
          <div className="flex w-full max-w-[90vw] flex-col items-start md:max-w-[60vw]">
            {/* HackOMania Logo */}
            <Image
              src="/hackomania.svg"
              alt="HackOMania Logo"
              width={0}
              height={0}
              className="hidden h-auto w-full md:block"
              priority
            />

            {/* HackOMania Mobile Logo */}
            <Image
              src="/hackomania-mobile-logo.svg"
              alt="HackOMania Logo"
              width={0}
              height={0}
              className="block h-auto w-[80vw] py-5 md:hidden"
              priority
            />

            {/* Event Details */}
            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
              {/* Year Logo */}
              <Image
                src="/2025.svg"
                alt="2025 Logo"
                width={0}
                height={0}
                className="hidden h-auto w-[15vw] md:block md:w-[10vw]"
              />

              {/* Event Cards */}
              <div className="flex flex-grow flex-col gap-4">
                {/* Pre-Event Card */}
                <div className="flex flex-row items-center bg-hackomania-red p-4 text-white">
                  <h3 className="text-xl font-bold md:text-3xl">PRE EVENT</h3>
                  <p className="ml-auto text-sm md:text-base">8 February, Saturday</p>
                </div>

                {/* Main Event Card */}
                <div className="flex flex-row items-center bg-hackomania-red p-4 text-white">
                  <h3 className="text-xl font-bold md:text-3xl">MAIN EVENT</h3>
                  <p className="ml-auto text-sm md:text-base">15-16 February, Saturday-Sunday</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-2 flex flex-row gap-3 md:mt-5">
                  <EventbriteButton />
                  <button className="border-4 border-hackomania-red p-3 px-5 text-base font-bold text-hackomania-red transition-all hover:bg-hackomania-red hover:text-white md:text-2xl">
                    LINKTREE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="py-10" id="about">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h2>HACKOMANIA 2024</h2>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <Image
              src="https://placehold.co/600x400"
              alt="Previous HackOMania on-site photos"
              width={600}
              height={400}
            />
            <div className="flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-4 text-xl">
                <p>
                  <span className="font-bold italic">HackOMania 2024</span> marked our return after
                  covid lockdowns and lifting of restrictions.
                </p>
                <p>
                  <span className="font-bold italic">Rakuten</span> hosted us as we Innovated for
                  tomorrow, building a resilient future! We thought it would be a slow start but we
                  were blown away by the enthusiasm of the participants and sponsors.{" "}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="https://hackomania2024.geekshacking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2024
                </Link>
                <Link
                  href="https://hackomania2019.geekshacking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2019
                </Link>
                <Link
                  href="https://hackomania2018.geekshacking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2018
                </Link>
                <Link
                  href="https://www.facebook.com/media/set/?set=oa.397402217293812&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2017
                </Link>
                <Link
                  href="https://www.facebook.com/media/set/?set=oa.206132056420830&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-hackomania-red p-5 py-3 text-center text-xl font-bold text-white"
                >
                  2016
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10" id="prizes">
          <div className="mb-7 flex flex-row items-center gap-3 fill-hackomania-green text-3xl font-bold text-hackomania-green md:mb-14 md:text-6xl">
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
          <div className="mb-5 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-blue md:mb-10 md:text-6xl">
            <Image
              src="/BlueIcon.svg"
              alt=""
              width={60}
              height={60}
              className="fill-hackomania-blue"
            />
            <h2>9 GOLDEN RULES</h2>
          </div>
          <ol
            className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3"
            id="golden-rules-grid"
          >
            {goldenRules.map((rule, index) => (
              <GoldenRule key={index} rule={rule.description} title={rule.title} index={index} />
            ))}
          </ol>
        </section>

        <section className="py-10" id="venue">
          <div className="mb-5 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-green md:mb-10 md:text-6xl">
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2>VENUE</h2>
          </div>

          <div>
            <div className="py-10" id="pre-event">
              <h3 className="mb-4 text-2xl font-bold text-hackomania-green md:text-5xl">
                PRE EVENT
              </h3>

              <div className="flex flex-col gap-5 md:flex-row">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7946893513426!2d103.84796911744382!3d1.2979024999999969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19ec2599519d%3A0x809fd655663da6d0!2sLazada%20One!5e0!3m2!1sen!2stw!4v1735830756269!5m2!1sen!2stw"
                  className="h-auto w-full border-0 md:w-1/2"
                  loading="lazy"
                ></iframe>

                <div>
                  <h4 className="mb-4 text-xl font-bold text-hackomania-green md:text-4xl">
                    GETTING HERE
                  </h4>

                  <div className="mb-2">
                    <p className="text-lg font-bold text-hackomania-green md:text-2xl">Address</p>
                    <p className="text-lg">
                      51 Bras Basah Rd, #04-08 Lazada One
                      <br />
                      Singapore 189554
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="text-lg font-bold text-hackomania-green md:text-2xl">Date</p>
                    <p className="text-lg">8th February 2025</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-hackomania-green md:text-2xl">Time</p>
                    <p className="text-lg">9:30am to 4:30pm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-10" id="main-event">
              <h3 className="mb-4 text-2xl font-bold text-hackomania-green md:text-5xl">
                MAIN EVENT
              </h3>
              <div className="flex flex-col gap-5 md:flex-row">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8203085885248!2d103.8481571806732!3d1.2815570723565077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da190dd3c9d033%3A0x4cadb1e9e5280c4a!2s138%20Market%20St%2C%20%2320-01%20CapitaGreen%2C%20Singapore%20048946!5e0!3m2!1sen!2stw!4v1735830681400!5m2!1sen!2stw"
                  className="h-auto w-full border-0 md:w-1/2"
                  loading="lazy"
                ></iframe>

                <div>
                  <h4 className="mb-4 text-xl font-bold text-hackomania-green md:text-4xl">
                    GETTING HERE
                  </h4>

                  <div className="mb-2">
                    <p className="text-lg font-bold text-hackomania-green md:text-2xl">Address</p>
                    <p className="text-lg">
                      138 Market St, #20-01 CapitaGreen
                      <br />
                      Singapore 048946
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="text-lg font-bold text-hackomania-green md:text-2xl">Date</p>
                    <p className="text-lg">15th to 16th February 2025</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-hackomania-green md:text-2xl">Time</p>
                    <p className="text-lg">15th February, 10:30am to 16th February, 5:30pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8" id="sponsors">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h2>SPONSORS</h2>
          </div>

          <Sponsors />
        </section>

        <section className="py-8" id="team">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
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
