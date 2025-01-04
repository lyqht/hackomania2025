import Image from "next/image";
export default function Prize({ index }: { index: number }) {
  const prizes = [
    {
      title: "Champion",
      amt: "$1,500",
      img: "/prizes/Champion.png",
    },
    {
      title: "1st Runner Up",
      amt: "$1,000",
      img: "/prizes/1stRunnerUp.png",
    },
    {
      title: "2nd Runner Up",
      amt: "$500",
      img: "/prizes/2ndRunnerUp.png",
    },
    {
      title: "People's Choice",
      amt: "$500",
      img: "/prizes/PeopleChoice.png",
    },
  ];

  return (
    <div className="flex flex-col items-center font-bold text-hackomania-green">
      <Image
        src={prizes[index].img}
        alt={prizes[index].title}
        width={index === 0 ? 200 : 150}
        height={index === 0 ? 200 : 150}
      />
      <h3
        className={`${index === 0 ? "mb-2 text-3xl md:text-5xl" : "text-2xl md:text-4xl"} text-center`}
      >
        {prizes[index].title}
      </h3>
      <p className="text-xl md:text-3xl">{prizes[index].amt}</p>
    </div>
  );
}
