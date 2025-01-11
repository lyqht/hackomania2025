"use client";

import { motion } from "framer-motion";
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

interface PrizeProps {
  img: string;
  title: string;
  width: number;
  height: number;
  titleClassName?: string;
  amount: string;
}

function Prize({ img, title, width, height, titleClassName, amount }: PrizeProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 font-bold text-hackomania-green"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={img}
        alt={title}
        width={width}
        height={height}
        style={{
          maxWidth: `${width}px`,
          width: "100%",
          height: "auto",
        }}
        priority
      />
      <h3 className={titleClassName}>{title}</h3>
      <p className="text-xl md:text-3xl">{amount}</p>
    </motion.div>
  );
}

export default function Prizes() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Prize {...prizes[0]} />
      </motion.div>

      <div className="mt-10 flex flex-col justify-center gap-10 md:mt-14 md:flex-row md:gap-20">
        {prizes.slice(1).map((prize, index) => (
          <motion.div
            key={prize.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Prize {...prize} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
