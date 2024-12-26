import GoldenRule from "@/components/custom/GoldenRule";
import Prize from "@/components/custom/Prize";
import { goldenRules } from "@/public/data/goldenrules";
import Image from "next/image";

export default async function Index() {
  return (
    <>
      <div className="flex flex-1 flex-col p-5 md:p-20 overflow-hidden">
        <head>
          {/* HackOMania 2025 Logo goes here */}
        </head>

        <section className="py-10" id="about">
          <div className="mb-7 md:mb-14 text-hackomania-red text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="about-title">
            <Image src="/RedStar.svg" alt="Star" width={60} height={60} />
            <h1>HACKOMANIA 2024</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <Image src="https://placehold.co/600x400" alt="placeholder" width={600} height={400} />
            <div>
              <div>
                <p><span className="font-bold italic">HackOMania 2024</span> marked our return after covid lockdowns and lifting of restrictions.</p>
                <p className="mt-3"><span className="font-bold italic">Rakuten</span> hosted us as we Innovated for tomorrow, building a resilient future! We thought it would be a slow start but we were blown away by the enthusiasm of the participants and sponsors. </p>
              </div>

              <button className="bg-hackomania-red text-xl font-bold w-full py-3 rounded-md text-white">
                SEE MORE
              </button>
            </div>
          </div>
        </section>

        {/* <section className="py-10" id="challenges">
          <div className="mb-7 md:mb-14 text-hackomania-blue text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="about-title">
            <Image src="/BlueIcon.svg" alt="" width={60} height={60} className="fill-hackomania-blue" />
            <h2>CHALLENGES</h2>
          </div>

          
        </section> */}

        <section className="py-10" id="prizes">
          <div className="mb-7 md:mb-14 text-hackomania-green fill-hackomania-green text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="prizes-title">
            <Image src="/GreenStar.svg" alt="star" width={60} height={60} />
            <h2>PRIZES</h2>
          </div>

          <div>
            <Prize index={0} />

            <div className="mt-5 flex flex-col md:flex-row md:gap-20 justify-center">
              <Prize index={1} />
              <Prize index={2} />
              <Prize index={3} />
            </div>   
          </div>      
        </section>

        <section className="py-10" id="prizes">
          <div className="mb-5 md:mb-10 text-hackomania-blue text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="rules-title">
            <Image src="/BlueIcon.svg" alt="" width={60} height={60} className="fill-hackomania-blue" />
            <h2>9 GOLDEN RULES</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-5" id="golden-rules-grid">
            {goldenRules.map((rule, index) => (
              <GoldenRule key={index} rule={rule.description} title={rule.title} index={index} />
            ))}
          </div>
        </section>

        <section className="py-10" id="venue">
          <div className="mb-5 md:mb-10 text-hackomania-green text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="roles-title">
            <Image src="/GreenStar.svg" alt="" width={60} height={60} />
            <h2>VENUE</h2>
          </div>
          
          <section id="pre-event">
            <h2 className="text-hackomania-green text-2xl md:text-5xl font-bold mb-4">PRE EVENT</h2>

            <div className="flex flex-col md:flex-row gap-5">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4212.125700952453!2d103.8476065607605!3d1.2978671117348162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19ec2599519d%3A0x809fd655663da6d0!2sLazada%20One!5e1!3m2!1sen!2ssg!4v1735041072542!5m2!1sen!2ssg" className="border-0 h-auto w-full md:w-1/2" loading="lazy"></iframe>

              <div>
                <h3 className="text-hackomania-green text-xl md:text-4xl font-bold mb-4">GETTING HERE</h3>

                <div className="mb-2">
                  <h4 className="text-hackomania-green font-bold text-lg md:text-2xl">Address</h4>
                  <p className="text-lg">51 Bras Basah Rd, #04-08 Lazada One<br />Singapore 189554</p>
                </div>
                <div className="mb-2">
                  <h4 className="text-hackomania-green font-bold text-lg md:text-2xl">Date</h4>
                  <p className="text-lg">8th February 2025</p>
                </div>
                <div>
                  <h4 className="text-hackomania-green font-bold text-lg md:text-2xl">Time</h4>
                  <p className="text-lg">9:30am to 4:30pm</p>
                </div>
              </div>
            </div>
          </section>

          <section id="main-event" className="my-8">
            <h2 className="text-hackomania-green text-2xl md:text-5xl font-bold mb-4">MAIN EVENT</h2>

            <div className="flex flex-col md:flex-row gap-5">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4212.125700952453!2d103.8476065607605!3d1.2978671117348162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19ec2599519d%3A0x809fd655663da6d0!2sLazada%20One!5e1!3m2!1sen!2ssg!4v1735041072542!5m2!1sen!2ssg" className="border-0 h-auto w-full md:w-1/2" loading="lazy"></iframe>

              <div>
                <h3 className="text-hackomania-green text-xl md:text-4xl font-bold mb-4">GETTING HERE</h3>

                <div className="mb-2">
                  <h4 className="text-hackomania-green font-bold text-lg md:text-2xl">Address</h4>
                  <p className="text-lg">138 Market St, #20-01 CapitaGreen<br />Singapore 048946</p>
                </div>
                <div className="mb-2">
                  <h4 className="text-hackomania-green font-bold text-lg md:text-2xl">Date</h4>
                  <p className="text-lg">15th to 16th February 2025</p>
                </div>
                <div>
                  <h4 className="text-hackomania-green font-bold text-lg md:text-2xl">Time</h4>
                  <p className="text-lg">15th February, 10:30am to 16th February, 5:30pm</p>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="py-10" id="team">
          <div className="mb-7 md:mb-14 text-hackomania-red text-3xl md:text-6xl font-bold flex flex-row gap-3 items-center" id="team-title">
            <Image src="/MeetTheTeam.svg" alt="Icon" width={60} height={60} className="fill-hackomania-red" />
            <h2>MEET THE TEAM</h2>
          </div>

        </section>
      </div>
    </>
  );
}
