"use client"

import styles from "./NavigationBar.module.css";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';

const navigationLinks = [
    { title: "REGISTRATION", href: "" },
    { title: "ABOUT", href: "" },
    { title: "CHALLENGES", href: "" },
    { title: "PRIZES", href: "" },
    { title: "TIMELINE", href: "" },
    { title: "VENUE", href: "" },
    { title: "SPONSORS", href: "" },
    { title: "TEAM", href: "" },
    { title: "CONTACT", href: "" },
]

export default function NavigtionBar() {
    const [ expandMobileNav, setExpandMobileNav ] = useState(false);

    // TODO: Add Framer Motion Animate

    return (
        <div className={`w-screen ${styles.grid} pb-20`}>
            <div className="p-5 m-2 md:m-5 bg-hackomania-red">
                <nav className="hidden md:flex flex-row justify-end text-white gap-3" id="full-nav">
                    {navigationLinks.map((link) => (
                        <a key={link.title} href={link.href} className="text-white">{link.title}</a>
                    ))}
                </nav>
                
                { expandMobileNav ? 
                    <FaXmark 
                        className="ml-auto block md:hidden text-white text-2xl"
                        onClick={() => setExpandMobileNav(false)}
                    />
                    : 
                    <RxHamburgerMenu 
                        className="ml-auto block md:hidden text-white text-2xl"
                        onClick={() => setExpandMobileNav(true)}
                    /> 
                }

                { expandMobileNav && (
                    <nav className="flex flex-col gap-3" id="mobile-nav">
                        {navigationLinks.map((link) => (
                            <a key={link.title} href={link.href} className="text-white">{link.title}</a>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    )
}