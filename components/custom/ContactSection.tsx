import Link from "next/link";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full p-5 text-start text-white md:p-16 lg:p-20">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-12 flex items-center gap-4">
          <h2 className="text-3xl font-bold md:text-5xl">CONTACT US</h2>
          <Image
            src="/geekshacking.png"
            alt="GeeksHacking Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-lg">
          {/* Telegram Section */}
          <div>
            Click{" "}
            <Link href="https://t.me/geekshacking" className="text-yellow-300 hover:underline">
              here
            </Link>{" "}
            to join GeeksHacking&apos;s Telegram channel!
          </div>

          {/* General Enquiries Section */}
          <div>
            <h3 className="mb-2 text-xl font-bold md:text-3xl">For general enquiries</h3>
            <p>
              Drop us an email at{" "}
              <Link
                href="mailto:contact@geekshacking.com"
                className="text-yellow-300 hover:underline"
              >
                contact@geekshacking.com
              </Link>{" "}
              or contact us through our{" "}
              <Link
                href="https://facebook.com/geekshacking"
                className="text-yellow-300 hover:underline"
              >
                Facebook page
              </Link>
              .
            </p>
          </div>

          {/* Sponsorship Section */}
          <div>
            <h3 className="mb-2 text-xl font-bold md:text-3xl">For sponsorships</h3>
            <p>
              Please contact{" "}
              <Link
                href="mailto:sponsor@geekshacking.com"
                className="text-yellow-300 hover:underline"
              >
                sponsor@geekshacking.com
              </Link>{" "}
              for sponsorship enquiries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
