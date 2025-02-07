"use client";

import Image from "next/image";
import { ReactElement } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

export default function ImageCarousel() {
  const imageLinks: ReactElement[] = [
    <Image
      width={0}
      height={0}
      src="/hackomania24/photo.jpg"
      alt="HackOMania 2024 Image"
      key="1"
      className="w-full object-cover"
      unoptimized={true}
    />,
    <Image
      width={0}
      height={0}
      src="/hackomania24/photo1.jpg"
      alt="HackOMania 2024 Image"
      key="2"
      className="w-full object-cover"
      unoptimized={true}
    />,
    <Image
      width={0}
      height={0}
      src="/hackomania24/photo2.jpg"
      alt="HackOMania 2024 Image"
      key="3"
      className="w-full object-cover"
      unoptimized={true}
    />,
    <Image
      width={0}
      height={0}
      src="/hackomania24/photo3.jpg"
      alt="HackOMania 2024 Image"
      key="4"
      className="w-full object-cover"
      unoptimized={true}
    />,
    <Image
      width={0}
      height={0}
      src="/hackomania24/photo4.jpg"
      alt="HackOMania 2024 Image"
      key="5"
      className="w-full object-cover"
      unoptimized={true}
    />,
  ];

  return (
    <AliceCarousel
      disableButtonsControls
      autoHeight
      autoPlay
      autoPlayInterval={1000}
      infinite
      items={imageLinks}
    />
  );
}
