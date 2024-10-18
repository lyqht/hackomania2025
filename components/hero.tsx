import Image from "next/image";
export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex items-center justify-center gap-8">
        <a href="https://geekshacking.com">
          <Image
            width={180}
            height={120}
            layout="responsive"
            src="/geekshacking.webp"
            alt="GeeksHacking Singapore"
          />
        </a>
      </div>
      <h1 className="sr-only">HackOMania 2025</h1>
      <p className="mx-auto max-w-xl text-center text-3xl !leading-tight lg:text-4xl">
        Get <b>Healthy</b>, Get <b>Connected</b>
      </p>
      <div className="mt-8 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]" />
    </div>
  );
}
