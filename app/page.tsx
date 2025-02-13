import GitHubSignInButton from "@/components/custom/GitHubSignInButton";
import GoldenRulesSection from "@/components/custom/landing/GoldenRulesSection";
import ImageCarousel from "@/components/custom/ImageCarousel/ImageCarousel";
import NavigationBar from "@/components/custom/NavigationBar";
import OrganizersSection from "@/components/custom/landing/OrganizersSection";
import ChallengesSection from "@/components/custom/landing/ChallengesSection";
import PrizesSection from "@/components/custom/landing/PrizesSection";
import Sponsors from "@/components/custom/Sponsors";
import JudgesMentors from "@/components/custom/JudgesMentors";
import TimelineSection from "@/components/custom/TimelineSection";
import Image from "next/image";
import Link from "next/link";

export default async function Index() {
  return (
    <>
      <NavigationBar />
      <Link
        className="group fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full border-4 border-hackomania-red bg-white p-3 text-base font-bold text-hackomania-red transition-all md:text-xl md:hover:bg-hackomania-red md:hover:text-white"
        href="https://linktr.ee/hackomania2025"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="transition-colors"
        >
          <path
            fill="currentColor"
            d="m13.736 5.853l4.005-4.117l2.325 2.38l-4.2 4.005h5.908v3.305h-5.937l4.229 4.108l-2.325 2.334l-5.74-5.769l-5.741 5.769l-2.325-2.325l4.229-4.108H2.226V8.121h5.909l-4.2-4.004l2.324-2.381l4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z"
          />
        </svg>
        <span className="min-w-0 max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 md:group-hover:mx-2 md:group-hover:max-w-[100px]">
          LINKTREE
        </span>
      </Link>
      <div className="w-full max-w-full">
        <div className="z-30 m-2 rounded-lg border-2 border-hackomania-red p-4 text-lg font-medium text-hackomania-red md:mx-20">
          <p>
            We are still actively updating the website! Please check back for more information! :)
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-0 md:px-20 lg:px-32">
        <div className="relative flex min-h-[calc(100vh-120px)] w-full flex-col items-center justify-center md:min-h-[calc(100vh-180px)]">
          <h1 className="sr-only">HackOMania 2025</h1>
          <div className={`grid-bg pointer-events-none absolute top-0 h-96 w-full md:h-60`}></div>
          <div className="flex w-full max-w-[90vw] flex-col items-center justify-center gap-8 md:max-w-[80vw]">
            {/* HackOMania Logo */}
            <Image
              src="/hackomania-long-logo.svg"
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
              className="block h-auto w-[80vw] py-2 md:hidden"
              priority
            />
            {/* HackOMania Mobile Theme Banner */}
            <div className="flex flex-row items-center pb-5 text-2xl font-bold text-hackomania-blue md:hidden md:py-9 md:text-6xl">
              <h2 className="whitespace-pre-line text-center leading-snug">
                HEALTHY LIVING FOR A CONNECTED WORLD
              </h2>
            </div>

            {/* Event Details */}
            <div className="flex w-full max-w-2xl flex-col items-center gap-8 pt-0 md:pt-8">
              {/* Event Cards */}
              <div className="flex w-full flex-col gap-4">
                {/* Main Event registration */}
                <div className="flex flex-row items-center justify-between gap-3 bg-hackomania-red p-4 text-white">
                  <div className="flex grow flex-col text-start">
                    <p className="text-nowrap text-xl font-bold md:text-3xl">MAIN EVENT</p>
                    <p className="text-sm md:text-base">15-16 February, Saturday-Sunday</p>
                  </div>
                  <a
                    href="https://www.eventbrite.com/e/hackomania-2025-healthy-living-for-a-connected-world-tickets-1147838859929"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-hackomania-white text-hackomania-white shrink border-4 p-1.5 text-base font-bold transition-all hover:bg-white hover:text-hackomania-red md:p-3 md:px-5 md:text-2xl"
                  >
                    REGISTER NOW
                  </a>
                </div>
              </div>
              <GitHubSignInButton />
            </div>
          </div>
        </div>

        <section className="group relative py-10 intersect:animate-slide-in-from-left" id="about">
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-red md:mb-14 md:flex-row md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <div>
              <h2 className="flex flex-col gap-0 text-balance text-center md:text-start">
                <span>
                  HackOMania 2025<span className="hidden md:inline">:</span>
                </span>
                <span className="text-base md:text-2xl lg:text-5xl">
                  Healthy Living for a Connected World
                </span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-10 md:flex-row md:py-8">
            <div className="w-full md:w-1/2">
              <ImageCarousel />
            </div>
            <div className="flex flex-1 flex-col gap-3 md:gap-8">
              <div className="flex flex-col gap-4 text-balance text-left text-base md:text-xl">
                <p>
                  HackOMania is GeeksHacking&apos;s annual hackathon. We bring together students,
                  tech enthusiasts, and tech professionals for 24 hours to tackle real world
                  challenges.
                </p>
                <p>
                  Now in its 6th year, we&apos;re taking a look at how digital devices such as
                  smartphones, laptops, and televisions have become an integral part of our daily
                  lives in today&apos;s fast-paced and hyper-connected world. From work, social
                  interactions, to entertainment-technology gives us convenience and connectivity
                  but it can also take a toll on our mental and physical health.
                </p>
                <p>
                  HackOMania 2025 challenges you to develop innovative solutions to break free from
                  digital addictions, unhealthy habits, and reconnect with the real world.
                  Let&apos;s build a{" "}
                  <span className="font-bold italic">
                    healthier, more connected world, together!
                  </span>
                </p>
              </div>
              <div className="mb-auto mt-3 flex flex-wrap justify-start gap-4">
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
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <section
          className="group relative py-10 intersect:animate-slide-in-from-right"
          id="challenges"
        >
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-blue md:mb-14 md:flex-row md:text-6xl">
            <Image
              src="/stickers/muscle.png"
              alt=""
              width={80}
              height={80}
              className="rotate-[-6deg] hover:animate-wobble"
            />
            <h2 className="text-balance text-center md:text-start">CHALLENGES</h2>
          </div>
          <ChallengesSection />
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <section className="group relative py-10 intersect:animate-slide-in-from-left" id="judges">
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-green md:mb-14 md:flex-row md:text-6xl">
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2 className="text-balance text-center md:text-start">JUDGES AND MENTORS</h2>
          </div>
          <JudgesMentors />
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <section className="group relative py-10 intersect:animate-slide-in-from-right" id="prizes">
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-green md:mb-14 md:flex-row md:text-6xl">
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2 className="text-balance text-center md:text-start">PRIZES</h2>
          </div>
          <PrizesSection />
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <TimelineSection />

        <section
          className="group relative py-10 intersect:animate-slide-in-from-left"
          id="golden-rules"
        >
          <div className="flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-blue md:flex-row md:text-6xl">
            <Image src="/BlueIcon.svg" alt="" width={60} height={60} />
            <h2 className="text-balance text-center md:text-start">7 GOLDEN RULES</h2>
          </div>
          <GoldenRulesSection />
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <section className="group relative py-10 intersect:animate-slide-in-from-right" id="venue">
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-green md:mb-14 md:flex-row md:text-6xl">
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2 className="text-balance text-center md:text-start">VENUE</h2>
          </div>

          <div>
            <div className="py-10" id="pre-event">
              <h3 className="mb-4 text-2xl font-bold text-hackomania-green md:text-5xl">
                PRE EVENT
              </h3>

              <div className="flex flex-col gap-5 md:flex-row">
                <iframe
                  title="Lazada One Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7946893513426!2d103.84796911744382!3d1.2979024999999969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19ec2599519d%3A0x809fd655663da6d0!2sLazada%20One!5e0!3m2!1sen!2stw!4v1735830756269!5m2!1sen!2stw"
                  className="h-auto w-full border-0 md:w-1/2"
                  loading="lazy"
                  aria-label="Map showing location of Lazada One at 51 Bras Basah Road"
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
                  title="CapitaGreen Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8203085885248!2d103.8481571806732!3d1.2815570723565077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da190dd3c9d033%3A0x4cadb1e9e5280c4a!2s138%20Market%20St%2C%20%2320-01%20CapitaGreen%2C%20Singapore%20048946!5e0!3m2!1sen!2stw!4v1735830681400!5m2!1sen!2stw"
                  className="h-auto w-full border-0 md:w-1/2"
                  loading="lazy"
                  aria-label="Map showing location of CapitaGreen at 138 Market Street"
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
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <section className="group relative py-8 intersect:animate-slide-in-from-left" id="sponsors">
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-red md:mb-14 md:flex-row md:text-6xl">
            <Image src="/RedStar.svg" alt="" width={60} height={60} />
            <h2 className="text-balance text-center md:text-start">SPONSORS</h2>
          </div>
          <Sponsors />
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>

        <section
          className="group relative py-8 intersect:animate-slide-in-from-right"
          id="organizers"
        >
          <div className="mb-7 flex flex-col items-center gap-5 text-3xl font-bold text-hackomania-red md:mb-14 md:flex-row md:text-6xl">
            <Image
              src="/MeetTheTeam.svg"
              alt="Icon"
              width={60}
              height={60}
              className="intersect:animate-spin-slow"
            />
            <h2 className="text-balance text-center md:text-start">Meet the Organizers</h2>
          </div>
          <OrganizersSection />
          <div className={`grid-bg absolute bottom-[-16px] h-96 w-full md:h-60`}></div>
        </section>
      </div>
    </>
  );
}
