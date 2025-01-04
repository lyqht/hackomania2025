interface TimelineItemProps {
  time: string;
  event: string;
}

export function TimelineItem({ time, event }: TimelineItemProps) {
  return (
    <div className="group relative flex flex-col rounded-md border border-neutral-300 p-4">
      <div className="absolute bottom-0 right-0 h-0 w-0 border-b-[15px] border-r-[15px] border-b-transparent border-r-neutral-300 transition-colors duration-200 group-hover:border-r-red-600"></div>

      <span className="text-lg font-medium text-red-600">{time}</span>
      <span className="text-lg text-neutral-800">{event}</span>
    </div>
  );
}

interface ScheduleItem {
  time: string;
  event: string;
}

// Configure schedules here
const PREHACK_SCHEDULE: ScheduleItem[] = [
  { time: "08:30 AM", event: "Organizing team call time" },
  { time: "09:00 AM", event: "Venue Setup" },
  { time: "09:30 AM", event: "Registration" },
  { time: "10:00 AM", event: "Welcome and introduction" },
  { time: "10:15 AM", event: "Ice breaker" },
  { time: "10:30 AM", event: "Briefing" },
  { time: "10:45 AM", event: "Sponsors to talk about the challenge" },
  { time: "11:15 AM", event: "Q&A" },
  { time: "11:30 AM", event: "Main Hall Workshop Slot 1" },
  { time: "12:30 PM", event: "Lunch" },
  { time: "01:00 PM", event: "Main Hall Workshop Slot 2" },
  { time: "02:00 PM", event: "Break" },
  { time: "02:30 PM", event: "Main Hall Workshop Slot 3" },
  { time: "03:15 PM", event: "Closing, Lucky Draw & Phototaking" },
  { time: "03:45 PM", event: "Networking" },
  { time: "04:45 PM", event: "Clean-up venue" },
];

const DAY1_SCHEDULE: ScheduleItem[] = [
  { time: "09:00 AM", event: "Event Preparation" },
  { time: "10:45 AM", event: "Registration" },
  { time: "11:15 AM", event: "Introduction" },
  { time: "11:30 AM", event: "Rakuten intro" },
  { time: "11:45 AM", event: "Safety briefing" },
  { time: "12:00 PM", event: "Platinum sponsor key note" },
  { time: "12:15 PM", event: "Hackathon briefing" },
  { time: "12:30 PM", event: "Lunch" },
  { time: "01:00 PM", event: "Hackathon kick off & team registration start" },
  { time: "03:30 PM", event: "Team registration end" },
];

const DAY2_SCHEDULE: ScheduleItem[] = [
  { time: "12:00 AM", event: "Merch Giving" },
  { time: "08:00 AM", event: "Breakfast" },
  { time: "09:00 AM", event: "Start team submission" },
];

export default function Timeline() {
  return (
    <section className="flex flex-col gap-10 py-10 md:flex-row" id="timeline">
      <div className="relative h-[100px] min-h-0 w-full shrink bg-yellow-400 md:h-auto md:w-[180px] lg:w-[280px]">
        <div className="absolute start-[50%] top-1/2 flex origin-center -translate-x-1/2 -translate-y-1/2 rotate-0 items-center gap-2 md:start-[calc(100%-20px)] md:top-1/4 md:mt-12 md:-rotate-90 md:gap-4 lg:start-[calc(100%-42px)]">
          <svg
            width="98"
            height="95"
            viewBox="0 0 98 95"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[25px] md:w-[60px] lg:w-[98px]"
          >
            <path
              d="M31.9691 57.1844L15.9846 84.8705L33.0154 94.7033L49 67.0172L64.9846 94.7033L82.0154 84.8705L66.0309 57.1844H98V37.5189H66.0309L82.0154 9.83278L64.9846 0L49 27.6861L33.0154 0L15.9845 9.83278L31.9691 37.5189H0V57.1844H31.9691Z"
              fill="#FFFBF5"
            />
          </svg>
          <h2 className="whitespace-nowrap text-3xl font-bold uppercase text-white md:text-6xl lg:text-9xl">
            Timeline
          </h2>
        </div>
      </div>
      <div className="grid grow grid-cols-1 gap-8 md:grid-cols-3">
        {/* Pre-Hack Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold lg:text-4xl">PREHACK</h3>
          <div className="flex flex-col gap-3">
            {PREHACK_SCHEDULE.map((item, index) => (
              <TimelineItem key={index} time={item.time} event={item.event} />
            ))}
          </div>
        </div>

        {/* Day 1 Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold lg:text-4xl">DAY 1</h3>
          <div className="flex flex-col gap-3">
            {DAY1_SCHEDULE.map((item, index) => (
              <TimelineItem key={index} time={item.time} event={item.event} />
            ))}
          </div>
        </div>

        {/* Day 2 Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold lg:text-4xl">DAY 2</h3>
          <div className="flex flex-col gap-3">
            {DAY2_SCHEDULE.map((item, index) => (
              <TimelineItem key={index} time={item.time} event={item.event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
