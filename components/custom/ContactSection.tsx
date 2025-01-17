import Link from "next/link";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full p-5 text-start text-white md:px-20 lg:px-32">
      <div className="">
        <p className="text-balance text-lg">
          GeeksHacking is a geeky community that seeks to Give back and Grow together. We organize
          events and workshops to help students and professionals alike to learn and grow together.
          HackOMania is one of our flagship events that we organize annually.
        </p>
        <hr className="my-10" />
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
          {/* General Enquiries Section */}
          <div>
            <h3 className="mb-2 text-xl font-bold md:text-3xl">For General Inquiries</h3>
            <p>
              Drop us an email at{" "}
              <Link
                href="mailto:contact@geekshacking.com"
                className="text-yellow-300 hover:underline"
              >
                contact@geekshacking.com
              </Link>
            </p>
          </div>

          {/* Sponsorship Section */}
          <div>
            <h3 className="mb-2 text-xl font-bold md:text-3xl">For Sponsorships</h3>
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

          {/* Follow Us Section */}
          <div>
            <h3 className="mb-4 text-xl font-bold md:text-3xl">Follow Us</h3>
            <div className="flex gap-6">
              <Link
                href="https://t.me/geekshacking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2L2 11l8 3M21.5 2L18 22l-6.5-8M21.5 2L10 14" />
                </svg>
              </Link>
              <Link
                href="https://www.facebook.com/HackOManiaSG/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/geekshacking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/geekshacking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
