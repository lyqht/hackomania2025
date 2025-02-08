"use client";

import Image from "next/image";
import { ReactElement } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function ImageCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2000 })]);

  const imageLinks: ReactElement[] = [
    <Image
      height={0}
      width={0}
      src="/hackomania24/photo.jpg"
      alt="HackOMania 2024 Image"
      key="1"
      className="h-auto w-full object-cover"
      unoptimized={true}
    />,
    <Image
      height={0}
      width={0}
      src="/hackomania24/photo1.jpg"
      alt="HackOMania 2024 Image"
      key="2"
      className="h-auto w-full object-cover"
      unoptimized={true}
    />,
    <Image
      height={0}
      width={0}
      src="/hackomania24/photo2.jpg"
      alt="HackOMania 2024 Image"
      key="3"
      className="h-auto w-full object-cover"
      unoptimized={true}
    />,
    <Image
      height={0}
      width={0}
      src="/hackomania24/photo3.jpg"
      alt="HackOMania 2024 Image"
      key="4"
      className="h-auto w-full object-cover"
      unoptimized={true}
    />,
    <Image
      height={0}
      width={0}
      src="/hackomania24/photo4.jpg"
      alt="HackOMania 2024 Image"
      key="5"
      className="h-auto w-full object-cover"
      unoptimized={true}
    />,
  ];

  return (
    <div className="embla h-full w-full overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex h-full w-full flex-nowrap">
        {imageLinks.map((image, index) => (
          <div className="embla__slide flex-[0_0_100%]" key={index}>
            {image}
          </div>
        ))}
      </div>
    </div>
  );
}
