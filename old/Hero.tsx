import Image from "next/image";
import styles from "./Hero.module.css";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-16">
      <div
        className={cn("absolute inset-0 -z-10", styles.animatedBackground)}
        style={{
          backgroundImage: "url(/hero-background.svg)",
          opacity: 0.3,
        }}
      />
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <h1 className="sr-only">HackOMania 2025</h1>
        <div></div>
        <span className="mx-auto flex max-w-3xl items-center gap-4 text-balance text-center text-4xl font-bold !leading-[4rem] lg:text-6xl lg:!leading-[7rem]">
          <span>
            <span className={styles.animatedText1}>Healthy living</span>
            <span className="hidden md:inline md:text-4xl md:!leading-[4rem] lg:text-6xl lg:!leading-[7rem]">
              {" for a"}
            </span>
            <br />
            <span className={styles.animatedText2}>connected world</span>
          </span>
        </span>

        <span className="flex items-center gap-2 rounded bg-white px-4 text-sm dark:bg-black">
          <span>A hackathon organized by</span>
          <Link href="https://geekshacking.com">
            <Image
              className="w-auto"
              width={60}
              height={40}
              src="/geekshacking.png"
              alt="GeeksHacking Singapore"
            />
          </Link>
        </span>
      </div>
      <div className="absolute bottom-0 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]" />
    </div>
  );
}
