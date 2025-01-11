import Image from "next/image";

const prizes = [
  {
    title: "Champion",
    amount: "$1,500",
    img: "/prizes/Champion.svg",
    width: 200,
    height: 200,
    titleClassName: "my-2 text-3xl md:text-5xl text-center",
  },
  {
    title: "1st Runner Up",
    amount: "$1,000",
    img: "/prizes/1stRunnerUp.svg",
    width: 150,
    height: 150,
    titleClassName: "text-2xl md:text-4xl text-center",
  },
  {
    title: "2nd Runner Up",
    amount: "$500",
    img: "/prizes/2ndRunnerUp.svg",
    width: 150,
    height: 150,
    titleClassName: "text-2xl md:text-4xl text-center",
  },
  {
    title: "People's Choice",
    amount: "$500",
    img: "/prizes/PeopleChoice.svg",
    width: 150,
    height: 150,
    titleClassName: "text-2xl md:text-4xl text-center",
  },
];

function Prize({
  title,
  amount,
  img,
  width,
  height,
  titleClassName,
}: {
  title: string;
  amount: string;
  img: string;
  width: number;
  height: number;
  titleClassName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 font-bold text-hackomania-green">
      <Image src={img} alt={title} width={width} height={height} priority />
      <h3 className={titleClassName}>{title}</h3>
      <p className="text-xl md:text-3xl">{amount}</p>
    </div>
  );
}

export default function Prizes() {
  return (
    <div>
      <Prize {...prizes[0]} />

      <div className="mt-10 flex flex-col justify-center gap-10 md:mt-14 md:flex-row md:gap-20">
        {prizes.slice(1).map((prize) => (
          <Prize key={prize.title} {...prize} />
        ))}
      </div>
    </div>
  );
}
