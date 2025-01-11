"use client";

import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaXmark } from "react-icons/fa6";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className={`relative w-screen`}>
      <div className="m-2 bg-hackomania-red p-5 md:mx-20 md:my-10">
        <nav className="hidden flex-row justify-end gap-3 text-white md:flex" id="full-nav">
          {navigationLinks.map((link) => (
            <motion.div key={link.title} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href={link.href} className="text-white hover:underline">
                {link.title}
              </Link>
            </motion.div>
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

        <AnimatePresence>
          {expandMobileNav && (
            <motion.nav
              className="flex flex-col gap-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navigationLinks.map((link) => (
                <motion.div
                  key={link.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Link href={link.href} className="text-white">
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      <div className={`grid-bg absolute h-96 w-full md:h-60`}></div>
    </div>
  );
}
