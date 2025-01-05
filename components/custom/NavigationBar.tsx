"use client";

import styles from "./NavigationBar.module.css";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaXmark } from "react-icons/fa6";
import Link from "next/link";

const navigationLinks = [
  { title: "REGISTRATION", href: "#registration" },
  { title: "ABOUT", href: "#about" },
  { title: "CHALLENGES", href: "#challenges" },
  { title: "PRIZES", href: "#prizes" },
  { title: "TIMELINE", href: "#timeline" },
  { title: "VENUE", href: "#venue" },
  { title: "SPONSORS", href: "#sponsors" },
  { title: "TEAM", href: "#team" },
  { title: "CONTACT", href: "#contact" },
];

export default function NavigtionBar() {
  const [expandMobileNav, setExpandMobileNav] = useState(false);

  // TODO: Add Framer Motion Animate

  return (
    <div className={`w-screen ${styles.grid} pb-10`}>
      <div className="m-2 bg-hackomania-red p-5 md:mx-20 md:my-10">
        <nav className="hidden flex-row justify-end gap-3 text-white md:flex" id="full-nav">
          {navigationLinks.map((link) => (
            <Link key={link.title} href={link.href} className="text-white">
              {link.title}
            </Link>
          ))}
        </nav>

        {expandMobileNav ? (
          <FaXmark
            className="ml-auto block text-2xl text-white md:hidden"
            onClick={() => setExpandMobileNav(false)}
          />
        ) : (
          <RxHamburgerMenu
            className="ml-auto block text-2xl text-white md:hidden"
            onClick={() => setExpandMobileNav(true)}
          />
        )}

        {expandMobileNav && (
          <nav className="flex flex-col gap-3" id="mobile-nav">
            {navigationLinks.map((link) => (
              <Link key={link.title} href={link.href} className="text-white">
                {link.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
