"use client";

import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaXmark } from "react-icons/fa6";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navigationLinks = [
  { title: "REGISTRATION", href: "#registration" },
  { title: "ABOUT", href: "#about" },
  { title: "CHALLENGES", href: "#challenges" },
  { title: "JUDGES", href: "#judges" },
  { title: "PRIZES", href: "#prizes" },
  { title: "TIMELINE", href: "#timeline" },
  { title: "VENUE", href: "#venue" },
  { title: "SPONSORS", href: "#sponsors" },
  { title: "ORGANIZERS", href: "#organizers" },
  { title: "CONTACT", href: "#contact" },
];

export default function NavigtionBar() {
  const [expandMobileNav, setExpandMobileNav] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <>
      <motion.div
        className={`fixed top-0 z-50 w-screen`}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-hackomania-red p-5 lg:mx-20 lg:mt-10">
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
                    <Link
                      href={link.href}
                      className="text-white"
                      onClick={() => setExpandMobileNav(false)}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* Spacer div to prevent content from being hidden under fixed navbar */}
      <div className="h-[80px] md:h-[120px]"></div>
    </>
  );
}
