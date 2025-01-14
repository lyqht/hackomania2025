import Link from "next/link";
import Image from "next/image";
import { FaTelegram, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full p-5 text-start text-white md:p-16 lg:p-20">
      <div className="mx-auto max-w-6xl">
        {/* About Section */}
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-3xl font-bold md:text-5xl">About GeeksHacking</h2>
          <Image
            src="/geekshacking.png"
            alt="GeeksHacking Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>
        <div className="mb-4 space-y-4 text-lg">
          <p>
            GeeksHacking is a geeky community that seeks to Give back and Grow together. We organize
            events and workshops to help students and professionals alike to learn and grow
            together. HackOMania is one of our flagship events that we organize annually.
          </p>
        </div>

        {/* Header Section */}
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-3xl font-bold md:text-5xl">CONTACT US</h2>
        </div>

        {/* Content Section */}
        <div className="space-y-4 text-lg">
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
                href="https://www.facebook.com/HackOManiaSG"
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

          {/* Social Media Section */}
          <div>
            <h3 className="mb-4 text-xl font-bold md:text-3xl">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="https://t.me/geekshacking" target="_blank" rel="noopener noreferrer">
                <FaTelegram className="text-2xl md:text-3xl" />
              </Link>
              <Link
                href="https://www.facebook.com/HackOManiaSG"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="text-2xl md:text-3xl" />
              </Link>
              <Link
                href="https://www.instagram.com/geekshacking"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-2xl md:text-3xl" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/geekshacking"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-2xl md:text-3xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
