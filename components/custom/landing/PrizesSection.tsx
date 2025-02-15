"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const prizes = [
  {
    title: "Interledger",
    amount: "$1,000",
    img: "/sponsors/InterledgerFoundation.png",
    width: 572 * 0.4,
    height: 162 * 0.4,
  },
  {
    title: "Kitchen Copilot",
    amount: "$1,000",
    img: "/sponsors/Kitchen_Copilot.png",
    width: 572 * 0.4,
    height: 162 * 0.4,
  },
  {
    title: "GeeksHacking",
    amount: "$1,000",
    img: "/geekshacking.png",
    width: 420 * 0.4,
    height: 162 * 0.4,
  },
  {
    title: "People's Choice",
    amount: "$500",
    img: "/prizes/PeopleChoice.svg",
    description: "",
    width: 120,
    height: 120,
  },
];

interface PrizeProps {
  img: string;
  title: string;
  description?: string;
  width: number;
  height: number;
  amount: string;
}

function Prize({ img, title, description = "challenge prize", width, height, amount }: PrizeProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 p-4"
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
      <span className="flex flex-col items-center gap-2">
        <span className="text-center text-2xl font-semibold md:text-3xl">{title}</span>
        {description != "" && <span className="text-xl md:text-2xl">{description}</span>}
      </span>
      <p className="text-xl md:text-2xl">{amount}</p>
    </motion.div>
  );
}

export default function PrizesSection() {
  return (
    <div className="flex flex-col gap-12 px-8 md:py-14">
      <div className="flex w-full flex-col items-center justify-center gap-10 md:flex-row md:gap-20">
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
