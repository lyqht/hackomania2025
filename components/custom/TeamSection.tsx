"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/app/api/team/route";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa6";

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    async function fetchTeamMembers() {
      const response = await fetch("/api/team");
      const data = await response.json();
      console.log(data);
      setTeamMembers(data);
    }

    fetchTeamMembers();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {teamMembers.map((member: TeamMember) => (
        <Profile key={member.name} member={member} />
      ))}
    </div>
  );
}

function Profile({ member }: { member: TeamMember }) {
  useEffect(() => console.log(member), []);
  return (
    <div className="group relative h-40 max-w-full overflow-hidden rounded-xl bg-white md:h-[265px]">
      <Image
        alt={member.name}
        src={`/team/images/${member.name.replace(" ", "").toLowerCase()}.jpg`}
        width={100}
        height={50}
        className="h-full w-full object-cover"
      />
      <div
        id="details-overlay"
        className="absolute left-0 top-0 z-10 h-full w-full overflow-hidden rounded-xl bg-black bg-opacity-40 p-5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex-grow"></div>
          <p className="text-2xl font-bold md:text-3xl">{member.name}</p>
          <p className="mb-3">
            {member.team} - {member.role == "" ? "Core Member" : member.role}
          </p>
          <div className="flex flex-row gap-3">
            {member.linkedin && (
              <Link href={member.linkedin}>
                <FaLinkedin className="text-2xl md:text-3xl" />
              </Link>
            )}
            {member.github && (
              <Link href={member.github}>
                <FaGithub className="text-2xl md:text-3xl" />
              </Link>
            )}
            {member.twitter && (
              <Link href={member.twitter}>
                <FaTwitter className="text-2xl md:text-3xl" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
