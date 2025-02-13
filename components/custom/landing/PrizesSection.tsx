"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const prizes = [
  {
    title: "Challenge 1 Winner",
    amount: "$1,000",
    img: "/prizes/Champion.svg",
    width: 150,
    height: 150,
  },
  {
    title: "Challenge 2 Winner",
    amount: "$1,000",
    img: "/prizes/Champion.svg",
    width: 150,
    height: 150,
  },
  {
    title: "Challenge 3 Winner",
    amount: "$1,000",
    img: "/prizes/Champion.svg",
    width: 150,
    height: 150,
  },
  {
    title: "People's Choice",
    amount: "$500",
    img: "/prizes/PeopleChoice.svg",
    width: 150,
    height: 150,
  },
];

interface PrizeProps {
  img: string;
  title: string;
  width: number;
  height: number;
  amount: string;
}

function Prize({ img, title, width, height, amount }: PrizeProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 p-4 font-bold text-hackomania-green"
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
        }}
        priority
      />
      <h3 className="text-center text-2xl md:text-3xl">{title}</h3>
      <p className="text-xl md:text-2xl">{amount}</p>
    </motion.div>
  );
}

export default function PrizesSection() {
  return (
    <div className="flex flex-col gap-12 px-8 md:py-14">
      <div className="flex w-full flex-col justify-center gap-10 md:flex-row md:gap-20">
        {prizes.slice(0, 3).map((prize, index) => (
          <motion.div
            key={prize.title}
            className="min-w-0 flex-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Prize {...prize} />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 3 * 0.2 }}
      >
        <Prize {...prizes[3]} />
      </motion.div>
    </div>
  );
}
