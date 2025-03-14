import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full p-5 text-start text-white md:px-20 lg:px-32">
      <div className="">
        <p className="text-balance text-lg">
          GeeksHacking is a geeky community that seeks to Give back and Grow together. We organize
          events and workshops to help students and professionals alike to learn and grow together.
          HackOMania is one of our flagship events that we organize annually.
        </p>
        <div className="mb-10 mt-4">
          <Link
            href="https://github.com/lyqht/hackomania2025"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 border-4 border-white p-3 px-5 text-base font-bold text-white transition-all hover:bg-white hover:text-hackomania-red"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Star the website repo
          </Link>
        </div>
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
            aria-label="GeeksHacking Logo"
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
                className="border-b-yellow border-b text-yellow-300 hover:border-b-2"
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
                className="border-b-yellow border-b text-yellow-300 hover:border-b-2"
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
                href="https://github.com/geekshacking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 transition-all duration-300 hover:-translate-y-1 hover:text-yellow-400"
                aria-label="GeeksHacking GitHub Organisation page"
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
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </Link>
              <Link
                href="https://t.me/+Bm2NuYfzo243NThl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 transition-all duration-300 hover:-translate-y-1 hover:text-yellow-400"
                aria-label="Telegram of GeeksHacking"
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
                className="text-yellow-300 hover:-translate-y-1 hover:text-yellow-400"
                aria-label="Facebook for HackOMania"
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
                className="text-yellow-300 hover:-translate-y-1 hover:text-yellow-400"
                aria-label="Instagram for GeeksHacking"
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
                className="text-yellow-300 hover:-translate-y-1 hover:text-yellow-400"
                aria-label="LinkedIn for GeeksHacking"
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
