import TeamSection from "@/components/custom/TeamSection";
import Image from "next/image";
import Sponsors from "@/components/custom/Sponsors";
import TimelineSection from "@/components/custom/TimelineSection";
import Link from "next/link";
import EventbriteButton from "@/components/custom/EventbriteModalButton";
import ImageCarousel from "@/components/custom/ImageCarousel";
import Prizes from "@/components/custom/Prizes";
import GoldenRules from "@/components/custom/GoldenRules";

export default async function Index() {
  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-0 md:px-20 lg:px-32">
        <header className="flex w-full flex-col items-center justify-center py-0 md:py-20">
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
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <div className="flex flex-col justify-between gap-4">
                {/* Year Logo */}
                <Image
                  src="/2025.svg"
                  alt="2025 Logo"
                  width={0}
                  height={0}
                  className="hidden h-auto w-[15vw] md:block md:w-[10vw]"
                />
                <Link
                  className="flex items-center gap-2 border-4 border-hackomania-red p-3 px-5 text-base font-bold text-hackomania-red transition-all hover:bg-hackomania-red hover:text-white md:text-xl"
                  href="https://linktr.ee/hackomania2025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="var(--hackomania-red)"
                      d="m13.736 5.853l4.005-4.117l2.325 2.38l-4.2 4.005h5.908v3.305h-5.937l4.229 4.108l-2.325 2.334l-5.74-5.769l-5.741 5.769l-2.325-2.325l4.229-4.108H2.226V8.121h5.909l-4.2-4.004l2.324-2.381l4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z"
                    />
                  </svg>
                  LINKTREE
                </Link>
              </div>

              {/* Event Cards */}
              <div className="flex grow flex-col gap-4">
                {/* Pre-Event Card */}
                <div className="flex flex-row items-center justify-between gap-1 bg-hackomania-red p-4 text-white">
                  <div className="flex flex-col text-start">
                    <h3 className="text-nowrap text-xl font-bold md:text-3xl">PRE EVENT</h3>
                    <p className="text-sm md:text-base">8 February, Saturday</p>
                  </div>
                  <EventbriteButton />
                </div>

                {/* Main Event Card */}
                <div className="flex flex-row items-center justify-between gap-3 bg-hackomania-red p-4 text-white">
                  <div className="flex grow flex-col text-start">
                    <h3 className="text-nowrap text-xl font-bold md:text-3xl">MAIN EVENT</h3>
                    <p className="text-sm md:text-base">15-16 February, Saturday-Sunday</p>
                  </div>
                  <a
                    href="https://forms.gle/py3AQyYHfjWmPtEM7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-hackomania-white text-hackomania-white shrink border-4 p-1.5 text-base font-bold transition-all hover:bg-white hover:text-hackomania-red md:p-3 md:px-5 md:text-2xl"
                  >
                    PRE-REGISTER
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="group py-10 intersect:animate-slide-in-from-left" id="about">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h2>About HACKOMANIA</h2>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:py-10">
            <div className="w-full md:w-1/2">
              <ImageCarousel />
            </div>
            <div className="flex flex-col gap-3 md:gap-8">
              <div className="flex flex-col gap-4 text-balance text-center text-base md:text-xl">
                <p>
                  HackOMania is GeeksHacking’s annual hackathon. We bring together students, tech
                  enthusiasts, and tech professionals for 24 hours to tackle real world challenges.
                </p>
                <p>
                  Now in its 6th year, HackOMania 2025 challenges you to develop innovative
                  solutions to break free from digital addictions, unhealthy habits, and reconnect
                  with the real world. Let’s build a{" "}
                  <span className="font-bold italic">
                    healthier, more connected world, together!
                  </span>
                </p>
              </div>
              <div className="mb-auto mt-6 flex flex-wrap justify-center gap-4">
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

        <section className="group py-10 intersect:animate-slide-in-from-right" id="prizes">
          <div className="mb-7 flex flex-row items-center gap-3 fill-hackomania-green text-3xl font-bold text-hackomania-green md:mb-14 md:text-6xl">
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2>PRIZES</h2>
          </div>
          <Prizes />
        </section>

        <TimelineSection />

        <section className="group py-10 intersect:animate-slide-in-from-left" id="golden-rules">
          <div className="mb-5 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-blue md:mb-10 md:text-6xl">
            <Image src="/BlueIcon.svg" alt="" width={60} height={60} />
            <h2>7 GOLDEN RULES</h2>
          </div>
          <GoldenRules />
        </section>

        <section className="group py-10 intersect:animate-slide-in-from-right" id="venue">
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

        <section className="group py-8 intersect:animate-slide-in-from-left" id="sponsors">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h2>SPONSORS</h2>
          </div>
          <Sponsors />
        </section>

        <section className="group py-8 intersect:animate-slide-in-from-right" id="team">
          <div className="mb-7 flex flex-row items-center gap-3 text-3xl font-bold text-hackomania-red md:mb-14 md:text-6xl">
            <Image
              src="/MeetTheTeam.svg"
              alt="Icon"
              width={60}
              height={60}
              className="intersect:animate-spin-slow"
            />
            <h2>MEET THE TEAM</h2>
          </div>
          <TeamSection />
        </section>
      </div>
    </>
  );
}
