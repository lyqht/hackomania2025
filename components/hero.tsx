"use client"

import useTranslate from "@/hooks/useTranslate";

export default function Hero() {
  const { t } = useTranslate();
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <a href="https://geekshacking.com">
          <img width={180} src="/geekshacking.webp" alt="GeeksHacking Singapore" />
        </a>
      </div>
      <h1 className="sr-only">HackOMania 2025</h1>
      <span className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center" dangerouslySetInnerHTML={{ __html: t("hackathon_theme") }} />
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
