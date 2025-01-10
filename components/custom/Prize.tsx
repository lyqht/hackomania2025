import Image from "next/image";
export default function Prize({ index }: { index: number }) {
  const prizes = [
    {
      title: "Champion",
      amt: "$1,500",
      img: "/prizes/Champion.svg",
    },
    {
      title: "1st Runner Up",
      amt: "$1,000",
      img: "/prizes/1stRunnerUp.svg",
    },
    {
      title: "2nd Runner Up",
      amt: "$500",
      img: "/prizes/2ndRunnerUp.svg",
    },
    {
      title: "People's Choice",
      amt: "$500",
      img: "/prizes/PeopleChoice.svg",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3 font-bold text-hackomania-green">
      <Image
        src={prizes[index].img}
        alt={prizes[index].title}
        width={index === 0 ? 200 : 150}
        height={index === 0 ? 200 : 150}
      />
      <h3
        className={`${index === 0 ? "my-2 text-3xl md:text-5xl" : "text-2xl md:text-4xl"} text-center`}
      >
        {prizes[index].title}
      </h3>
      <p className="text-xl md:text-3xl">{prizes[index].amt}</p>
    </div>
  );
}
